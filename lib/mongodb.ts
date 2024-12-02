import mongoose from 'mongoose';

const mongoURI = process.env.MONGODB_URI || 'default_connection_string';
if (!mongoURI) {
  throw new Error('MongoDB URI is not defined in the environment variables.');
}

export async function connectDatabase() {
  try {
    await mongoose.connect(mongoURI, {

    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export function getDb() {
  return mongoose.connection;
}
