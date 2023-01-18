import { defineConfig } from "vite";
import path from "path";

const libName = "gatsby-source-storyblok";

export default defineConfig(() => {
  return {
    build: {
      lib: {
        entry: path.resolve(__dirname, "index.ts"),
        name: "storyblokGatsby",
        fileName: (format) =>
          format === "es" ? `${libName}.mjs` : `${libName}.js`,
      },
      rollupOptions: {
        external: ["react"],
        output: {
          globals: { react: "React" },
        },
      },
    },
  };
});