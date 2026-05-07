import React from "react";
import AnimatedScene from "./AnimatedScene";

const PageShell = ({ children, className = "" }) => (
  <section className={`relative min-h-screen overflow-hidden bg-sky-50 text-slate-950 dark:bg-[#070b18] dark:text-white ${className}`}>
    <div className="pointer-events-none fixed inset-0">
      <AnimatedScene />
    </div>
    <div className="pointer-events-none fixed inset-0 bg-gradient-to-r from-white/82 via-white/35 to-white/65 dark:from-black/70 dark:via-slate-950/35 dark:to-black/55" />
    <div className="container-pad relative z-10 py-24">
      {children}
    </div>
  </section>
);

export default PageShell;
