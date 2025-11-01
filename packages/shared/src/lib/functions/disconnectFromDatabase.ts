import mongoose from 'mongoose';

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
  }
};
