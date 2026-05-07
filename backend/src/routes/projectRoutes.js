import express from "express";
import { body } from "express-validator";
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject
} from "../controllers/projectController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const projectRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("techStack").custom((value) => {
    if (Array.isArray(value) && value.length > 0) return true;
    if (typeof value === "string" && value.split(",").map((item) => item.trim()).filter(Boolean).length > 0) {
      return true;
    }
    throw new Error("Add at least one technology");
  }),
  body("githubLink").optional({ checkFalsy: true }).isURL().withMessage("GitHub link must be a URL"),
  body("liveLink").optional({ checkFalsy: true }).isURL().withMessage("Live link must be a URL"),
  body("image").optional({ checkFalsy: true }).isString()
];

router.route("/").get(getProjects).post(protect, adminOnly, upload.single("imageFile"), projectRules, validate, createProject);
router
  .route("/:id")
  .get(getProject)
  .put(protect, adminOnly, upload.single("imageFile"), projectRules, validate, updateProject)
  .delete(protect, adminOnly, deleteProject);

export default router;
