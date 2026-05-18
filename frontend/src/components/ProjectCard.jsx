import React from "react";
import { Cpu, ExternalLink, Github, Layers, Monitor, Sparkles } from "lucide-react";
import { fallbackProjectImage, imageUrl } from "../api/client";

const cardDetails = (project) => [
  { icon: Monitor, label: `${project.category || "Featured"} project` },
  { icon: Sparkles, label: "Modern interface" },
  { icon: Layers, label: "Responsive layout" },
  { icon: Cpu, label: project.techStack?.[0] ? `${project.techStack[0]} stack` : "Technical build" }
];

const ProjectCard = ({ project }) => {
  const details = cardDetails(project);
  const techStack = project.techStack?.length ? project.techStack : ["React", "Node"];

  return (
    <article className="group relative overflow-hidden rounded-[1.35rem] border border-cyan-100/25 bg-[#14222b] p-2 shadow-[0_22px_55px_rgba(0,0,0,0.45)]">
      <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] border border-white/10" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-cyan-100/60" />
      <div className="pointer-events-none absolute inset-x-10 bottom-2 h-px bg-cyan-200/35" />

      <div className="relative overflow-hidden rounded-[1rem] border border-cyan-100/20 bg-[#0a1117]">
        <div className="relative h-56 overflow-hidden border-b border-cyan-100/15 bg-slate-950">
          <img
            src={imageUrl(project.image)}
            alt={project.title}
            className="h-full w-full object-cover opacity-95 transition-transform duration-500 ease-in-out group-hover:scale-[1.05]"
            onError={(event) => {
              event.currentTarget.src = fallbackProjectImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1117] via-[#0a1117]/10 to-transparent" />
          <div className="absolute inset-3 rounded-lg border border-cyan-100/20" />
          <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
            {project.category && (
              <span className="rounded-full border border-cyan-100/25 bg-slate-950/55 px-3 py-1 text-xs font-bold text-cyan-50 backdrop-blur">
                {project.category}
              </span>
            )}
            <span className="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_16px_rgba(165,243,252,0.9)]" />
          </div>
        </div>

        <div className="space-y-4 bg-gradient-to-br from-[#16252d] via-[#111b24] to-[#1c1a31] p-5 text-cyan-50">
          <div>
            <h3 className="font-mono text-2xl font-bold tracking-wide text-cyan-100 drop-shadow-[0_0_12px_rgba(165,243,252,0.35)]">
              {project.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-cyan-50/80">{project.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-y border-cyan-100/10 py-3">
            {details.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex min-w-0 items-center gap-2 text-xs text-cyan-50/75">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-cyan-200/85" />
                  <span className="truncate">{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {techStack.slice(0, 4).map((tech) => (
              <span key={tech} className="rounded-md border border-cyan-100/20 bg-white/10 px-3 py-2 text-sm font-bold text-cyan-50 shadow-[inset_0_0_18px_rgba(125,211,252,0.06)]">
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 pt-1">
            {project.githubLink && (
              <a
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-cyan-100/25 bg-slate-950/45 text-cyan-100 transition hover:border-cyan-100/60 hover:bg-cyan-100/10"
                href={project.githubLink}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} code`}
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {project.liveLink && (
              <a
                className="inline-flex min-w-36 items-center justify-center gap-2 rounded-md border border-cyan-100/35 bg-cyan-200/22 px-6 py-3 text-base font-extrabold text-cyan-50 shadow-[inset_0_0_18px_rgba(165,243,252,0.25),0_0_18px_rgba(34,211,238,0.16)] transition hover:border-cyan-100/70 hover:bg-cyan-100/30"
                href={project.liveLink}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="h-4 w-4" /> Live
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
