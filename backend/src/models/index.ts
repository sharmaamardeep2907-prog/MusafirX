import mongoose, { Schema, Document } from 'mongoose';

export const UserRole = { USER: 'USER', ADMIN: 'ADMIN' } as const;
export const TravelStyle = { LUXURY: 'LUXURY', BUDGET: 'BUDGET', BACKPACKING: 'BACKPACKING', FAMILY: 'FAMILY', SOLO: 'SOLO', ROMANTIC: 'ROMANTIC', ADVENTURE: 'ADVENTURE', SPIRITUAL: 'SPIRITUAL', PHOTOGRAPHY: 'PHOTOGRAPHY', FOODIE: 'FOODIE', NATURE: 'NATURE', HERITAGE: 'HERITAGE' } as const;
export const TripStatus = { DRAFT: 'DRAFT', PLANNED: 'PLANNED', ACTIVE: 'ACTIVE', COMPLETED: 'COMPLETED', CANCELLED: 'CANCELLED' } as const;
export const BookingStatus = { PENDING: 'PENDING', CONFIRMED: 'CONFIRMED', CANCELLED: 'CANCELLED', COMPLETED: 'COMPLETED' } as const;
export const NotificationType = { TRIP_REMINDER: 'TRIP_REMINDER', WEATHER_ALERT: 'WEATHER_ALERT', AI_RECOMMENDATION: 'AI_RECOMMENDATION', COMMUNITY_ACTIVITY: 'COMMUNITY_ACTIVITY', SAVED_DESTINATION_UPDATE: 'SAVED_DESTINATION_UPDATE', SYSTEM: 'SYSTEM' } as const;

const profileSchema = new Schema({ phone: { type: String }, location: { type: String }, travelStyle: { type: String, enum: Object.values(TravelStyle) }, favoriteDestinations: { type: String }, totalTrips: { type: Number, default: 0, min: 0 }, totalDestinations: { type: Number, default: 0, min: 0 }, memberSince: { type: Date, default: Date.now }, badges: [{ type: String }] }, { _id: false });

