import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { State, City, Destination, Attraction, Hotel, Restaurant, Activity, Review } from '../config/database';

const safeString = (v: any): string | undefined => (typeof v === 'string' ? v : undefined);
const toClient = (doc: any): any => { if (!doc) return doc; return { ...doc, id: doc._id?.toString?.() || doc._id }; };

export const getStates = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const states = await State.aggregate([
      { $lookup: { from: 'destinations', localField: '_id', foreignField: 'stateId', as: 'dests' } },
      { $addFields: { destinationCount: { $size: '$dests' } } },
      { $project: { dests: 0 } },
      { $sort: { name: 1 } },
    ]);
    res.json(states.map(toClient));
  } catch (error) { console.error('Get states error:', error); res.status(500).json({ message: 'Internal server error' }); }
};

export const getDestinations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query: any = req.query as Record<string, string>;
    const pageNum = parseInt(query.page || '1', 10);
    const limitNum = Math.min(parseInt(query.limit || '20', 10), 50);
    const filter: any = {};
    if (query.state) { const st = await State.findOne({ slug: query.state }); if (st) filter.stateId = st._id; }
    if (query.city) { const ct = await City.findOne({ slug: query.city }); if (ct) filter.cityId = ct._id; }
    if (query.type) filter.type = safeString(query.type);
    if (query.isHiddenGem === 'true') filter.isHiddenGem = true;
    if (query.isTrending === 'true') filter.isTrending = true;
    if (query.search) {
      const s = safeString(query.search)!;
      filter.$or = [{ name: { $regex: s, $options: 'i' } }, { description: { $regex: s, $options: 'i' } }, { tags: s.toLowerCase() }];
    }
    const total = await Destination.countDocuments(filter);
    const destinations = await Destination.find(filter).populate('stateId','name slug').populate('cityId','name slug').sort({rating:-1}).skip((pageNum-1)*limitNum).limit(limitNum).lean();
    res.json({ destinations: destinations.map(toClient), pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total/limitNum) } });
  } catch (error) { console.error('Get destinations error:', error); res.status(500).json({ message: 'Internal server error' }); }
};

export const getDestinationBySlug = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const dest = await Destination.findOne({ slug: req.params.slug }).populate('stateId').populate('cityId').lean();
    if (!dest) { res.status(404).json({ message: 'Destination not found' }); return; }
    const [attractions, hotels, restaurants, activities, reviews] = await Promise.all([
      Attraction.find({ destinationId: dest._id }).sort({ rating: -1 }).limit(15).lean(),
      Hotel.find({ destinationId: dest._id }).sort({ rating: -1 }).limit(10).lean(),
      Restaurant.find({ destinationId: dest._id }).sort({ rating: -1 }).limit(10).lean(),
      Activity.find({ destinationId: dest._id }).limit(10).lean(),
      Review.find({ destinationId: dest._id }).sort({ createdAt: -1 }).limit(10).populate('userId','name avatar').lean(),
    ]);
    const normalizedReviews = reviews.map((r: any) => ({...r, id: r._id, user: r.userId && typeof r.userId === 'object' ? {id:r.userId._id,name:r.userId.name,avatar:r.userId.avatar} : r.userId}));
    const _count = { reviews: await Review.countDocuments({destinationId:dest._id}), hotels: await Hotel.countDocuments({destinationId:dest._id}), restaurants: await Restaurant.countDocuments({destinationId:dest._id}) };
    res.json(toClient({...dest, attractions:attractions.map(toClient), hotels:hotels.map(toClient), restaurants:restaurants.map(toClient), activities:activities.map(toClient), reviews:normalizedReviews, _count}));
  } catch (error) { console.error('Get destination error:', error); res.status(500).json({ message: 'Internal server error' }); }
};

export const getTrendingDestinations = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const destinations = await Destination.find({ isTrending: true }).populate('stateId','name slug').sort({rating:-1}).limit(12).lean();
    res.json(destinations.map(toClient));
  } catch (error) { console.error('Get trending error:', error); res.status(500).json({ message: 'Internal server error' }); }
};

export const getHiddenGems = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const destinations = await Destination.find({ isHiddenGem: true }).populate('stateId','name slug').sort({rating:-1}).limit(15).lean();
    res.json(destinations.map(toClient));
  } catch (error) { console.error('Get hidden gems error:', error); res.status(500).json({ message: 'Internal server error' }); }
};

export const getHotels = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query: any = req.query as Record<string, string>;
    const pageNum = parseInt(query.page || '1', 10);
    const limitNum = Math.min(parseInt(query.limit || '20', 10), 50);
    const filter: any = {};
    if (query.destination) { const dest = await Destination.findOne({ slug: query.destination }); if (dest) filter.destinationId = dest._id; }
    const total = await Hotel.countDocuments(filter);
    const hotels = await Hotel.find(filter).populate('destinationId','name slug').sort({rating:-1}).skip((pageNum-1)*limitNum).limit(limitNum).lean();
    res.json({ hotels: hotels.map(toClient), pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total/limitNum) } });
  } catch (error) { console.error('Get hotels error:', error); res.status(500).json({ message: 'Internal server error' }); }
};

export const getRestaurants = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query: any = req.query as Record<string, string>;
    const pageNum = parseInt(query.page || '1', 10);
    const limitNum = Math.min(parseInt(query.limit || '20', 10), 50);
    const filter: any = {};
    if (query.destination) { const dest = await Destination.findOne({ slug: query.destination }); if (dest) filter.destinationId = dest._id; }
    if (query.cuisine) filter.cuisine = { $regex: safeString(query.cuisine), $options: 'i' };
    const total = await Restaurant.countDocuments(filter);
    const restaurants = await Restaurant.find(filter).populate('destinationId','name slug').sort({rating:-1}).skip((pageNum-1)*limitNum).limit(limitNum).lean();
    res.json({ restaurants: restaurants.map(toClient), pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total/limitNum) } });
  } catch (error) { console.error('Get restaurants error:', error); res.status(500).json({ message: 'Internal server error' }); }
};

export const getActivities = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query: any = req.query as Record<string, string>;
    const filter: any = {};
    if (query.destination) { const dest = await Destination.findOne({ slug: query.destination }); if (dest) filter.destinationId = dest._id; }
    if (query.type) filter.type = safeString(query.type);
    const activities = await Activity.find(filter).populate('destinationId','name slug').sort({name:1}).limit(50).lean();
    res.json(activities.map(toClient));
  } catch (error) { console.error('Get activities error:', error); res.status(500).json({ message: 'Internal server error' }); }
};

export const search = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query = safeString((req.query as any).q) || '';
    if (query.length < 2) { res.json({ destinations: [], hotels: [], restaurants: [], activities: [] }); return; }
    const regex = { $regex: query, $options: 'i' };
    const [destinations, hotels, restaurants, activities] = await Promise.all([
      Destination.find({ $or: [{ name: regex }, { tags: query.toLowerCase() }] }).populate('stateId','name').limit(5).lean(),
      Hotel.find({ name: regex }).limit(5).lean(),
      Restaurant.find({ name: regex }).limit(5).lean(),
      Activity.find({ name: regex }).limit(5).lean(),
    ]);
    res.json({ destinations: destinations.map(toClient), hotels: hotels.map(toClient), restaurants: restaurants.map(toClient), activities: activities.map(toClient) });
  } catch (error) { console.error('Search error:', error); res.status(500).json({ message: 'Internal server error' }); }
};

export { getStateBySlug };