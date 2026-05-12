import React, { useEffect, useState } from "react";
import { Download, FileText, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import AnimatedScene from "../components/AnimatedScene";
import { imageUrl } from "../api/client";
import { useProfile } from "../context/ProfileContext.jsx";

const Home = () => {
  const { profile } = useProfile();
  const [profileImageFailed, setProfileImageFailed] = useState(false);
  const name = profile?.name || "Vikas Bhardwaj";
  const role = profile?.role || "UI Developer";
  const bio =
    profile?.bio ||
    "I design polished user interfaces with modern frontend stacks like React, Tailwind, and Three.js. My focus is on delivering highly interactive and responsive web experiences.";
  const profileImage = profile?.image ? imageUrl(profile.image) : "";
  const resumeLink = profile?.resume ? imageUrl(profile.resume) : "";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    setProfileImageFailed(false);
  }, [profileImage]);

  return (
    <>
      <Helmet>
        <title>Vikas Bhardwaj | Home</title>
        <meta name="description" content="Home page for Vikas Bhardwaj, a UI developer portfolio featuring modern web technologies and 3D animations." />
      </Helmet>

      <section className="relative overflow-hidden bg-sky-50 text-slate-950 dark:bg-[#070b18] dark:text-white">
        <div className="pointer-events-none absolute inset-0">
          <AnimatedScene />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/82 via-white/25 to-white/45 dark:from-black/60 dark:via-slate-950/18 dark:to-black/30" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/65 to-transparent dark:from-black/50" />

        <div className="container-pad relative z-10 grid min-h-screen items-center gap-10 pb-12 pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:pb-16 lg:pt-28">
          <div className="max-w-3xl space-y-7">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-teal-700/15 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-teal-800 shadow-sm backdrop-blur dark:border-cyan-100/20 dark:bg-white/10 dark:text-cyan-50"
            >
              <Sparkles className="h-4 w-4" />
              Creative portfolio
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="text-4xl font-black leading-tight tracking-normal text-slate-950 dark:text-white sm:text-5xl lg:text-6xl"
            >
              {name}
              <span className="mt-3 block text-teal-700 dark:text-cyan-200">{role}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16 }}
              className="max-w-2xl text-base font-medium leading-8 text-slate-950 dark:text-white sm:text-lg"
            >
              {bio}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24 }}
              className="flex flex-wrap gap-4"
            >
              {resumeLink && (
                <>
                  <a href={resumeLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-teal-700/20 bg-white/65 px-5 py-3 text-sm font-semibold text-slate-950 backdrop-blur transition hover:border-teal-700 hover:bg-white dark:border-cyan-100/40 dark:bg-cyan-100/10 dark:text-white dark:hover:border-cyan-100 dark:hover:bg-cyan-100/20">
                    Preview resume <FileText className="h-4 w-4" />
                  </a>
                  <a href={resumeLink} download className="inline-flex items-center gap-2 rounded-md border border-slate-900/20 bg-white/45 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-900 hover:bg-white dark:border-white/30 dark:bg-transparent dark:text-white dark:hover:border-white dark:hover:bg-white/10">
                    Download resume <Download className="h-4 w-4" />
                  </a>
                </>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease: "easeOut" }}
            className="relative mx-auto flex w-full max-w-[420px] items-center justify-center lg:max-w-[500px]"
          >
            <motion.div
              aria-hidden="true"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute aspect-square w-[78%] rounded-full border border-dashed border-teal-600/45 dark:border-cyan-100/55"
            />
            <motion.div
              aria-hidden="true"
              animate={{ y: [0, -14, 0], scale: [1, 1.03, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute aspect-square w-[64%] rounded-full border border-sky-300/55 bg-white/30 dark:border-violet-200/35 dark:bg-cyan-100/10"
            />
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-square w-[72%] overflow-hidden rounded-full border-4 border-white/80 bg-slate-900 shadow-2xl shadow-slate-400/40 dark:border-white/50 dark:shadow-cyan-950/40"
            >
              {profileImage && !profileImageFailed ? (
                <img src={profileImage} alt={name} className="h-full w-full object-cover" onError={() => setProfileImageFailed(true)} />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-emerald-300 text-6xl font-black text-slate-950">
                  {initials || "VB"}
                </div>
              )}
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-8 right-2 rounded-md border border-slate-900/10 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-950 backdrop-blur dark:border-white/15 dark:bg-white/10 dark:text-white"
            >
              React . Node . UI
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
