import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000
    });
    process.env.DB_MODE = "mongo";
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    if (process.env.ALLOW_FILE_DB_FALLBACK === "true") {
      process.env.DB_MODE = "file";
      console.warn(`MongoDB unavailable, using local JSON data store: ${error.message}`);
      return;
    }

    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};
