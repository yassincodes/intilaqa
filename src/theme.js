/**
 * مدرسة الانطلاقة — Premium Eco Design System
 *
 * Single source of truth for colors, gradients, easings, and motion variants.
 * Use C.* for raw colors and G.* for ready-made gradients.
 */

export const C = {
  // ── Primary brand palette (per design brief) ────────────────────────────
  primary: "#166534", // deep forest green
  primaryDeep: "#0F4D27", // darker shade for depth
  primarySoft: "#22823F", // lighter shade for hover/glow
  accent: "#0EA5E9", // accent teal
  accentSoft: "#7DD3FC",
  accentDeep: "#0369A1",

  gold: "#D97706", // warm gold accent for CTAs / highlights
  goldSoft: "#F59E0B",
  goldLight: "#FEF3C7",

  // ── Surfaces ──────────────────────────────────────────────────────────
  bg: "#F8F1E3", // warm cream background
  bgAlt: "#E0F2E9", // light sage
  bgWarm: "#FBF5E8", // cream highlight
  surface: "#FFFFFF",
  surfaceMuted: "#F3F0E6",
  surfaceTinted: "#ECF6EF", // sage-tinted card

  // ── Text ─────────────────────────────────────────────────────────────
  text: "#1F2937", // dark slate
  textSoft: "#374151",
  muted: "#6B7280",
  mutedSoft: "#9CA3AF",

  // ── Lines / borders ──────────────────────────────────────────────────
  border: "#E2E8E0",
  borderSoft: "#EDEAE0",

  // ── Functional ───────────────────────────────────────────────────────
  success: "#16A34A",
  warning: "#D97706",
  danger: "#DC2626",
  liveRed: "#EF4444",

  // ── Dark surfaces (footer, TV bg etc.) ───────────────────────────────
  ink: "#0B1411",
  inkSoft: "#11231D",
  onDark: "#F8F1E3",
  onDarkMuted: "rgba(248,241,227,0.62)",

  // ── Legacy aliases (kept so older code still resolves) ────────────────
  dark: "#1F2937",
  darkMuted: "#0F4D27",
  green: "#166534",
  greenDeep: "#0F4D27",
  greenLight: "#86EFAC",
  mint: "#E0F2E9",
  blue: "#0EA5E9",
  blueLight: "#BAE6FD",
  sky: "#E0F2FE",
  white: "#FFFFFF",
  orange: "#D97706",
  orangeLight: "#FEF3C7",
  sand: "#EDEAE0",
  screen: "#020617",
};

/* ────────────────── Gradients ────────────────── */
export const G = {
  hero: `radial-gradient(1200px 700px at 12% 10%, ${C.bgAlt} 0%, transparent 60%),
         radial-gradient(900px 600px at 90% 90%, #FBE9C2 0%, transparent 60%),
         linear-gradient(180deg, ${C.bg} 0%, #F4ECDB 100%)`,
  forest: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDeep} 100%)`,
  forestSoft: `linear-gradient(135deg, ${C.primarySoft} 0%, ${C.primary} 100%)`,
  ocean: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentDeep} 100%)`,
  goldRich: `linear-gradient(135deg, ${C.goldSoft} 0%, ${C.gold} 100%)`,
  ink: `linear-gradient(160deg, ${C.ink} 0%, ${C.inkSoft} 100%)`,
  glassLight: `linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 100%)`,
  shineDiag: `linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)`,
};

/* ────────────────── Shadows ────────────────── */
export const S = {
  soft: "0 6px 24px rgba(15, 77, 39, 0.06), 0 2px 6px rgba(15, 77, 39, 0.04)",
  card: "0 12px 36px rgba(15, 77, 39, 0.08), 0 2px 8px rgba(15, 77, 39, 0.04)",
  hover: "0 22px 60px rgba(15, 77, 39, 0.16), 0 8px 16px rgba(15, 77, 39, 0.06)",
  gold: "0 10px 32px rgba(217, 119, 6, 0.28), 0 2px 8px rgba(217, 119, 6, 0.18)",
  forest: "0 12px 36px rgba(22, 101, 52, 0.32), 0 4px 12px rgba(22, 101, 52, 0.18)",
};

/* ────────────────── Easings ────────────────── */
export const E = {
  smooth: [0.16, 1, 0.3, 1],
  spring: [0.34, 1.56, 0.64, 1],
  inOut: [0.65, 0, 0.35, 1],
  butter: [0.22, 0.61, 0.36, 1],
};

/* ────────────────── Framer Motion variants ────────────────── */
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: E.smooth },
  },
};

export const stagger = (delay = 0.05) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: delay },
  },
});

export const popIn = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: E.smooth },
  },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: E.smooth } },
};
