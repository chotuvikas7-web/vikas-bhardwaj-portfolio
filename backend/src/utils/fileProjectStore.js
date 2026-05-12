import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, "../../data/projects.json");

export const defaultProjects = [
  {
    _id: "project-saas-analytics-dashboard",
    title: "SaaS Analytics Dashboard",
    description: "A role-aware analytics dashboard with project KPIs, API-backed charts, and responsive data views.",
    category: "Dashboard",
    techStack: ["React", "Tailwind CSS", "Express", "MongoDB"],
    githubLink: "https://github.com/",
    liveLink: "https://example.com/",
    image: "/project-images/saas-analytics.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "project-developer-portfolio-cms",
    title: "Developer Portfolio CMS",
    description: "A full-stack portfolio with JWT admin tools, RESTful project CRUD, validation, and local image uploads.",
    category: "Full Stack",
    techStack: ["Node.js", "JWT", "Mongoose", "React Router"],
    githubLink: "https://github.com/",
    liveLink: "https://example.com/",
    image: "/project-images/portfolio-cms.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "project-shaadi-souk",
    title: "Shaadi Souk",
    description: "A matrimonial website built with modern UI technologies.",
    category: "Website",
    techStack: ["ReactJS", "NodeJs", "Express", "RestAPI"],
    githubLink: "",
    liveLink: "https://www.shaadisouk.com/",
    image: "/project-images/shaadi-souk-previous.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "project-virtual-employee",
    title: "Virtual Employee",
    description: "An interactive platform for virtual employee management with responsive design.",
    category: "Website",
    techStack: ["HTML", "Bootstrap", "Splide.js"],
    githubLink: "",
    liveLink: "https://www.virtualemployee.com/",
    image: "/project-images/virtual-employee-real.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "project-teckvalley-india",
    title: "TeckValley India",
    description: "Company website showcasing services with modern UI and animations.",
    category: "Website",
    techStack: ["HTML", "GSAP", "Bootstrap", "CSS"],
    githubLink: "",
    liveLink: "https://teckvalley.co.in/",
    image: "/project-images/teckvalley-india-real.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "project-teckvalley",
    title: "TeckValley",
    description: "Portfolio website with interactive elements and product design.",
    category: "Website",
    techStack: ["HTML", "CSS", "JavaScript"],
    githubLink: "",
    liveLink: "https://teckvalley.com/",
    image: "/project-images/teckvalley-previous.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "project-my-sage-dental",
    title: "My Sage Dental",
    description: "Dental clinic website with user-friendly interface and responsive design.",
    category: "Website",
    techStack: ["HTML", "Bootstrap", "JavaScript"],
    githubLink: "",
    liveLink: "https://mysagedental.com/",
    image: "/project-images/my-sage-dental-real.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const ensureFile = async () => {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(defaultProjects, null, 2));
  }
};

export const readProjects = async () => {
  await ensureFile();
  try {
    const content = await fs.readFile(dataFile, "utf8");
    const projects = JSON.parse(content);
    return Array.isArray(projects) ? projects : defaultProjects;
  } catch (error) {
    console.warn(`Could not read projects file store, using defaults: ${error.message}`);
    return defaultProjects;
  }
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
