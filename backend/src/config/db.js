import mongoose from "mongoose";

const canUseFileFallback = () => {
  if (process.env.ALLOW_FILE_DB_FALLBACK !== "true") return false;

  if (process.env.NODE_ENV === "production" && process.env.ALLOW_NONPERSISTENT_FILE_DB_IN_PRODUCTION !== "true") {
    return false;
  }

  return true;
};

const useFileFallback = (reason) => {
  process.env.DB_MODE = "file";
  console.warn(`MongoDB unavailable, using local JSON data store: ${reason}`);
};

const getMongoUri = () => (process.env.MONGO_URI || process.env.MONGODB_URI || "").trim();

export const connectDB = async () => {
  if (process.env.DB_MODE === "file") {
    useFileFallback("DB_MODE=file");
    return;
  }

  const mongoUri = getMongoUri();

  if (!mongoUri || !/^mongodb(\+srv)?:\/\//.test(mongoUri)) {
    if (canUseFileFallback()) {
      useFileFallback("MONGO_URI/MONGODB_URI is missing or invalid");
      return;
    }

    console.error(
      "MONGO_URI or MONGODB_URI is missing or invalid. Production requires MongoDB so admin-saved data is not lost on restarts or redeploys."
    );
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
    if (process.env.NODE_ENV === "production") {
      console.error("Production file fallback is disabled to protect backend-saved portfolio data.");
    }
    process.exit(1);
  }
};
