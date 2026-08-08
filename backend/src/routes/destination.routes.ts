import { Router } from 'express';
import { getStates, getDestinations, getDestinationBySlug, getTrendingDestinations, getHiddenGems, getHotels, getRestaurants, getActivities, search } from '../controllers/destination.controller';

const router = Router();

router.get('/states', getStates);
router.get('/destinations', getDestinations);
router.get('/destinations/trending', getTrendingDestinations);
router.get('/destinations/hidden-gems', getHiddenGems);
router.get('/destinations/:slug', getDestinationBySlug);
router.get('/hotels', getHotels);
router.get('/restaurants', getRestaurants);
router.get('/activities', getActivities);
router.get('/search', search);

export default router;
