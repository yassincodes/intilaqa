import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function stripOpenRouterKey(raw) {
  if (raw == null || typeof raw !== "string") return "";
  let s = raw.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

/** Tolerates `.env` lines like `API_KEY = "…"` (spaces in key name). */
function findLooseApiKey(env) {
  for (const [k, v] of Object.entries(env)) {
    if (String(k).replace(/\s/g, "").toUpperCase() === "API_KEY") {
      return stripOpenRouterKey(String(v));
    }
  }
  return "";
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const openRouterKey =
    stripOpenRouterKey(env.API_KEY || env.VITE_OPENROUTER_API_KEY || env.OPENROUTER_API_KEY || "") ||
    findLooseApiKey(env);

  return {
    plugins: [react()],
    define: {
      "import.meta.env.OPENROUTER_API_KEY": JSON.stringify(openRouterKey),
    },
  };
});
