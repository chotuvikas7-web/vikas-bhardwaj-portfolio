import express from "express";
import { body } from "express-validator";
import { createCategory, deleteCategory, getCategories } from "../controllers/categoryController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const categoryRules = [
  body("name").trim().notEmpty().withMessage("Category name is required")
];

router.route("/").get(getCategories).post(protect, adminOnly, categoryRules, validate, createCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;
