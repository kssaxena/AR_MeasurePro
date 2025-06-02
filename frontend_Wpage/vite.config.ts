import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  // ✅ Load .env files based on the mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      host: "::",
      port: 5173,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(
      Boolean
    ),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // ✅ Inject environment variables here
      "process.env.DomainUrl": JSON.stringify(env.DomainUrl),
    },
  };
});
