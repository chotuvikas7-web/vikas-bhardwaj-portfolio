import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, "../../data/categories.json");

const ensureFile = async () => {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify([], null, 2));
  }
};

export const readCategories = async () => {
  await ensureFile();
  const content = await fs.readFile(dataFile, "utf8");
  return JSON.parse(content);
};

export const writeCategories = async (categories) => {
  await ensureFile();
  await fs.writeFile(dataFile, JSON.stringify(categories, null, 2));
};