const userSchema = new Schema({ name: { type: String, required: [true, 'Name is required'], trim: true, minlength: 2, maxlength: 100 }, email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'] }, password: { type: String, required: [true, 'Password is required'], minlength: 6 }, avatar: { type: String }, bio: { type: String, maxlength: 500 }, role: { type: String, enum: Object.values(UserRole), default: UserRole.USER }, refreshToken: { type: String }, emailVerified: { type: Boolean, default: false }, verificationToken: { type: String }, resetPasswordToken: { type: String }, resetPasswordExpiry: { type: Date }, googleId: { type: String, unique: true, sparse: true }, profile: { type: profileSchema, default: () => ({}) } }, { timestamps: true });
userSchema.index({ email: 1 }); userSchema.index({ role: 1 }); userSchema.index({ googleId: 1 }, { sparse: true });
export const User = mongoose.model('User', userSchema);

const stateSchema = new Schema({ name: { type: String, required: true, unique: true, trim: true }, slug: { type: String, required: true, unique: true, lowercase: true, trim: true }, capital: String, description: String, imageUrl: String, region: String, bestSeason: String, language: String }, { timestamps: true });
stateSchema.index({ slug: 1 });
export const State = mongoose.model('State', stateSchema);

const citySchema = new Schema({ name: { type: String, required: true, trim: true }, slug: { type: String, required: true, lowercase: true, trim: true }, stateId: { type: Schema.Types.ObjectId, ref: 'State', required: true }, description: String, imageUrl: String, latitude: { type: Number, min: -90, max: 90 }, longitude: { type: Number, min: -180, max: 180 } }, { timestamps: true });
citySchema.index({ stateId: 1, slug: 1 }, { unique: true });
export const City = mongoose.model('City', citySchema);

const destinationSchema = new Schema({ name: { type: String, required: true, trim: true }, slug: { type: String, required: true, unique: true, lowercase: true, trim: true }, stateId: { type: Schema.Types.ObjectId, ref: 'State', required: true }, cityId: { type: Schema.Types.ObjectId, ref: 'City' }, description: String, longDescription: String, type: { type: String }, bestSeason: String, budget: String, rating: { type: Number, default: 4.0, min: 0, max: 5 }, reviewCount: { type: Number, default: 0, min: 0 }, imageUrl: String, images: [String], latitude: { type: Number, min: -90, max: 90 }, longitude: { type: Number, min: -180, max: 180 }, altitude: Number, weather: Schema.Types.Mixed, tags: [String], isHiddenGem: { type: Boolean, default: false }, isTrending: { type: Boolean, default: false }, isPopular: { type: Boolean, default: false } }, { timestamps: true });
destinationSchema.index({ slug: 1 }); destinationSchema.index({ stateId: 1 }); destinationSchema.index({ type: 1 }); destinationSchema.index({ isTrending: 1 }); destinationSchema.index({ isHiddenGem: 1 }); destinationSchema.index({ tags: 1 });
export const Destination = mongoose.model('Destination', destinationSchema);

const attractionSchema = new Schema({ name: { type: String, required: true, trim: true }, slug: { type: String, required: true, lowercase: true, trim: true }, destinationId: { type: Schema.Types.ObjectId, ref: 'Destination', required: true }, description: String, type: String, imageUrl: String, images: [String], entryFee: { type: Number, min: 0 }, openingHours: String, duration: String, rating: { type: Number, default: 4.0, min: 0, max: 5 }, latitude: Number, longitude: Number, isHiddenGem: { type: Boolean, default: false } }, { timestamps: true });
attractionSchema.index({ destinationId: 1 }); attractionSchema.index({ destinationId: 1, slug: 1 }, { unique: true });
export const Attraction = mongoose.model('Attraction', attractionSchema);

const hotelSchema = new Schema({ name: { type: String, required: true, trim: true }, slug: { type: String, required: true, lowercase: true, trim: true }, destinationId: { type: Schema.Types.ObjectId, ref: 'Destination', required: true }, description: String, type: String, pricePerNight: { type: Number, min: 0 }, rating: { type: Number, default: 4.0, min: 0, max: 5 }, reviewCount: { type: Number, default: 0, min: 0 }, imageUrl: String, images: [String], amenities: [String], latitude: Number, longitude: Number, address: String, phone: String, website: String }, { timestamps: true });
hotelSchema.index({ destinationId: 1 }); hotelSchema.index({ destinationId: 1, slug: 1 }, { unique: true }); hotelSchema.index({ rating: -1 });
export const Hotel = mongoose.model('Hotel', hotelSchema);

const restaurantSchema = new Schema({ name: { type: String, required: true, trim: true }, slug: { type: String, required: true, lowercase: true, trim: true }, destinationId: { type: Schema.Types.ObjectId, ref: 'Destination', required: true }, description: String, cuisine: String, priceRange: String, rating: { type: Number, default: 4.0, min: 0, max: 5 }, reviewCount: { type: Number, default: 0, min: 0 }, imageUrl: String, images: [String], isVeg: { type: Boolean, default: false }, popularDishes: [String], openingHours: String, latitude: Number, longitude: Number, address: String, phone: String }, { timestamps: true });
restaurantSchema.index({ destinationId: 1 }); restaurantSchema.index({ destinationId: 1, slug: 1 }, { unique: true }); restaurantSchema.index({ rating: -1 }); restaurantSchema.index({ cuisine: 1 });
export const Restaurant = mongoose.model('Restaurant', restaurantSchema);

const activitySchema = new Schema({ name: { type: String, required: true, trim: true }, slug: { type: String, required: true, lowercase: true, trim: true }, destinationId: { type: Schema.Types.ObjectId, ref: 'Destination', required: true }, description: String, type: String, price: { type: Number, min: 0 }, duration: String, difficulty: String, imageUrl: String, images: [String], bestSeason: String, latitude: Number, longitude: Number }, { timestamps: true });
activitySchema.index({ destinationId: 1 }); activitySchema.index({ destinationId: 1, slug: 1 }, { unique: true });
export const Activity = mongoose.model('Activity', activitySchema);

const tripSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, destinationId: { type: Schema.Types.ObjectId, ref: 'Destination', required: true }, title: { type: String, required: true, trim: true }, description: String, status: { type: String, enum: Object.values(TripStatus), default: TripStatus.DRAFT }, startDate: Date, endDate: Date, totalDays: { type: Number, default: 1, min: 1 }, travelers: { type: Number, default: 1, min: 1 }, budget: { type: Number, min: 0 }, spentSoFar: { type: Number, default: 0, min: 0 }, travelStyle: { type: String, enum: Object.values(TravelStyle) }, imageUrl: String, isPublic: { type: Boolean, default: false }, itineraryData: Schema.Types.Mixed, packingList: Schema.Types.Mixed, notes: String }, { timestamps: true });
tripSchema.index({ userId: 1 }); tripSchema.index({ destinationId: 1 }); tripSchema.index({ status: 1 });
export const Trip = mongoose.model('Trip', tripSchema);

