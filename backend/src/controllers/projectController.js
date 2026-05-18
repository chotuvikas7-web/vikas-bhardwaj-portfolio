import fs from "fs/promises";
import mongoose from "mongoose";
import Project from "../models/Project.js";
import {
  createFileProject,
  deleteFileProject,
  readProjects,
  updateFileProject
} from "../utils/fileProjectStore.js";

const normalizeTechStack = (techStack) => {
  if (Array.isArray(techStack)) return techStack.map((item) => item.trim()).filter(Boolean);
  if (typeof techStack === "string") {
    return techStack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const uploadedImageToDataUrl = async (file) => {
  if (!file) return "";

  const buffer = await fs.readFile(file.path);
  await fs.unlink(file.path).catch(() => {});
  return `data:${file.mimetype};base64,${buffer.toString("base64")}`;
};

const ensureValidProjectId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error("Project not found. Refresh the project list and try again.");
    error.statusCode = 404;
    throw error;
  }
};

export const getProjects = async (req, res, next) => {
  try {
    if (process.env.DB_MODE === "file") {
      const projects = await readProjects();
      return res.json(projects);
    }

    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res, next) => {
  try {
    if (process.env.DB_MODE === "file") {
      const projects = await readProjects();
      const project = projects.find((item) => item._id === req.params.id);
      if (!project) {
        res.status(404);
        throw new Error("Project not found");
      }

      return res.json(project);
    }

    ensureValidProjectId(req.params.id);
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const image = req.file ? await uploadedImageToDataUrl(req.file) : req.body.image;
    const payload = {
      ...req.body,
      category: typeof req.body.category === "string" ? req.body.category.trim() : "Website",
      techStack: normalizeTechStack(req.body.techStack),
      image
    };

    if (process.env.DB_MODE === "file") {
      const project = await createFileProject(payload);
      return res.status(201).json(project);
    }

    const project = await Project.create({
      ...payload
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const image = req.file ? await uploadedImageToDataUrl(req.file) : req.body.image;
    const updates = {
      ...req.body,
      techStack: normalizeTechStack(req.body.techStack),
      image
    };

    if (typeof req.body.category === "string") {
      updates.category = req.body.category.trim();
    }

    if (process.env.DB_MODE === "file") {
      const project = await updateFileProject(req.params.id, updates);
      if (!project) {
        res.status(404);
        throw new Error("Project not found");
      }

      return res.json(project);
    }

    ensureValidProjectId(req.params.id);
    const project = await Project.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    if (process.env.DB_MODE === "file") {
      const deleted = await deleteFileProject(req.params.id);
      if (!deleted) {
        res.status(404);
        throw new Error("Project not found");
      }

      return res.json({ message: "Project deleted" });
    }

    ensureValidProjectId(req.params.id);
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    res.json({ message: "Project deleted" });
  } catch (error) {
    next(error);
  }
};
