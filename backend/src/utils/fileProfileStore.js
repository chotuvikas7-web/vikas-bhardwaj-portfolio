import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, "../../data/profile.json");

const ensureFile = async () => {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(null, null, 2));
  }
};

export const readProfile = async () => {
  await ensureFile();
  const content = await fs.readFile(dataFile, "utf8");
  return JSON.parse(content);
};

export const writeProfile = async (profile) => {
  await ensureFile();
  await fs.writeFile(dataFile, JSON.stringify(profile, null, 2));
  return profile;
};
