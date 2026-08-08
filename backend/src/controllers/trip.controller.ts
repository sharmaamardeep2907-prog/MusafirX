import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Trip, TripMember, Expense, SavedDestination, Wishlist, Review, Itinerary, CommunityPost, Blog, Booking, Destination } from '../config/database';

const safeString = (v: any): string | undefined => (typeof v === 'string' ? v : undefined);
const toClient = (doc: any): any => { if (!doc) return doc; return { ...doc, id: doc._id?.toString?.() || doc._id }; };

export const getMyTrips = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trips = await Trip.find({ userId: req.userId }).populate('destinationId','name slug imageUrl').sort({updatedAt:-1}).lean();
    const tripIds = trips.map(t => t._id);
    const [expenseCounts, memberCounts] = await Promise.all([
      Expense.aggregate([{$match:{tripId:{$in:tripIds}}},{$group:{_id:'$tripId',count:{$sum:1}}}]),
      TripMember.aggregate([{$match:{tripId:{$in:tripIds}}},{$group:{_id:'$tripId',count:{$sum:1}}}]),
    ]);
    const ecMap:any={}; expenseCounts.forEach((c:any)=>ecMap[c._id.toString()]=c.count);
    const mcMap:any={}; memberCounts.forEach((c:any)=>mcMap[c._id.toString()]=c.count);
    res.json(trips.map(t=>toClient({...t,_count:{expenses:ecMap[t._id.toString()]||0,members:mcMap[t._id.toString()]||0}})));
  }catch(e){console.error(e);res.status(500).json({message:'Internal server error'});}
};

export const getTripById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trip = await Trip.findById(req.params.id).populate({path:'destinationId',populate:{path:'stateId'}}).lean();
    if(!trip){res.status(404).json({message:'Trip not found'});return;}
    const [expenses,members,bookings]=await Promise.all([
      Expense.find({tripId:trip._id}).sort({date:-1}).lean(),
      TripMember.find({tripId:trip._id}).populate('userId','name avatar email').lean(),
      Booking.find({tripId:trip._id}).lean(),
    ]);
    const normalizedMembers=members.map((m:any)=>({...m,id:m._id,user:m.userId?{...m.userId,id:m.userId._id}:undefined}));
    res.json(toClient({...trip,expenses,members:normalizedMembers,bookings}));
  }catch(e){console.error(e);res.status(500).json({message:'Internal server error'});}
};

export const createTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {destinationId,title,description,startDate,endDate,totalDays,travelers,budget,travelStyle,notes}=req.body;
    const trip=await Trip.create({userId:req.userId!,destinationId,title,description,startDate:startDate?new Date(startDate):undefined,endDate:endDate?new Date(endDate):undefined,totalDays:totalDays||1,travelers:travelers||1,budget,travelStyle,notes});
    await TripMember.create({tripId:trip._id,userId:req.userId!,role:'OWNER'});
    const populated=await Trip.findById(trip._id).populate('destinationId','name slug imageUrl').lean();
    res.status(201).json(toClient(populated));
  }catch(e){console.error(e);res.status(500).json({message:'Internal server error'});}
};

export const updateTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trip=await Trip.findById(req.params.id);
    if(!trip){res.status(404).json({message:'Trip not found'});return;}
    if(trip.userId.toString()!==req.userId){res.status(403).json({message:'Not authorized'});return;}
    const updateData:any={...req.body};if(updateData.startDate)updateData.startDate=new Date(updateData.startDate);if(updateData.endDate)updateData.endDate=new Date(updateData.endDate);delete updateData.userId;
    const updated=await Trip.findByIdAndUpdate(req.params.id,updateData,{new:true}).populate('destinationId','name slug imageUrl').lean();
    res.json(toClient(updated));
  }catch(e){console.error(e);res.status(500).json({message:'Internal server error'});}
};

export const deleteTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trip=await Trip.findById(req.params.id);
    if(!trip){res.status(404).json({message:'Trip not found'});return;}
    if(trip.userId.toString()!==req.userId){res.status(403).json({message:'Not authorized'});return;}
    await Trip.findByIdAndDelete(req.params.id);
    await Promise.all([Expense.deleteMany({tripId:req.params.id}),TripMember.deleteMany({tripId:req.params.id}),Booking.deleteMany({tripId:req.params.id})]);
    res.json({message:'Trip deleted'});
  }catch(e){console.error(e);res.status(500).json({message:'Internal server error'});}
};

export const addExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {tripId,category,description,amount,date}=req.body;
    const expense=await Expense.create({tripId,userId:req.userId!,category,description,amount,date:date?new Date(date):new Date()});
    const result=await Expense.aggregate([{$match:{tripId:expense.tripId}},{$group:{_id:null,total:{$sum:'$amount'}}}]);
    await Trip.findByIdAndUpdate(tripId,{spentSoFar:result[0]?.total||0});
    res.status(201).json(toClient(expense.toObject()));
  }catch(e){console.error(e);res.status(500).json({message:'Internal server error'});}
};

