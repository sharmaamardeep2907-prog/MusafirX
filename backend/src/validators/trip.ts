import { z } from 'zod';

export const createTripSchema = z.object({
  destinationId: z.string().min(1, 'Destination is required'),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  totalDays: z.number().min(1).optional(),
  travelers: z.number().min(1).optional(),
  budget: z.number().min(0).optional(),
  travelStyle: z.enum(['LUXURY','BUDGET','BACKPACKING','FAMILY','SOLO','ROMANTIC','ADVENTURE','SPIRITUAL','PHOTOGRAPHY','FOODIE','NATURE','HERITAGE']).optional(),
  notes: z.string().optional(),
});

export const addExpenseSchema = z.object({
  tripId: z.string().min(1),
  category: z.enum(['Transport','Hotel','Food','Activities','Shopping','Other']),
  description: z.string().min(1),
  amount: z.number().min(0),
  date: z.string().optional(),
});

export const createReviewSchema = z.object({
  destinationId: z.string().optional(),
  hotelId: z.string().optional(),
  restaurantId: z.string().optional(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  content: z.string().min(1, 'Review content is required'),
});
