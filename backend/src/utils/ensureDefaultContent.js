import Category from "../models/Category.js";
import Profile from "../models/Profile.js";
import Project from "../models/Project.js";
import { defaultCategoryNames } from "./fileCategoryStore.js";
import { readProfile } from "./fileProfileStore.js";
import { defaultProjects } from "./fileProjectStore.js";

const stripFileStoreFields = ({ _id, createdAt, updatedAt, ...payload }) => payload;

export const ensureDefaultContent = async () => {
  if (process.env.DB_MODE === "file") return;

  const existingCategories = await Category.find({}, { name: 1 }).lean();
  const categoryNames = new Set(existingCategories.map((category) => category.name.toLowerCase()));
  const missingCategories = defaultCategoryNames
    .filter((name) => !categoryNames.has(name.toLowerCase()))
    .map((name) => ({ name }));

  if (missingCategories.length) {
    await Category.insertMany(missingCategories, { ordered: false });
    console.log(`Default categories added: ${missingCategories.map((category) => category.name).join(", ")}`);
  }

  const existingProjects = await Project.find({}, { title: 1 }).lean();
  const projectTitles = new Set(existingProjects.map((project) => project.title.toLowerCase()));
  const missingProjects = defaultProjects
    .filter((project) => !projectTitles.has(project.title.toLowerCase()))
    .map(stripFileStoreFields);

  if (missingProjects.length) {
    await Project.insertMany(missingProjects, { ordered: false });
    console.log(`Default projects added: ${missingProjects.map((project) => project.title).join(", ")}`);
  }

  const profileExists = await Profile.exists({});
  if (!profileExists) {
    await Profile.create(stripFileStoreFields(await readProfile()));
    console.log("Default profile added.");
  }
};
