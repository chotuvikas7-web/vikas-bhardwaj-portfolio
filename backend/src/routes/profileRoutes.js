import express from "express";
import { body } from "express-validator";
import { createOrUpdateProfile, deleteProfile, getProfile } from "../controllers/profileController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

const profileRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").optional({ checkFalsy: true }).isEmail().withMessage("Email must be valid")
];

router.route("/").get(getProfile).post(protect, adminOnly, upload.fields([{ name: "image", maxCount: 1 }, { name: "resume", maxCount: 1 }]), profileRules, validate, createOrUpdateProfile);
router.delete("/", protect, adminOnly, deleteProfile);

export default router;
