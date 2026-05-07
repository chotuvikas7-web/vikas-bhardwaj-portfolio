import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const snowflakes = Array.from({ length: 70 }, (_, index) => ({
  id: index,
  left: `${(index * 23 + 7) % 100}%`,
  delay: (index % 14) * 0.42,
  duration: 9 + (index % 9) * 1.1,
  size: 3 + (index % 7) * 1.8,
  drift: index % 3 === 0 ? 46 : index % 3 === 1 ? -36 : 22,
  opacity: 0.28 + (index % 6) * 0.1,
  blur: index % 5 === 0 ? "blur-[1px]" : "",
  symbol: index % 6 === 0 ? "*" : index % 4 === 0 ? "+" : "."
}));

const distantSnow = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: `${(index * 37 + 11) % 100}%`,
  delay: (index % 10) * 0.65,
  duration: 15 + (index % 6) * 1.4,
  size: 2 + (index % 4),
  drift: index % 2 === 0 ? 20 : -18
}));

const lightDrops = Array.from({ length: 30 }, (_, index) => ({
  id: index,
  left: `${(index * 29 + 5) % 100}%`,
  delay: (index % 12) * 0.38,
  duration: 7 + (index % 6) * 0.8,
  height: 12 + (index % 5) * 5,
  drift: index % 2 === 0 ? 20 : -16
}));

const lightLeaves = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${(index * 41 + 9) % 100}%`,
  delay: (index % 9) * 0.55,
  duration: 10 + (index % 6),
  size: 8 + (index % 5) * 2,
  drift: index % 2 === 0 ? 52 : -38
}));

const DarkScene = () => (
  <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_70%_18%,rgba(139,92,246,0.28),transparent_28%),radial-gradient(circle_at_22%_25%,rgba(34,211,238,0.18),transparent_30%),linear-gradient(135deg,#070b18_0%,#11142a_42%,#24123a_100%)]">
    <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_140px)] opacity-20" />
    <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-black/25" />

    <motion.div aria-hidden="true" animate={{ x: [-20, 18, -20], y: [0, -8, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="absolute left-[6%] top-[16%] h-20 w-64 rounded-full bg-white/8 blur-sm before:absolute before:left-10 before:top-[-26px] before:h-20 before:w-20 before:rounded-full before:bg-white/10 after:absolute after:right-12 after:top-[-18px] after:h-16 after:w-16 after:rounded-full after:bg-white/10" />
    <motion.div aria-hidden="true" animate={{ x: [24, -16, 24], y: [0, 10, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} className="absolute right-[8%] top-[22%] h-16 w-56 rounded-full bg-violet-100/8 blur-sm before:absolute before:left-8 before:top-[-22px] before:h-16 before:w-16 before:rounded-full before:bg-violet-100/10 after:absolute after:right-10 after:top-[-16px] after:h-14 after:w-14 after:rounded-full after:bg-cyan-100/10" />

    <motion.div aria-hidden="true" animate={{ opacity: [0.35, 0.75, 0.35], scale: [1, 1.08, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute right-[18%] top-[14%] h-40 w-40 rounded-full bg-cyan-300/15 blur-3xl" />
    <motion.div aria-hidden="true" animate={{ opacity: [0.25, 0.6, 0.25], scale: [1, 1.12, 1] }} transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }} className="absolute left-[12%] bottom-[18%] h-52 w-52 rounded-full bg-violet-400/20 blur-3xl" />

    {distantSnow.map((flake) => (
      <motion.span key={`distant-${flake.id}`} aria-hidden="true" initial={{ y: "-12vh", x: 0, opacity: 0 }} animate={{ y: "112vh", x: flake.drift, opacity: [0, 0.28, 0.28, 0] }} transition={{ duration: flake.duration, delay: flake.delay, repeat: Infinity, ease: "linear" }} className="absolute top-0 rounded-full bg-white/60 blur-[1px]" style={{ left: flake.left, width: flake.size, height: flake.size }} />
    ))}

    {snowflakes.map((flake) => (
      <motion.span key={flake.id} aria-hidden="true" initial={{ y: "-14vh", x: 0, rotate: 0, opacity: 0 }} animate={{ y: "114vh", x: [0, flake.drift, flake.drift * 0.35], rotate: [0, 120, 260], opacity: [0, flake.opacity, flake.opacity, 0] }} transition={{ duration: flake.duration, delay: flake.delay, repeat: Infinity, ease: "linear" }} className={`absolute top-0 font-semibold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.45)] ${flake.blur}`} style={{ left: flake.left, fontSize: flake.size }}>
        {flake.symbol}
      </motion.span>
    ))}

    <div className="absolute bottom-[-16%] left-[-12%] h-64 w-[70%] rounded-[50%] bg-slate-950/45 blur-sm" />
    <div className="absolute bottom-[-18%] right-[-10%] h-72 w-[72%] rounded-[50%] bg-violet-950/55 blur-sm" />
    <div className="absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-black/45 to-transparent" />
  </div>
);

const LightScene = () => (
  <div className="relative h-full w-full overflow-hidden bg-sky-50">
    <img src="/winter-light-bg.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-white/20" />
    <div className="absolute inset-0 bg-gradient-to-t from-white/35 via-transparent to-white/20" />

    {lightDrops.map((drop) => (
      <motion.span
        key={`drop-${drop.id}`}
        aria-hidden="true"
        initial={{ y: "-12vh", x: 0, opacity: 0 }}
        animate={{ y: "112vh", x: drop.drift, opacity: [0, 0.75, 0.65, 0] }}
        transition={{ duration: drop.duration, delay: drop.delay, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 w-1 rounded-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.9)]"
        style={{ left: drop.left, height: drop.height }}
      />
    ))}

    {lightLeaves.map((leaf) => (
      <motion.span
        key={`leaf-${leaf.id}`}
        aria-hidden="true"
        initial={{ y: "-14vh", x: 0, rotate: 0, opacity: 0 }}
        animate={{ y: "114vh", x: [0, leaf.drift, leaf.drift * 0.4], rotate: [0, 180, 360], opacity: [0, 0.55, 0.45, 0] }}
        transition={{ duration: leaf.duration, delay: leaf.delay, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 rounded-full bg-emerald-200/60 shadow-[0_0_10px_rgba(167,243,208,0.55)]"
        style={{ left: leaf.left, width: leaf.size, height: leaf.size * 0.55, borderRadius: "70% 30% 70% 30%" }}
      />
    ))}
  </div>
);

const AnimatedScene = () => {
  const { theme } = useTheme();
  return theme === "dark" ? <DarkScene /> : <LightScene />;
};

export default AnimatedScene;
