import React from "react";
import { ExternalLink, Github } from "lucide-react";
import { fallbackProjectImage, imageUrl } from "../api/client";

const ProjectCard = ({ project }) => (
  <article
    className="group overflow-hidden rounded-xl border border-slate-900/10 bg-white/75 shadow-2xl shadow-slate-400/20 backdrop-blur-xl dark:border-white/15 dark:bg-white/10 dark:shadow-black/20"
  >
    <div className="relative h-56 overflow-hidden">
      <img
        src={imageUrl(project.image)}
        alt={project.title}
        className="h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.src = fallbackProjectImage;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
      {project.category && (
        <span className="absolute left-4 top-4 rounded-full border border-cyan-100/20 bg-slate-950/45 px-3 py-1 text-xs font-semibold text-cyan-50 backdrop-blur">
          {project.category}
        </span>
      )}
    </div>
    <div className="space-y-4 p-5">
      <div>
        <h3 className="text-xl font-bold text-slate-950 dark:text-white">{project.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-white/70">{project.description}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {project.techStack?.map((tech) => (
          <span key={tech} className="rounded-md border border-teal-700/15 bg-teal-50/80 px-2.5 py-1 text-xs font-semibold text-teal-800 dark:border-white/10 dark:bg-white/10 dark:text-cyan-50">
            {tech}
          </span>
        ))}
      </div>
      <div className="flex gap-3">
        {project.githubLink && (
          <a className="inline-flex items-center gap-2 rounded-md border border-slate-900/20 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:border-teal-700 hover:bg-white dark:border-white/20 dark:text-white dark:hover:border-cyan-200 dark:hover:bg-white/10" href={project.githubLink} target="_blank" rel="noreferrer">
            <Github className="h-4 w-4" /> Code
          </a>
        )}
        {project.liveLink && (
          <a className="inline-flex items-center gap-2 rounded-md bg-cyan-100 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-white" href={project.liveLink} target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4" /> Live
          </a>
        )}
      </div>
    </div>
  </article>
);

export default ProjectCard;
