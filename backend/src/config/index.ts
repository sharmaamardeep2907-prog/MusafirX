import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'musafirx-dev-jwt-secret-key-2024',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'musafirx-dev-refresh-secret-key-2024',
    accessExpiry: '15m',
    refreshExpiry: '7d',
  },

  database: {
    url: process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/musafirx',
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

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
};
