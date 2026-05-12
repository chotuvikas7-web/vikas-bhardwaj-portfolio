import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, "../../data/categories.json");

export const defaultCategoryNames = ["Website", "Dashboard", "Full Stack", "Case Studies", "Brochure", "PPC Pages"];

const createDefaultCategories = () => defaultCategoryNames.map((name) => ({ _id: randomUUID(), name }));

const ensureFile = async () => {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(createDefaultCategories(), null, 2));
  }
};

export const readCategories = async () => {
  await ensureFile();
  try {
    const content = await fs.readFile(dataFile, "utf8");
    const categories = JSON.parse(content);
    return Array.isArray(categories) ? categories : createDefaultCategories();
  } catch (error) {
    console.warn(`Could not read categories file store, using defaults: ${error.message}`);
    return createDefaultCategories();
  }
};

export const writeCategories = async (categories) => {
  await ensureFile();
  await fs.writeFile(dataFile, JSON.stringify(categories, null, 2));
};
