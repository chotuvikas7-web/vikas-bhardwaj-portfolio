import express from "express";
import { body } from "express-validator";
import { getMe, login } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/login",
  [
    body("email").trim().toLowerCase().isEmail().withMessage("Enter a valid email"),
    body("password").trim().notEmpty().withMessage("Password is required")
  ],
  validate,
  login
);

router.get("/me", protect, getMe);

export default router;
