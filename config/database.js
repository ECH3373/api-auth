import mongoose from 'mongoose';
import 'dotenv/config';

const connect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('[DATABASE] ✅ Connected to database');
  } catch (error) {
    console.error('[DATABASE] ❌ Failed to connect to database:', error.message);
    process.exit(1);
  }
};

export const database = {
  url: process.env.DATABASE_URL,
  connect,
};
