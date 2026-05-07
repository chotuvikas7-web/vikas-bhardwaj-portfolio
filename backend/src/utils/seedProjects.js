import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Project from "../models/Project.js";

dotenv.config();

const projects = [
  {
    title: "SaaS Analytics Dashboard",
    description: "A role-aware analytics dashboard with project KPIs, API-backed charts, and responsive data views.",
    techStack: ["React", "Tailwind CSS", "Express", "MongoDB"],
    githubLink: "https://github.com/",
    liveLink: "https://example.com/",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Developer Portfolio CMS",
    description: "A full-stack portfolio with JWT admin tools, RESTful project CRUD, validation, and local image uploads.",
    techStack: ["Node.js", "JWT", "Mongoose", "React Router"],
    githubLink: "https://github.com/",
    liveLink: "https://example.com/",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "API-First Task Manager",
    description: "A collaborative task application with clean API boundaries, reusable UI primitives, and MongoDB persistence.",
    techStack: ["Express", "MongoDB", "React Hook Form", "Axios"],
    githubLink: "https://github.com/",
    liveLink: "https://example.com/",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
  }
];

const seedProjects = async () => {
  await connectDB();
  await Project.deleteMany();
  await Project.insertMany(projects);
  console.log("Sample projects seeded");
  process.exit(0);
};

seedProjects().catch((error) => {
  console.error(error);
  process.exit(1);
});
