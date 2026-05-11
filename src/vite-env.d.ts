/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Injected from `API_KEY` / `VITE_OPENROUTER_API_KEY` via vite.config.js */
  readonly OPENROUTER_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
