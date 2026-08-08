import mongoose from 'mongoose';
import { config } from './index';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.database.url);
    console.log(`  MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('  MongoDB connection error:', error);
    process.exit(1);
  }
};

export {
  User, State, City, Destination, Attraction, Hotel, Restaurant,
  Activity, Trip, TripMember, Expense, SavedDestination, Wishlist,
  Review, CommunityPost, Comment, Like, TravelJournal, JournalEntry,
  PackingList, Notification, AIConversation, AIMessage, Blog, Booking,
  Follow, Itinerary,
  TripStatus, TravelStyle, BookingStatus, UserRole, NotificationType,
} from '../models';
