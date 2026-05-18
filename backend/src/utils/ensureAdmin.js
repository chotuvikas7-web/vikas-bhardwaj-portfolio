import User from "../models/User.js";

export const ensureAdmin = async () => {
  if (process.env.DB_MODE === "file") return;

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!email || !password) {
    console.warn("ADMIN_EMAIL or ADMIN_PASSWORD is missing; admin auto-seed skipped.");
    return;
  }

  const existing = await User.findOne({ email }).select("+password");
  if (existing) {
    let changed = false;

    if (process.env.ADMIN_NAME && existing.name !== process.env.ADMIN_NAME) {
      existing.name = process.env.ADMIN_NAME;
      changed = true;
    }

    if (!(await existing.comparePassword(password))) {
      existing.password = password;
      changed = true;
    }

    if (changed) {
      await existing.save();
      console.log(`Admin updated: ${email}`);
      return;
    }

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
