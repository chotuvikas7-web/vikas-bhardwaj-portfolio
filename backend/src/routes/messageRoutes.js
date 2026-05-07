import express from "express";
import { body } from "express-validator";
import { createMessage, getMessages, deleteMessage } from "../controllers/messageController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const messageRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("countryCode").optional({ checkFalsy: true }).trim().isLength({ max: 10 }).withMessage("Country code is too long"),
  body("phone").optional({ checkFalsy: true }).trim().isLength({ min: 6, max: 30 }).withMessage("Phone number must be 6 to 30 characters"),
  body("message").trim().notEmpty().withMessage("Message is required")
];

router.route("/").get(protect, adminOnly, getMessages).post(messageRules, validate, createMessage);
router.delete("/:id", protect, adminOnly, deleteMessage);

export default router;
