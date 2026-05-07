import Category from "../models/Category.js";
import { readCategories, writeCategories } from "../utils/fileCategoryStore.js";

const normalizeName = (name) => (typeof name === "string" ? name.trim() : "");

export const getCategories = async (req, res, next) => {
  try {
    if (process.env.DB_MODE === "file") {
      const categories = await readCategories();
      return res.json(categories);
    }

    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const name = normalizeName(req.body.name);
    if (!name) {
      res.status(400);
      throw new Error("Category name is required");
    }

    if (process.env.DB_MODE === "file") {
      const categories = await readCategories();
      if (categories.some((category) => category.name.toLowerCase() === name.toLowerCase())) {
        res.status(400);
        throw new Error("Category already exists");
      }
      const newCategory = { _id: Date.now().toString(), name };
      categories.push(newCategory);
      await writeCategories(categories);
      return res.status(201).json(newCategory);
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      res.status(400);
      throw new Error("Category already exists");
    }

    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    if (process.env.DB_MODE === "file") {
      const categories = await readCategories();
      const filtered = categories.filter((category) => category._id !== req.params.id);
      if (filtered.length === categories.length) {
        res.status(404);
        throw new Error("Category not found");
      }
      await writeCategories(filtered);
      return res.json({ message: "Category deleted" });
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }

    res.json({ message: "Category deleted" });
  } catch (error) {
    next(error);
  }
};
