import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { ensureAdmin } from "./ensureAdmin.js";

dotenv.config();

const seedAdmin = async () => {
  await connectDB();
  await ensureAdmin();
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
