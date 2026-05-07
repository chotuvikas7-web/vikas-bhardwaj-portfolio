import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, "../../data/projects.json");

const sampleProjects = [
  {
    _id: randomUUID(),
    title: "SaaS Analytics Dashboard",
    description: "A role-aware analytics dashboard with project KPIs, API-backed charts, and responsive data views.",
    techStack: ["React", "Tailwind CSS", "Express", "MongoDB"],
    githubLink: "https://github.com/",
    liveLink: "https://example.com/",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: randomUUID(),
    title: "Developer Portfolio CMS",
    description: "A full-stack portfolio with JWT admin tools, RESTful project CRUD, validation, and local image uploads.",
    techStack: ["Node.js", "JWT", "Mongoose", "React Router"],
    githubLink: "https://github.com/",
    liveLink: "https://example.com/",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const ensureFile = async () => {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(sampleProjects, null, 2));
  }
};

export const readProjects = async () => {
  await ensureFile();
  const content = await fs.readFile(dataFile, "utf8");
  return JSON.parse(content);
};

export const writeProjects = async (projects) => {
  await ensureFile();
  await fs.writeFile(dataFile, JSON.stringify(projects, null, 2));
};

export const createFileProject = async (payload) => {
  const projects = await readProjects();
  const now = new Date().toISOString();
  const project = {
    _id: randomUUID(),
    ...payload,
    createdAt: now,
    updatedAt: now
  };
  projects.unshift(project);
  await writeProjects(projects);
  return project;
};

export const updateFileProject = async (id, payload) => {
  const projects = await readProjects();
  const index = projects.findIndex((project) => project._id === id);
  if (index === -1) return null;

  projects[index] = {
    ...projects[index],
    ...payload,
    _id: id,
    updatedAt: new Date().toISOString()
  };
  await writeProjects(projects);
  return projects[index];
};

export const deleteFileProject = async (id) => {
  const projects = await readProjects();
  const nextProjects = projects.filter((project) => project._id !== id);
  if (nextProjects.length === projects.length) return null;
  await writeProjects(nextProjects);
  return true;
};
