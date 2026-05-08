import mongoose from "mongoose";

const canUseFileFallback = () => process.env.ALLOW_FILE_DB_FALLBACK === "true";

const useFileFallback = (reason) => {
  process.env.DB_MODE = "file";
  console.warn(`MongoDB unavailable, using local JSON data store: ${reason}`);
};

export const connectDB = async () => {
  if (process.env.DB_MODE === "file") {
    useFileFallback("DB_MODE=file");
    return;
  }

  const mongoUri = process.env.MONGO_URI?.trim();

  if (!mongoUri || !/^mongodb(\+srv)?:\/\//.test(mongoUri)) {
    if (canUseFileFallback()) {
      useFileFallback("MONGO_URI is missing or invalid");
      return;
    }

    console.error("MONGO_URI is missing or invalid. Set ALLOW_FILE_DB_FALLBACK=true to keep the site live without MongoDB.");
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
