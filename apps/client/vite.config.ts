import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import progress from "vite-plugin-progress"
import tsconfigPaths from "vite-tsconfig-paths"
import colors from "picocolors"
import dotenv from "dotenv"

dotenv.config()

const port = Number(process.env.VITE_PORT || 3000)
export default defineConfig({
  base: "./",
  root: ".",
  plugins: [
    react(),
    progress({
      format: `${colors.green(colors.bold("🔥🔥🔥🔥🔥🔥✨✨✨CLIENT is Building .....🔥🔥🔥🔥🔥🔥\n"))} ${colors.cyan("[:bar]")} :percent`
    }),
    tsconfigPaths()
  ],
  server: {
    port
  },
  preview: {
    port
  },
  build: {
    copyPublicDir: false,
    modulePreload: false,
    target: "esnext",
    minify: true,
    cssCodeSplit: false
  }
})
