import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, "../../data/projects.json");

const sampleProjects = [
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
    description: "A matrimonial website built with modern UI technologies and responsive user journeys.",
    category: "Website",
    techStack: ["ReactJS", "NodeJs", "Express", "RestAPI"],
    githubLink: "",
    liveLink: "https://www.shaadisouk.com/",
    image: "/project-images/shaadi-souk.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "project-virtual-employee",
    title: "Virtual Employee",
    description: "An interactive platform for virtual employee services with responsive pages and polished content sections.",
    category: "Website",
    techStack: ["HTML", "Bootstrap", "Splide.js"],
    githubLink: "",
    liveLink: "https://www.virtualemployee.com/",
    image: "/project-images/virtual-employee.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "project-teckvalley-india",
    title: "TeckValley India",
    description: "Company website showcasing services with modern UI sections, animations, and conversion-focused layouts.",
    category: "Website",
    techStack: ["HTML", "GSAP", "Bootstrap", "CSS"],
    githubLink: "",
    liveLink: "https://teckvalley.co.in/",
    image: "/project-images/teckvalley-india.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "project-teckvalley",
    title: "TeckValley",
    description: "A company website with interactive elements, responsive structure, and product-focused design.",
    category: "Website",
    techStack: ["HTML", "CSS", "JavaScript"],
    githubLink: "",
    liveLink: "https://teckvalley.com/",
    image: "/project-images/teckvalley.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "project-my-sage-dental",
    title: "My Sage Dental",
    description: "Dental clinic website with user-friendly pages, service content, and responsive appointment-focused UI.",
    category: "Website",
    techStack: ["HTML", "Bootstrap", "JavaScript"],
    githubLink: "",
    liveLink: "https://mysagedental.com/",
    image: "/project-images/my-sage-dental.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const knownProjectImages = new Map(sampleProjects.map((project) => [project.title, project.image]));

const withSeedProjects = (projects) => {
  const byTitle = new Map(projects.map((project) => [project.title, project]));
  const normalized = projects.map((project) => ({
    ...project,
    image: knownProjectImages.get(project.title) || project.image
  }));
  const missing = sampleProjects.filter((project) => !byTitle.has(project.title));
  return [...normalized, ...missing];
};

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
  const projects = JSON.parse(content);
  const seededProjects = withSeedProjects(projects);
  if (seededProjects.length !== projects.length || seededProjects.some((project, index) => project.image !== projects[index]?.image)) {
    await writeProjects(seededProjects);
  }
  return seededProjects;
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
