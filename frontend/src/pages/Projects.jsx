import React from "react";
import { Grid3X3, List, Loader2, RefreshCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api, fallbackProjectImage, getApiErrorMessage } from "../api/client";
import DataTable from "../components/DataTable";
import PageShell from "../components/PageShell";
import { imageUrl } from "../api/client";
import ProjectCard from "../components/ProjectCard";

const initialProjectCount = 6;
const projectLoadStep = 3;
const categoryPriority = (category) => (category === "Website" ? 0 : 1);
const sortWebsiteFirst = (items) =>
  [...items].sort((a, b) => {
    const priority = categoryPriority(a.category) - categoryPriority(b.category);
    if (priority !== 0) return priority;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

const Projects = ({ embedded = false }) => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [visibleCount, setVisibleCount] = useState(initialProjectCount);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/projects", {
        params: { t: Date.now() }
      });
      setProjects(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not load projects"));
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories", {
        params: { t: Date.now() }
      });
      const categoryNames = data
        .map((category) => category.name)
        .sort((a, b) => categoryPriority(a) - categoryPriority(b) || a.localeCompare(b));
      setCategories(["All", ...categoryNames]);
    } catch (err) {
      console.warn("Could not load categories", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  useEffect(() => {
    setVisibleCount(initialProjectCount);
    setLoadingMore(false);
  }, [activeCategory, viewMode, projects.length]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    window.setTimeout(() => {
      setVisibleCount((count) => count + projectLoadStep);
      setLoadingMore(false);
    }, 350);
  };

  const sortedProjects = useMemo(() => sortWebsiteFirst(projects), [projects]);
  const filteredProjects = embedded
    ? sortedProjects.slice(0, 3)
    : sortedProjects.filter((project) => activeCategory === "All" || project.category === activeCategory);
  const visibleProjects = embedded ? filteredProjects : filteredProjects.slice(0, visibleCount);
  const hasMoreProjects = !embedded && visibleProjects.length < filteredProjects.length;
  const projectColumns = [
    {
      key: "title",
      label: "Project",
      render: (project) => (
        <div className="flex min-w-[260px] items-center gap-4">
          <img
            src={imageUrl(project.image)}
            alt={project.title}
            className="h-14 w-20 rounded-lg object-cover shadow-lg shadow-black/20"
            onError={(event) => {
              event.currentTarget.src = fallbackProjectImage;
            }}
          />
          <div>
            <p className="font-semibold text-slate-950 dark:text-white">{project.title}</p>
            <p className="mt-1 line-clamp-2 max-w-sm text-xs leading-5 text-slate-600 dark:text-white/60">{project.description}</p>
          </div>
        </div>
      )
    },
    { key: "category", label: "Category", render: (project) => project.category || "Featured" },
    {
      key: "techStack",
      label: "Tech Stack",
      render: (project) => (
        <div className="flex max-w-xs flex-wrap gap-2">
          {project.techStack?.length ? project.techStack.map((tech) => (
            <span key={tech} className="rounded-md border border-teal-700/15 bg-teal-50/80 px-2 py-1 text-xs text-teal-800 dark:border-white/10 dark:bg-white/10 dark:text-cyan-50">
              {tech}
            </span>
          )) : "React"}
        </div>
      )
    },
    { key: "status", label: "Status", render: (project) => project.featured ? "Featured" : "Published" },
    {
      key: "actions",
      label: "Actions",
      render: (project) => (
        <div className="flex flex-wrap gap-2">
          {project.githubLink && (
            <a className="rounded-md border border-slate-900/20 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:border-teal-700 hover:bg-white dark:border-white/20 dark:text-white dark:hover:border-cyan-200 dark:hover:bg-white/10" href={project.githubLink} target="_blank" rel="noreferrer">
              Code
            </a>
          )}
          {project.liveLink && (
            <a className="rounded-md bg-cyan-100 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-white" href={project.liveLink} target="_blank" rel="noreferrer">
              Live
            </a>
          )}
        </div>
      )
    }
  ];

  const content = (
    <>
      {!embedded && (
        <Helmet>
          <title>Projects | Vikas Bhardwaj</title>
          <meta name="description" content="Dynamic project portfolio of Vikas Bhardwaj fetched from a Node, Express, and MongoDB API." />
        </Helmet>
      )}
      <div className={embedded ? "container-pad" : ""}>
        <div className="mb-8 flex flex-col gap-4 text-center sm:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-800 dark:text-cyan-200">Projects</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-slate-950 dark:text-white sm:text-4xl">Selected works and case studies</h2>
          </div>
          {embedded && (
            <Link to="/projects" className="inline-flex items-center justify-center rounded-md border border-slate-900/20 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:border-teal-700 hover:bg-white dark:border-white/20 dark:text-white dark:hover:border-cyan-200 dark:hover:bg-white/10">
              View projects
            </Link>
          )}
        </div>

        {!embedded && (
          <div className="mb-10 flex flex-col items-center justify-center gap-4">
            <div className="flex flex-wrap justify-center gap-2 rounded-full border border-slate-900/10 bg-white/70 p-1 backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className="relative overflow-hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950 dark:text-white/80 dark:hover:text-white"
                >
                  {activeCategory === category && (
                    <motion.span
                      layoutId="active-project-tab"
                      className="absolute inset-0 rounded-full bg-teal-100/80 shadow-[0_0_24px_rgba(13,148,136,0.22)] dark:bg-cyan-100/20 dark:shadow-[0_0_24px_rgba(165,243,252,0.35)]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 p-1 backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
              {[
                { key: "list", label: "List", icon: List },
                { key: "grid", label: "Grid", icon: Grid3X3 }
              ].map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.key}
                    type="button"
                    onClick={() => setViewMode(mode.key)}
                    className="relative inline-flex items-center gap-2 overflow-hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950 dark:text-white/80 dark:hover:text-white"
                  >
                    {viewMode === mode.key && (
                      <motion.span
                        layoutId="active-project-view"
                        className="absolute inset-0 rounded-full bg-violet-100/90 shadow-[0_0_24px_rgba(124,58,237,0.18)] dark:bg-violet-100/20 dark:shadow-[0_0_24px_rgba(221,214,254,0.35)]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <Icon className="relative z-10 h-4 w-4" />
                    <span className="relative z-10">{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-96 animate-pulse rounded-xl border border-slate-900/10 bg-white/60 dark:border-white/10 dark:bg-white/10" />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-700/20 bg-red-50/85 p-5 text-red-900 backdrop-blur dark:border-red-200/30 dark:bg-red-950/50 dark:text-red-100">
            <p>{error}</p>
            <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-md border border-red-700/30 px-5 py-3 text-sm font-semibold text-red-900 transition hover:border-red-700 hover:bg-white dark:border-white/20 dark:text-white dark:hover:border-cyan-200 dark:hover:bg-white/10" onClick={fetchProjects}>
              <RefreshCcw className="h-4 w-4" /> Retry
            </button>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="rounded-xl border border-slate-900/10 bg-white/70 p-8 text-center backdrop-blur dark:border-white/15 dark:bg-white/10">
            <p className="text-slate-700 dark:text-white/70">No projects yet. Add one from the admin dashboard.</p>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <>
            {viewMode === "grid" ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visibleProjects.map((project) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.38, ease: "easeOut" }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <DataTable columns={projectColumns} rows={visibleProjects} emptyMessage="No projects match this category." />
            )}

            {hasMoreProjects && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  className="inline-flex min-w-36 items-center justify-center gap-2 rounded-md border border-cyan-200/35 bg-cyan-100/10 px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.12)] transition hover:border-cyan-300 hover:bg-cyan-100/20 disabled:cursor-not-allowed disabled:opacity-70 dark:text-cyan-50"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loadingMore ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );

  if (embedded) {
    return <section className="border-t border-white/10 bg-[#070b18] py-16 text-white">{content}</section>;
  }

  return <PageShell>{content}</PageShell>;
};

export default Projects;
