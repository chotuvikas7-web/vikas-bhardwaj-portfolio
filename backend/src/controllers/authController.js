import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (process.env.DB_MODE === "file") {
      const isAdmin = email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
      if (!isAdmin) {
        res.status(401);
        throw new Error("Invalid email or password");
      }

      const user = {
        _id: "local-admin",
        name: process.env.ADMIN_NAME || "Admin",
        email: process.env.ADMIN_EMAIL,
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
