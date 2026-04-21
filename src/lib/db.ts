import mongoose from "mongoose";
import dns from 'dns';

function getMongoUri(): string {
  dns.setServers(['8.8.8.8']);
  const uri = process.env.MONGODB_URI ?? process.env.MONGO_URL;
  if (!uri) {
    throw new Error(
      "Defina MONGODB_URI ou MONGO_URL no ambiente (ex.: .env.local).",
    );
  }
  return uri;
}


export async function connectDB(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState >= 1) {
    return mongoose;
  }

  const uri = getMongoUri();
  await mongoose.connect(uri);
  return mongoose;
}
