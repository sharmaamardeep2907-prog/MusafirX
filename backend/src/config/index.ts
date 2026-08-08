import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'musafirx_super_secret_change_this',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'musafirx_super_refresh_secret_change_this',
    accessExpiry: '15m',
    refreshExpiry: process.env.JWT_EXPIRES_IN || '7d',
  },

  database: {
    url: process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/musafirx',
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    enabled: !!process.env.REDIS_URL,
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: 'gemini-1.5-flash',
    enabled: !!process.env.GEMINI_API_KEY,
  },

  googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
    enabled: !!process.env.GOOGLE_MAPS_API_KEY,
  },

  weather: {
    apiKey: process.env.WEATHER_API_KEY || '',
    enabled: !!process.env.WEATHER_API_KEY,
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },

  demoMode: process.env.DEMO_MODE === 'true' || !process.env.GEMINI_API_KEY,
  aiFallbackEnabled: process.env.AI_FALLBACK_ENABLED !== 'false',
};
