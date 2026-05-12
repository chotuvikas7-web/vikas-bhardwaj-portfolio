import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

const normalizeEmail = (email) => (typeof email === "string" ? email.trim().toLowerCase() : "");
const normalizePassword = (password) => (typeof password === "string" ? password.trim() : "");

export const login = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = normalizePassword(req.body.password);

    if (process.env.DB_MODE === "file") {
      const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL);
      const adminPassword = normalizePassword(process.env.ADMIN_PASSWORD);

      if (!adminEmail || !adminPassword) {
        res.status(500);
        throw new Error("Admin credentials are not configured on the server.");
      }

      const isAdmin = email === adminEmail && password === adminPassword;
      if (!isAdmin) {
        res.status(401);
        throw new Error("Invalid email or password");
      }

      const user = {
        _id: "local-admin",
        name: process.env.ADMIN_NAME || "Admin",
        email: adminEmail,
        role: "admin"
      };

      return res.json({
        token: generateToken(user),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });
};
