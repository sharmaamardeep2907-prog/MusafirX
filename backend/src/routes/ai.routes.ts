import { Router } from 'express';
import { chat, generateItinerary, generatePackingList, optimizeBudget, enhanceJournal, getConversations, getConversationMessages } from '../controllers/ai.controller';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/chat', optionalAuth, chat);
router.post('/generate-itinerary', optionalAuth, generateItinerary);
router.post('/packing-list', optionalAuth, generatePackingList);
router.post('/optimize-budget', optionalAuth, optimizeBudget);
router.post('/enhance-journal', authenticate, enhanceJournal);
router.get('/conversations', authenticate, getConversations);
router.get('/conversations/:id/messages', authenticate, getConversationMessages);

export default router;
