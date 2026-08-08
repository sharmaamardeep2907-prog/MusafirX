import { config } from '../config';

const demoResponses: Record<string, string[]> = {
  tripPlanning: [
    "I'd recommend spending 5 days in Jaipur to truly experience its royal heritage. Start with Amer Fort on Day 1, then City Palace and Hawa Mahal on Day 2. Day 3 is Jantar Mantar and markets. Day 4 takes you to Nahargarh Fort for sunset. Day 5 relaxed exploration of local cuisine.",
    "Kerala in September is magical! 6-day itinerary: 2 days Kochi (Fort Kochi, Chinese nets), 2 days Munnar (tea plantations, trekking), 2 days Alleppey (houseboat through backwaters). Budget ~₹20,000/person.",
    "For budget under ₹15,000 try Hampi. Stay in guesthouses (₹500-800/night), rent bicycle (₹100/day), eat at local eateries. Coracle ride on Tungabhadra at sunset is a must!",
    "Ladakh packing: warm layers (5°C even in summer), sturdy shoes, SPF 50+, lip balm, sunglasses, reusable water bottle, medications, cash (ATMs sparse). Don't forget your camera!",
  ],
  recommendations: [
    "Based on your love for mountains, try Tirthan Valley in Himachal. It's a hidden gem with riverside stays, trout fishing, access to Great Himalayan National Park. Less crowded than Manali.",
    "Since you enjoyed Rajasthan's heritage, explore Madhya Pradesh — Orchha, Khajuraho, Mandu offer incredible architecture without crowds. Indore food scene is legendary!",
    "Food lovers should plan Lucknow during winter (Nov-Feb). Awadhi cuisine — galouti kebabs, biryani, sheermal — is unparalleled. Combine with Bara Imambara day trip.",
  ],
  budgetOptimization: [
    "Goa budget: Stay 500m inland (save 40%), rent scooter (₹400/day), eat at local Goan restaurants. 5-day budget can drop from ₹20,000 to ~₹13,000/person.",
    "Rajasthan: Travel by overnight Volvo buses between cities, stay at heritage guesthouses (havelis from ₹1,200). Mehrangarh audio guide worth ₹200 extra.",
  ],
  packing: [
    "Shimla December: Heavy woolens (2°C), thermal innerwear, waterproof boots, gloves, woolen cap, moisturizer, lip balm, power bank, hot water bottle, camera. Optional: snow chains.",
    "Goa March: Light cotton clothes, swimwear, flip-flops, SPF 50+, sunglasses, hat, insect repellent, waterproof phone pouch. Leave valuables at home.",
  ],
  journalEnhancement: [
    "My journey through Varanasi began at dawn, when first rays painted the Ganga in gold. Ancient ghats came alive with temple bells and prayers. A boat ride at Assi Ghat revealed the city's timeless soul — sadhus in saffron robes, incense aroma, rhythmic chanting echoing from another era...",
  ],
};

function getRandomResponse(category: string): string {
  const responses = demoResponses[category];
  if (!responses) return "I'd love to help plan your journey! Where would you like to go?";
  return responses[Math.floor(Math.random() * responses.length)];
}

function getCategoryFromPrompt(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('itinerary')||lower.includes('plan')||lower.includes('days')||lower.includes('trip')) return 'tripPlanning';
  if (lower.includes('recommend')||lower.includes('suggest')||lower.includes('similar')||lower.includes('like')) return 'recommendations';
  if (lower.includes('budget')||lower.includes('cost')||lower.includes('cheap')||lower.includes('save')||lower.includes('price')) return 'budgetOptimization';
  if (lower.includes('pack')||lower.includes('carry')||lower.includes('wear')||lower.includes('bring')) return 'packing';
  if (lower.includes('journal')||lower.includes('story')||lower.includes('enhance')||lower.includes('write')) return 'journalEnhancement';
  return 'tripPlanning';
}

export const generateAIResponse = async (prompt: string, context?: string): Promise<string> => {
  if (config.gemini.enabled && config.gemini.apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${config.gemini.model}:generateContent?key=${config.gemini.apiKey}`,
        { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({contents:[{parts:[{text:`You are MusafirX, an AI travel assistant for India. Be friendly and knowledgeable about Indian travel.${context?'\n\nContext: '+context:''}\n\nUser: ${prompt}\n\nProvide a helpful response.`}]}]}) }
      );
      if (!response.ok) throw new Error('Gemini API error');
      const data:any = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || getRandomResponse(getCategoryFromPrompt(prompt));
    } catch (error) { console.warn('Gemini API error, using demo:', error); }
  }
  const category = getCategoryFromPrompt(prompt);
  return `🤖 *Demo AI Mode*\n\n${getRandomResponse(category)}`;
};
