import React from "react";
import { Code2, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const links = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" }
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className={`z-40 transition ${isHome ? "absolute inset-x-0 top-0" : "sticky top-0 bg-white/70 backdrop-blur-xl dark:bg-[#070b18]/75"}`}>
      <nav className="container-pad grid min-h-16 grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-slate-900/10 text-slate-950 dark:border-white/10 dark:text-white">
        <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
          <NavLink to="/" className="inline-flex items-center gap-2 font-bold text-slate-950 dark:text-white">
            <Code2 className="h-5 w-5 text-teal-700 dark:text-cyan-200" />
            Vikas Bhardwaj
          </NavLink>
        </motion.div>
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }} className="mx-auto flex items-center justify-center gap-1 rounded-full border border-slate-900/10 bg-white/60 p-1 shadow-lg shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 sm:gap-2">
          {links.map((link) => (
            <motion.div
              key={link.to}
              variants={{ hidden: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <NavLink
                to={link.to}
                className="relative inline-flex overflow-hidden rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:text-slate-950 dark:text-white/80 dark:hover:text-white sm:px-4"
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="active-nav-tab"
                        className="absolute inset-0 rounded-full bg-teal-200/60 shadow-[0_0_26px_rgba(15,118,110,0.18)] dark:bg-cyan-100/20 dark:shadow-[0_0_26px_rgba(165,243,252,0.35)]"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </motion.div>
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }} className="flex items-center justify-end gap-2">
          <motion.button
            type="button"
            onClick={toggleTheme}
            className="rounded-md border border-slate-900/15 p-2 text-slate-900 transition hover:border-teal-700 hover:bg-white/60 dark:border-white/20 dark:text-white dark:hover:border-cyan-200 dark:hover:bg-white/10"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
            variants={{ hidden: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -2, rotate: 8 }}
            whileTap={{ scale: 0.92 }}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </motion.button>
        </motion.div>
      </nav>
    </header>
  );
};

export default Navbar;
