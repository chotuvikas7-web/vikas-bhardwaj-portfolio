import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { ensureAdmin } from "./utils/ensureAdmin.js";

dotenv.config();

const port = process.env.PORT || 5000;

connectDB().then(async () => {
  await ensureAdmin();
  app.listen(port, () => {
    console.log(`API server running on port ${port}`);
  });
});
