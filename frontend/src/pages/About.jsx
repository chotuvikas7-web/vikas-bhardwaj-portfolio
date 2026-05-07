import React from "react";
import { BriefcaseBusiness, CheckCircle, Code2, GraduationCap, LayoutDashboard, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageShell from "../components/PageShell";
import { useProfile } from "../context/ProfileContext.jsx";

const capabilityCards = [
  { icon: Code2, label: "HTML/CSS/JS", value: 95, text: "Clean front-end foundations with responsive structure." },
  { icon: LayoutDashboard, label: "React UI", value: 90, text: "Reusable components, stateful views, and polished screens." },
  { icon: Sparkles, label: "Animations", value: 86, text: "Smooth motion with Framer Motion, Three.js, and GSAP." },
  { icon: CheckCircle, label: "Product Design", value: 82, text: "Interfaces shaped for clarity, speed, and usability." }
];

const About = () => {
  const { profile, loading } = useProfile();
  const name = profile?.name || "Vikas Bhardwaj";
  const role = profile?.role || "UI Developer";
  const bio =
    profile?.bio ||
    "I specialize in building intuitive interfaces using React, Tailwind, and animation libraries. My work is focused on delivering polished and responsive digital experiences.";

  const experiences = [
    { id: 1, company: "TeckValley India PVT LTD, Noida", period: "July 2022 - Present", role: "UI Developer" },
    { id: 2, company: "Notabene Global Services PVT LTD, Noida", period: "May 2020 - June 2022", role: "UI Developer" },
    { id: 3, company: "RailYatri PVT LTD, Noida", period: "Sep 2019 - April 2020", role: "UI Developer" }
  ];

  const buildRows = [
    { id: 1, item: "Reusable Components", detail: "Clean UI design with reusable components." },
    { id: 2, item: "Responsive Layouts", detail: "Responsive layouts using Tailwind CSS and Bootstrap." },
    { id: 3, item: "Motion UI", detail: "Interactive animations with Three.js, GSAP, and Framer Motion." }
  ];

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-200 border-t-transparent" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Helmet>
        <title>About | {name}</title>
        <meta name="description" content={`About ${name}, a ${role} with experience in modern web technologies and product design.`} />
      </Helmet>

      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-800 dark:text-cyan-200">About</p>
        <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 dark:text-white sm:text-5xl">Crafting intuitive UI experiences with modern web technologies.</h1>
        <p className="mx-auto mt-6 max-w-3xl text-base font-medium leading-8 text-slate-800 dark:text-white/75">
          {name} is a {role} focused on building visually appealing, responsive interfaces. {bio}
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {capabilityCards.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ y: -8, scale: 1.03 }}
              transition={{ duration: 0.38, delay: index * 0.06 }}
              className="group rounded-xl border border-slate-900/10 bg-white/75 p-6 shadow-2xl shadow-slate-400/20 backdrop-blur-xl dark:border-white/15 dark:bg-white/10 dark:shadow-black/20"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-800 shadow-[0_0_28px_rgba(13,148,136,0.12)] dark:bg-cyan-100/15 dark:text-cyan-100 dark:shadow-[0_0_28px_rgba(165,243,252,0.18)]">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="rounded-full border border-teal-700/15 bg-teal-50/80 px-3 py-1 text-xs font-bold text-teal-800 dark:border-white/10 dark:bg-white/10 dark:text-cyan-50">
                  {item.value}%
                </span>
              </div>
              <h2 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">{item.label}</h2>
              <p className="mt-3 min-h-12 text-sm leading-6 text-slate-700 dark:text-white/65">{item.text}</p>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-900/10 dark:bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 0.9, delay: 0.25 + index * 0.08, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-200 via-violet-200 to-white shadow-[0_0_18px_rgba(165,243,252,0.45)]"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-slate-900/10 bg-white/75 p-7 shadow-2xl shadow-slate-400/20 backdrop-blur-xl dark:border-white/15 dark:bg-white/10 dark:shadow-black/20"
        >
          <h2 className="mb-5 text-2xl font-bold text-slate-950 dark:text-white">What I Build</h2>
          <div className="space-y-4">
            {buildRows.map((row, index) => (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="rounded-lg border border-slate-900/10 bg-white/65 p-4 dark:border-white/10 dark:bg-white/10"
              >
                <div className="flex gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-teal-700 dark:text-cyan-200" />
                  <div>
                    <p className="font-semibold text-slate-950 dark:text-white">{row.item}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-white/65">{row.detail}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-xl border border-slate-900/10 bg-white/75 p-7 shadow-2xl shadow-slate-400/20 backdrop-blur-xl dark:border-white/15 dark:bg-white/10 dark:shadow-black/20"
        >
          <h2 className="mb-5 text-2xl font-bold text-slate-950 dark:text-white">Education</h2>
          <div className="rounded-lg border border-slate-900/10 bg-white/65 p-5 dark:border-white/10 dark:bg-white/10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-cyan-100/15 dark:text-cyan-100">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-950 dark:text-white">BCA</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-white/65">Bachelor of Computer Applications</p>
                <p className="mt-4 inline-flex rounded-full border border-teal-700/15 bg-teal-50/80 px-3 py-1 text-xs font-semibold text-teal-800 dark:border-white/10 dark:bg-white/10 dark:text-cyan-50">
                  MCU Bhopal . 2015
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-12">
        <div className="mb-5 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-800 dark:text-cyan-200">Experience</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">Professional Timeline</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="rounded-xl border border-slate-900/10 bg-white/75 p-6 shadow-2xl shadow-slate-400/20 backdrop-blur-xl dark:border-white/15 dark:bg-white/10 dark:shadow-black/20"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 text-violet-800 dark:bg-violet-100/15 dark:text-violet-100">
                <BriefcaseBusiness className="h-6 w-6" />
              </div>
              <p className="mt-5 text-lg font-bold text-slate-950 dark:text-white">{exp.company}</p>
              <p className="mt-3 text-sm font-semibold text-teal-800 dark:text-cyan-100">{exp.period}</p>
              <p className="mt-3 text-sm text-slate-700 dark:text-white/65">{exp.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </PageShell>
  );
};

export default About;
