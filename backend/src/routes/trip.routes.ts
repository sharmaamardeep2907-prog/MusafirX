import { Router } from 'express';
import { getMyTrips, getTripById, createTrip, updateTrip, deleteTrip, addExpense, deleteExpense, getSavedDestinations, saveDestination, unsaveDestination, getWishlist, addToWishlist, createReview, getItineraries, getCommunityPosts, getBlogs, getBlogBySlug } from '../controllers/trip.controller';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/trips', authenticate, getMyTrips);
router.get('/trips/:id', authenticate, getTripById);
router.post('/trips', authenticate, createTrip);
router.patch('/trips/:id', authenticate, updateTrip);
router.delete('/trips/:id', authenticate, deleteTrip);
router.post('/expenses', authenticate, addExpense);
router.delete('/expenses/:id', authenticate, deleteExpense);
router.get('/saved', authenticate, getSavedDestinations);
router.post('/saved', authenticate, saveDestination);
router.delete('/saved/:destinationId', authenticate, unsaveDestination);
router.get('/wishlist', authenticate, getWishlist);
router.post('/wishlist', authenticate, addToWishlist);
router.post('/reviews', authenticate, createReview);
router.get('/itineraries', optionalAuth, getItineraries);
router.get('/community', optionalAuth, getCommunityPosts);
router.get('/blogs', getBlogs);
router.get('/blogs/:slug', getBlogBySlug);

export default router;
