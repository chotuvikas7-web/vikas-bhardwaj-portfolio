import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, "../../data/profile.json");

const defaultProfile = {
  name: "Vikas Bhardwaj",
  role: "UI Developer",
  email: "contact@vikasbhardwaj.com",
  bio: "I am a UI developer with 6+ years of experience building responsive, polished web interfaces with HTML, CSS, Bootstrap, JavaScript, React, Tailwind CSS, and modern animation libraries.",
  linkedIn: "",
  phone: "Remote and hybrid friendly",
  image: "",
  resume: ""
};

const ensureFile = async () => {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(defaultProfile, null, 2));
  }
};

export const readProfile = async () => {
  await ensureFile();
  const content = await fs.readFile(dataFile, "utf8");
  const profile = JSON.parse(content);
  return profile && Object.keys(profile).length > 0 ? profile : defaultProfile;
};

export const writeProfile = async (profile) => {
  await ensureFile();
  await fs.writeFile(dataFile, JSON.stringify(profile, null, 2));
  return profile;
};
