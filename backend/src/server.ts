import app from './app';
import { config } from './config';
import { connectDB } from './config/database';

const PORT = config.port;

const start = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`\n╔══════════════════════════════════════════╗\n║          🧳  MUSAFIRX  API  🧳          ║\n║   AI Travel Platform - Backend Server    ║\n║   Database: MongoDB                      ║\n║   Port: ${PORT}                           ║\n║   AI Mode: ${config.gemini.enabled ? 'Gemini 🤖' : 'Demo 📝'}             ║\n║   API: http://localhost:${PORT}/api          ║\n╚══════════════════════════════════════════╝\n  `);
  });
  process.on('SIGTERM', () => { server.close(() => process.exit(0)); });
  process.on('SIGINT', () => { server.close(() => process.exit(0)); });
};

start();
