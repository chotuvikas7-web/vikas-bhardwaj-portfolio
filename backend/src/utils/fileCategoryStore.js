import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, "../../data/categories.json");

const defaultCategories = ["Website", "Dashboard", "Full Stack", "Case Studies", "Brochure", "PPC Pages"];

const withDefaultCategories = (categories) => {
  const byName = new Map(
    categories
      .filter((category) => category?.name)
      .map((category) => [category.name.trim().toLowerCase(), category])
  );

  const missing = defaultCategories
    .filter((name) => !byName.has(name.toLowerCase()))
    .map((name) => ({ _id: randomUUID(), name }));

  return [...categories, ...missing].sort((a, b) => a.name.localeCompare(b.name));
};

const ensureFile = async () => {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(withDefaultCategories([]), null, 2));
  }
};

export const readCategories = async () => {
  await ensureFile();
  const content = await fs.readFile(dataFile, "utf8");
  const categories = JSON.parse(content);
  const seededCategories = withDefaultCategories(categories);
  if (seededCategories.length !== categories.length) {
    await writeCategories(seededCategories);
  }
  return seededCategories;
};

export const writeCategories = async (categories) => {
  await ensureFile();
  await fs.writeFile(dataFile, JSON.stringify(categories, null, 2));
};
