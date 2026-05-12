import User from "../models/User.js";

export const ensureAdmin = async () => {
  if (process.env.DB_MODE === "file") return;

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!email || !password) {
    console.warn("ADMIN_EMAIL or ADMIN_PASSWORD is missing; admin auto-seed skipped.");
    return;
  }

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin ready: ${email}`);
    return;
  }

  await User.create({
    name: process.env.ADMIN_NAME || "Admin",
    email,
    password,
    role: "admin"
  });

  console.log(`Admin created: ${email}`);
};
