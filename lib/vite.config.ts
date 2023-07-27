import { defineConfig } from "vite";
import path from "path";

const libName = "gatsby-source-storyblok";

export default defineConfig(() => {
  return {
    build: {
      lib: {
        entry: [
          path.resolve(__dirname, "index.ts"),
          path.resolve(__dirname, "story.tsx"),
        ],
        name: "storyblokGatsby",
        fileName: (format) =>
          format === "es" ? `${libName}.mjs` : `${libName}.js`,
      },
      minify: "terser",
      terserOptions: {
        compress: {
          directives: false,
        },
      },
      rollupOptions: {
        external: ["react"],
        output: {
          globals: { react: "React" },
          banner: (chunk) =>
            ["story"].includes(chunk.name)
              ? '"use client";'
              : "",
        },
      },
    },
  };
});