const tripMemberSchema = new Schema({ tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true }, userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, role: { type: String, default: 'MEMBER', enum: ['OWNER', 'MEMBER'] }, joinedAt: { type: Date, default: Date.now } }, { timestamps: true });
tripMemberSchema.index({ tripId: 1, userId: 1 }, { unique: true }); tripMemberSchema.index({ userId: 1 });
export const TripMember = mongoose.model('TripMember', tripMemberSchema);

const expenseSchema = new Schema({ tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true }, userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, category: { type: String, required: true, enum: ['Transport', 'Hotel', 'Food', 'Activities', 'Shopping', 'Other'] }, description: { type: String, required: true, trim: true }, amount: { type: Number, required: true, min: 0 }, date: { type: Date, default: Date.now } }, { timestamps: true });
expenseSchema.index({ tripId: 1 });
export const Expense = mongoose.model('Expense', expenseSchema);

const savedDestinationSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, destinationId: { type: Schema.Types.ObjectId, ref: 'Destination', required: true }, notes: String, collection: { type: String, trim: true } }, { timestamps: true });
savedDestinationSchema.index({ userId: 1, destinationId: 1 }, { unique: true });
export const SavedDestination = mongoose.model('SavedDestination', savedDestinationSchema);

const wishlistSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, destinationId: { type: Schema.Types.ObjectId, ref: 'Destination', required: true }, type: { type: String, trim: true }, notes: { type: String, trim: true } }, { timestamps: true });
wishlistSchema.index({ userId: 1 });
export const Wishlist = mongoose.model('Wishlist', wishlistSchema);

const reviewSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, destinationId: { type: Schema.Types.ObjectId, ref: 'Destination' }, hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel' }, restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant' }, rating: { type: Number, required: true, min: 1, max: 5 }, title: { type: String, trim: true }, content: { type: String, required: true, trim: true }, images: [String] }, { timestamps: true });
reviewSchema.index({ userId: 1 }); reviewSchema.index({ destinationId: 1 }); reviewSchema.index({ hotelId: 1 }); reviewSchema.index({ restaurantId: 1 });
export const Review = mongoose.model('Review', reviewSchema);

const communityPostSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, title: { type: String, trim: true }, content: { type: String, trim: true }, media: [String], destinationId: String, tags: [String], likesCount: { type: Number, default: 0, min: 0 }, commentsCount: { type: Number, default: 0, min: 0 } }, { timestamps: true });
communityPostSchema.index({ userId: 1 }); communityPostSchema.index({ createdAt: -1 });
export const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);

const commentSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, postId: { type: Schema.Types.ObjectId, ref: 'CommunityPost', required: true }, content: { type: String, required: true, trim: true } }, { timestamps: true });
commentSchema.index({ postId: 1 });
export const Comment = mongoose.model('Comment', commentSchema);

const likeSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, postId: { type: Schema.Types.ObjectId, ref: 'CommunityPost', required: true } }, { timestamps: true });
likeSchema.index({ userId: 1, postId: 1 }, { unique: true }); likeSchema.index({ postId: 1 });
export const Like = mongoose.model('Like', likeSchema);

const travelJournalSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, title: { type: String, required: true, trim: true }, content: String, aiContent: String, destinationId: String, images: [String], tripDate: Date, isPublic: { type: Boolean, default: false }, tags: [String] }, { timestamps: true });
travelJournalSchema.index({ userId: 1 });
export const TravelJournal = mongoose.model('TravelJournal', travelJournalSchema);

const journalEntrySchema = new Schema({ journalId: { type: Schema.Types.ObjectId, ref: 'TravelJournal', required: true }, title: { type: String, trim: true }, content: { type: String, trim: true }, images: [String], location: { type: String, trim: true }, date: { type: Date, default: Date.now } }, { timestamps: true });
journalEntrySchema.index({ journalId: 1 });
export const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

const packingListSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, name: { type: String, required: true, trim: true }, items: { type: Schema.Types.Mixed, default: [] }, destination: { type: String, trim: true }, tripDate: Date }, { timestamps: true });
packingListSchema.index({ userId: 1 });
export const PackingList = mongoose.model('PackingList', packingListSchema);

const notificationSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, type: { type: String, enum: Object.values(NotificationType), required: true }, title: { type: String, required: true, trim: true }, message: { type: String, required: true, trim: true }, data: Schema.Types.Mixed, isRead: { type: Boolean, default: false } }, { timestamps: true });
notificationSchema.index({ userId: 1, isRead: 1 });
export const Notification = mongoose.model('Notification', notificationSchema);

const aiConversationSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, title: { type: String, trim: true } }, { timestamps: true });
aiConversationSchema.index({ userId: 1 });
export const AIConversation = mongoose.model('AIConversation', aiConversationSchema);

const aiMessageSchema = new Schema({ conversationId: { type: Schema.Types.ObjectId, ref: 'AIConversation', required: true }, role: { type: String, required: true, enum: ['user', 'assistant', 'system'] }, content: { type: String, required: true }, metadata: Schema.Types.Mixed }, { timestamps: true });
aiMessageSchema.index({ conversationId: 1 });
export const AIMessage = mongoose.model('AIMessage', aiMessageSchema);

const blogSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User' }, title: { type: String, required: true, trim: true }, slug: { type: String, required: true, unique: true, lowercase: true, trim: true }, content: { type: String, required: true }, excerpt: { type: String, trim: true }, category: { type: String, trim: true }, imageUrl: String, images: [String], destinationId: { type: Schema.Types.ObjectId, ref: 'Destination' }, tags: [String], readTime: String, isPublished: { type: Boolean, default: true } }, { timestamps: true });
blogSchema.index({ slug: 1 }); blogSchema.index({ destinationId: 1 }); blogSchema.index({ category: 1 }); blogSchema.index({ tags: 1 });
export const Blog = mongoose.model('Blog', blogSchema);

const bookingSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, tripId: { type: Schema.Types.ObjectId, ref: 'Trip' }, hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel' }, type: { type: String, required: true, enum: ['HOTEL', 'TRANSPORT', 'ACTIVITY'] }, status: { type: String, enum: Object.values(BookingStatus), default: BookingStatus.PENDING }, checkIn: Date, checkOut: Date, guests: { type: Number, min: 1 }, totalPrice: { type: Number, min: 0 } }, { timestamps: true });
bookingSchema.index({ userId: 1 });
export const Booking = mongoose.model('Booking', bookingSchema);

const followSchema = new Schema({ followerId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, followingId: { type: Schema.Types.ObjectId, ref: 'User', required: true } }, { timestamps: true });
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true }); followSchema.index({ followingId: 1 });
export const Follow = mongoose.model('Follow', followSchema);

const itineraryStopSchema = new Schema({ name: { type: String, required: true, trim: true }, type: { type: String, required: true, enum: ['ATTRACTION', 'HOTEL', 'RESTAURANT', 'ACTIVITY', 'OTHER'] }, order: { type: Number, required: true, min: 0 }, startTime: String, endTime: String, notes: String, distance: { type: Number, min: 0 }, travelTime: String, attractionId: { type: Schema.Types.ObjectId, ref: 'Attraction' }, hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel' }, restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant' }, activityId: { type: Schema.Types.ObjectId, ref: 'Activity' } });

const itineraryDaySchema = new Schema({ dayNumber: { type: Number, required: true, min: 1 }, title: { type: String, trim: true }, description: String, date: Date, stops: [itineraryStopSchema] });

const itinerarySchema = new Schema({ title: { type: String, required: true, trim: true }, slug: { type: String, required: true, lowercase: true, trim: true }, destinationId: { type: Schema.Types.ObjectId, ref: 'Destination', required: true }, description: String, totalDays: { type: Number, required: true, min: 1 }, budget: { type: Number, min: 0 }, travelStyle: { type: String, enum: Object.values(TravelStyle) }, isPublic: { type: Boolean, default: false }, isTrending: { type: Boolean, default: false }, imageUrl: String, days: [itineraryDaySchema] }, { timestamps: true });
itinerarySchema.index({ destinationId: 1 }); itinerarySchema.index({ isPublic: 1 });
export const Itinerary = mongoose.model('Itinerary', itinerarySchema);
