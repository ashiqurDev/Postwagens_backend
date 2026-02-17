import mongoose from 'mongoose';
import env from './config/env';
import { scheduleBoostExpirationJob } from './jobs/boostExpiration.job';
import { scheduleUserVerifiedExpirationJob } from './jobs/userVerifiedExpiration.job';

const connectDB = async () => {
  try {
    await mongoose.connect(env.DB_URI as string);
    console.log('📦 Successfully connected to MongoDB');
    
    // After connecting, schedule and start the jobs
    scheduleBoostExpirationJob();
    scheduleUserVerifiedExpirationJob();

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB', error);
    process.exit(1); // Exit process with failure
  }
};

connectDB();