export const deleteExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const expense=await Expense.findById(req.params.id);
    if(expense){
      await Expense.findByIdAndDelete(req.params.id);
      const result=await Expense.aggregate([{$match:{tripId:expense.tripId}},{$group:{_id:null,total:{$sum:'$amount'}}}]);
      await Trip.findByIdAndUpdate(expense.tripId,{spentSoFar:result[0]?.total||0});
    }
    res.json({message:'Expense deleted'});
  }catch(e){console.error(e);res.status(500).json({message:'Internal server error'});}
};

export const getSavedDestinations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const saved=await SavedDestination.find({userId:req.userId}).populate('destinationId','name slug imageUrl rating').sort({createdAt:-1}).lean();
    res.json(saved.map(toClient));
  }catch(e){console.error(e);res.status(500).json({message:'Internal server error'});}
};

export const saveDestination = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {destinationId,notes,collection}=req.body;
    const existing=await SavedDestination.findOne({userId:req.userId,destinationId});
    if(existing){res.status(409).json({message:'Already saved'});return;}
    const saved=await SavedDestination.create({userId:req.userId!,destinationId,notes,collection});
    res.status(201).json(toClient(saved.toObject()));
  }catch(e){console.error(e);res.status(500).json({message:'Internal server error'});}
};

export const unsaveDestination = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await SavedDestination.deleteOne({userId:req.userId!,destinationId:req.params.destinationId});
    res.json({message:'Removed from saved'});
  }catch(e){console.error(e);res.status(500).json({message:'Internal server error'});}
};

export const getWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const wishlist=await Wishlist.find({userId:req.userId}).populate('destinationId','name slug imageUrl rating budget').sort({createdAt:-1}).lean();
    res.json(wishlist.map(toClient));
  }catch(e){console.error(e);res.status(500).json({message:'Internal server error'});}
};

export const addToWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {destinationId,type,notes}=req.body;
    const item=await Wishlist.create({userId:req.userId!,destinationId,type,notes});
    res.status(201).json(toClient(item.toObject()));
  }catch(e){console.error(e);res.status(500).json({message:'Internal server error'});}
};

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {destinationId,hotelId,restaurantId,rating,title,content}=req.body;
    const review=await Review.create({userId:req.userId!,destinationId,hotelId,restaurantId,rating,title,content});
    const populated=await Review.findById(review._id).populate('userId','name avatar').lean();
    const result:any={...populated};
    if(result.userId&&typeof result.userId==='object'){result.user={id:result.userId._id,name:result.userId.name,avatar:result.userId.avatar};delete result.userId;}
    result.id=result._id;
    res.status(201).json(result);
  }catch(e){console.error(e);res.status(500).json({message:'Internal server error'});}
};

export const getItineraries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query:any=req.query as Record<string,string>;
    const filter:any={isPublic:true};
    if(query.destination){const dest=await Destination.findOne({slug:safeString(query.destination)});if(dest)filter.destinationId=dest._id;}
    const itineraries=await Itinerary.find(filter).populate('destinationId','name slug imageUrl').sort({createdAt:-1}).limit(20).lean();
    res.json(itineraries.map(toClient));
  }catch(e){console.error(e);res.status(500).json({message:'Internal server error'});}
};

export const getCommunityPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query:any=req.query as Record<string,string>;
    const pageNum=parseInt(query.page||'1',10);
    const limitNum=Math.min(parseInt(query.limit||'12',10),50);
    const [posts,total]=await Promise.all([
      CommunityPost.find().populate('userId','name avatar').sort({createdAt:-1}).skip((pageNum-1)*limitNum).limit(limitNum).lean(),
      CommunityPost.countDocuments(),
    ]);
    const normalizedPosts=posts.map((p:any)=>({...p,id:p._id,user:p.userId&&typeof p.userId==='object'?{id:p.userId._id,name:p.userId.name,avatar:p.userId.avatar}:p.userId,_count:{likes:p.likesCount||0,comments:p.commentsCount||0}}));
    res.json({posts:normalizedPosts,pagination:{page:pageNum,limit:limitNum,total,totalPages:Math.ceil(total/limitNum)}});
  }catch(e){console.error(e);res.status(500).json({message:'Internal server error'});}
};

export const getBlogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query:any=req.query as Record<string,string>;
    const pageNum=parseInt(query.page||'1',10);
    const limitNum=Math.min(parseInt(query.limit||'12',10),50);
    const filter:any={isPublished:true};
    if(query.category)filter.category=safeString(query.category);
    const [blogs,total]=await Promise.all([
      Blog.find(filter).select('title slug excerpt category imageUrl tags readTime createdAt destinationId userId').populate('destinationId','name slug').populate('userId','name avatar').sort({createdAt:-1}).skip((pageNum-1)*limitNum).limit(limitNum).lean(),
      Blog.countDocuments(filter),
    ]);
    res.json({blogs:blogs.map(toClient),pagination:{page:pageNum,limit:limitNum,total,totalPages:Math.ceil(total/limitNum)}});
  }catch(e){console.error(e);res.status(500).json({message:'Internal server error'});}
};

export const getBlogBySlug = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const blog=await Blog.findOne({slug:req.params.slug}).populate('userId','name avatar').populate('destinationId','name slug').lean();
    if(!blog){res.status(404).json({message:'Blog not found'});return;}
    res.json(toClient(blog));
  }catch(e){console.error(e);res.status(500).json({message:'Internal server error'});}
};