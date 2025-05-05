import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017";

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}

let cachedDb = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const db = await mongoose.connect(MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    dbName: "elixir_db", // 🔥 Add your database name here!
  });

  cachedDb = db;
  return db;
}
