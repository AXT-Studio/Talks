import presenit from "@ayaexptech/presen-it";
import { defineConfig } from "vite-plus";

export default defineConfig({
  // Published at https://axt-studio.github.io/Talks/
  base: "/Talks/",
  plugins: [
    presenit({
      includes: ["src/slides/**/index.md"],
      root: "src",
    }),
  ],
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    // src/slides/ is synced from AXT-Studio/Talks-WIP and must not be edited here.
    ignorePatterns: ["src/slides/**"],
  },
  lint: {
    ignorePatterns: ["src/slides/**"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
