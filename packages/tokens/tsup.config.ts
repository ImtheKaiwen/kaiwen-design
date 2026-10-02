import { defineConfig } from "tsup";
import fs from "node:fs";
import path from "node:path";
import { generateTokensCss } from "./src/cssVariables.js";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  onSuccess: async () => {
    const css = generateTokensCss();
    const distDir = path.resolve("./dist");
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    fs.writeFileSync(path.join(distDir, "tokens.css"), css, "utf-8");
  },
});
