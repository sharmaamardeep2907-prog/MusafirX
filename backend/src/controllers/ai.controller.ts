import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { generateAIResponse } from '../integrations/ai.service';
import { AIConversation, AIMessage } from '../config/database';

export const chat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message, conversationId } = req.body;
    if (!message) { res.status(400).json({ message: 'Message required' }); return; }
    let convoId = conversationId;
    if (!convoId && req.userId) { const convo = await AIConversation.create({ userId: req.userId, title: message.substring(0, 50) }); convoId = convo._id; }
    if (convoId && req.userId) await AIMessage.create({ conversationId: convoId, role: 'user', content: message });
    const reply = await generateAIResponse(message);
    if (convoId && req.userId) await AIMessage.create({ conversationId: convoId, role: 'assistant', content: reply });
    res.json({ conversationId: convoId, message: reply, isDemo: !process.env.GEMINI_API_KEY });
  } catch (error) { console.error('AI chat error:', error); res.status(500).json({ message: 'Internal server error' }); }
};

export const generateItinerary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { destination, days, budget, travelers, interests, travelStyle } = req.body;
    const context = `Destination: ${destination}. Duration: ${days} days. Budget: ₹${budget}. Travelers: ${travelers}. Style: ${travelStyle || 'Mixed'}.`;
    const prompt = `Create a detailed ${days}-day itinerary for ${destination} for ${travelers} travelers with ₹${budget} budget. Include places, restaurants, costs, tips. Style: ${travelStyle || 'Mixed'}.`;
    const itinerary = await generateAIResponse(prompt, context);
    res.json({ itinerary, metadata: { destination, days, budget, travelers, travelStyle }, isDemo: !process.env.GEMINI_API_KEY });
  } catch (error) { console.error('Generate itinerary error:', error); res.status(500).json({ message: 'Internal server error' }); }
};

export const generatePackingList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { destination, duration, weather, activities } = req.body;
    const prompt = `Create packing checklist for ${destination} for ${duration} days. Weather: ${weather || 'moderate'}. Activities: ${(activities || []).join(', ') || 'sightseeing'}.`;
    const packingList = await generateAIResponse(prompt);
    res.json({ packingList, isDemo: !process.env.GEMINI_API_KEY });
  } catch (error) { console.error('Generate packing list error:', error); res.status(500).json({ message: 'Internal server error' }); }
};

export const optimizeBudget = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { destination, days, budget, travelers } = req.body;
    const prompt = `Optimize ₹${budget} for ${travelers} people to ${destination} for ${days} days. Break down by Hotels, Transport, Food, Activities, Shopping, Emergency.`;
    const optimizedBudget = await generateAIResponse(prompt);
    res.json({ optimizedBudget, isDemo: !process.env.GEMINI_API_KEY });
  } catch (error) { console.error('Optimize budget error:', error); res.status(500).json({ message: 'Internal server error' }); }
};

export const enhanceJournal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { notes, destination } = req.body;
    const prompt = `Transform these travel notes into a beautiful story about ${destination || 'my journey'}:\n\n${notes}`;
    const enhanced = await generateAIResponse(prompt);
    res.json({ enhanced, isDemo: !process.env.GEMINI_API_KEY });
  } catch (error) { console.error('Enhance journal error:', error); res.status(500).json({ message: 'Internal server error' }); }
};

export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try { const conversations = await AIConversation.find({ userId: req.userId }).sort({ updatedAt: -1 }).lean(); res.json(conversations); }
  catch (error) { console.error('Get conversations error:', error); res.status(500).json({ message: 'Internal server error' }); }
};

export const getConversationMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try { const messages = await AIMessage.find({ conversationId: req.params.id }).sort({ createdAt: 1 }).lean(); res.json(messages); }
  catch (error) { console.error('Get messages error:', error); res.status(500).json({ message: 'Internal server error' }); }
};