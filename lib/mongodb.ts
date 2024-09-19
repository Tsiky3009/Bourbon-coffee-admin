import mongoose from "mongoose";
import { MongoClient } from "mongodb";

// Check if MONGODB_URI is available
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = { appName: "devrel.template.nextjs" };

let client: MongoClient;
let globalWithMongo = global as typeof globalThis & { _mongoClient?: MongoClient };

// MongoDB client setup (as per your existing code)
if (process.env.NODE_ENV === "development") {
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  client = new MongoClient(uri, options);
}

// Mongoose connection setup (from the new code)
export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(uri);
    if (connection.readyState === 1) {
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

// Export the MongoDB client
export default client;

