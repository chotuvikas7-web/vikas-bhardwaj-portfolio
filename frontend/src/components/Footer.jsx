import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-slate-200 bg-[#f7f5ef] py-10 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
    <div className="container-pad grid gap-6 sm:grid-cols-[1.5fr_1fr] sm:items-center">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Vikas Bhardwaj</p>
        <p className="text-sm">UI Developer portfolio. Built with React, Three.js, Tailwind, and Node.js.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:items-center">
        <div className="flex flex-wrap gap-3 text-sm text-slate-700 dark:text-slate-300">
          <Link to="/" className="hover:text-slate-950 dark:hover:text-white">Home</Link>
          <Link to="/projects" className="hover:text-slate-950 dark:hover:text-white">Projects</Link>
          <Link to="/about" className="hover:text-slate-950 dark:hover:text-white">About</Link>
          <Link to="/contact" className="hover:text-slate-950 dark:hover:text-white">Contact</Link>
        </div>
        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
          <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-full p-2 transition hover:bg-slate-200 dark:hover:bg-slate-800">
            <Github className="h-4 w-4" />
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-full p-2 transition hover:bg-slate-200 dark:hover:bg-slate-800">
            <Linkedin className="h-4 w-4" />
          </a>
          <a href="mailto:alex@example.com" aria-label="Email" className="rounded-full p-2 transition hover:bg-slate-200 dark:hover:bg-slate-800">
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
