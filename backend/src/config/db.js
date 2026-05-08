import mongoose from "mongoose";

const isProduction = () => process.env.NODE_ENV === "production";
const canUseFileFallback = () => !isProduction() && process.env.ALLOW_FILE_DB_FALLBACK !== "false";

const useFileFallback = (reason) => {
  process.env.DB_MODE = "file";
  console.warn(`MongoDB unavailable, using local JSON data store: ${reason}`);
};

export const connectDB = async () => {
  if (process.env.DB_MODE === "file") {
    if (isProduction()) {
      console.error("DB_MODE=file is not allowed in production because Render's filesystem is ephemeral. Set MONGO_URI instead.");
      process.exit(1);
    }
    useFileFallback("DB_MODE=file");
    return;
  }

  const mongoUri = process.env.MONGO_URI?.trim();

  if (!mongoUri || !/^mongodb(\+srv)?:\/\//.test(mongoUri)) {
    if (canUseFileFallback()) {
      useFileFallback("MONGO_URI is missing or invalid");
      return;
    }

    console.error("MONGO_URI is missing or invalid. Persistent production data requires MongoDB.");
    process.exit(1);
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    process.env.DB_MODE = "mongo";
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    if (canUseFileFallback()) {
      useFileFallback(error.message);
      return;
    }

    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};
