import { defineConfig } from "tsup";
import fs from "node:fs";
import path from "node:path";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  external: ["react", "react-dom"],
  onSuccess: async () => {
    const srcCssPath = path.resolve("./src/styles/kaiwen.css");
    const distDir = path.resolve("./dist");
    if (fs.existsSync(srcCssPath)) {
      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
      }
      fs.copyFileSync(srcCssPath, path.join(distDir, "styles.css"));
    }
  },
});
