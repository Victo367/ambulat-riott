import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8"]);

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL;

if (!MONGODB_URI) {
  throw new Error("Defina MONGODB_URI ou MONGO_URL no ambiente.");
}

// 👇 Tipagem do cache global
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// 👇 Extende o globalThis
declare global {
  var mongooseCache: MongooseCache | undefined;
}

const globalWithMongoose = global as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

export async function connectDB(): Promise<typeof mongoose> {
  if (globalWithMongoose.mongooseCache?.conn) {
    return globalWithMongoose.mongooseCache.conn;
  }

  if (!globalWithMongoose.mongooseCache) {
    globalWithMongoose.mongooseCache = {
      conn: null,
      promise: null,
    };
  }

  if (!globalWithMongoose.mongooseCache.promise) {
    globalWithMongoose.mongooseCache.promise = mongoose
      .connect(MONGODB_URI!)
      .then((mongoose) => mongoose);
  }

  globalWithMongoose.mongooseCache.conn =
    await globalWithMongoose.mongooseCache.promise;

  return globalWithMongoose.mongooseCache.conn;
}
