import { config } from '../config';

const demoResponses: Record<string, string[]> = {
  tripPlanning: [
    "I'd recommend spending 5 days in Jaipur to truly experience its royal heritage. Start with Amer Fort on Day 1, then City Palace and Hawa Mahal on Day 2. Day 3: Jantar Mantar and local markets. Day 4: Nahargarh Fort for sunset. Day 5: relax and explore local cuisine at Bapu Bazaar.",
    "Kerala in September is magical! 6-day itinerary: 2 days Kochi (Fort Kochi, Chinese nets), 2 days Munnar (tea plantations, trekking), 2 days Alleppey (houseboat through backwaters). Budget ~₹20,000/person.",
    "For under ₹15,000 try Hampi, Karnataka. Guesthouses ₹500-800/night, bicycle rental ₹100/day. Coracle ride on Tungabhadra River at sunset is a must!",
    "Ladakh packing essentials: warm layers (5°C in summer), sturdy shoes, SPF 50+, lip balm, sunglasses, reusable water bottle, medications, cash (ATMs sparse). Camera mandatory!",
  ],
  recommendations: [
    "Based on your mountain love — try Tirthan Valley, Himachal. Riverside stays, trout fishing, Great Himalayan National Park access. Less crowded than Manali.",
    "Since you liked Rajasthan's heritage, explore Madhya Pradesh: Orchha, Khajuraho, Mandu — incredible architecture without crowds. Indore food scene is legendary!",
    "Food lovers: Lucknow (Nov-Feb) for Awadhi cuisine — galouti kebabs, biryani, sheermal. Combine with Bara Imambara day trip.",
  ],
  budgetOptimization: [
    "Goa budget: stay 500m inland (40% saving), rent scooter (₹400/day), eat at local restaurants. 5-day trip can drop from ₹20,000 to ~₹13,000/person.",
    "Rajasthan: overnight Volvo buses between cities, heritage guesthouses from ₹1,200/night. Mehrangarh audio guide worth ₹200 extra.",
  ],
  packing: [
    "Shimla December: heavy woolens (2°C), thermal innerwear, waterproof boots, gloves, cap, moisturizer, lip balm, power bank, camera. Optional: snow chains.",
    "Goa March: cotton clothes, swimwear, flip-flops, SPF 50+, sunglasses, hat, insect repellent, waterproof phone pouch. Leave valuables at home.",
  ],
  journalEnhancement: [
    "My journey through Varanasi began at dawn, when the first rays of sunlight painted the Ganga in hues of gold and amber. The ancient ghats came alive with temple bells and morning prayers. A boat ride at Assi Ghat revealed the city's timeless soul — sadhus in saffron, incense aroma, rhythmic chanting echoing from another era...",
  ],
};

function getRandomResponse(category: string): string {
  const responses = demoResponses[category];
  if (!responses || responses.length === 0) return "I'd love to help you plan your journey! Where would you like to go?";
  return responses[Math.floor(Math.random() * responses.length)];
}

function getCategoryFromPrompt(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('itinerary')||lower.includes('plan')||lower.includes('days')||lower.includes('trip')) return 'tripPlanning';
  if (lower.includes('recommend')||lower.includes('suggest')||lower.includes('similar')||lower.includes('like')) return 'recommendations';
  if (lower.includes('budget')||lower.includes('cost')||lower.includes('cheap')||lower.includes('save')) return 'budgetOptimization';
  if (lower.includes('pack')||lower.includes('carry')||lower.includes('wear')||lower.includes('bring')) return 'packing';
  if (lower.includes('journal')||lower.includes('story')||lower.includes('enhance')||lower.includes('write')) return 'journalEnhancement';
  return 'tripPlanning';
}

export const generateAIResponse = async (prompt: string, context?: string): Promise<string> => {
  const isDemo = !config.gemini.enabled || !config.gemini.apiKey || config.demoMode;
  if (!isDemo) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.gemini.model}:generateContent?key=${config.gemini.apiKey}`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({contents:[{parts:[{text:`You are MusafirX, an AI travel assistant for India.${context?'\n\nContext: '+context:''}\n\nUser: ${prompt}\n\nProvide a helpful response about Indian travel.`}]}]})
      });
      if (!response.ok) throw new Error('Gemini API error');
      const data:any = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || getRandomResponse(getCategoryFromPrompt(prompt));
    } catch (error) { console.warn('Gemini API error, falling back to Demo AI:', error); }
  }
  const category = getCategoryFromPrompt(prompt);
  return `🤖 *Demo AI Mode*\n\n${getRandomResponse(category)}`;
};
