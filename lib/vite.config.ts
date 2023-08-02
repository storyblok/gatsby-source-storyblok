import { defineConfig } from "vite";
import path from "path";
import preserveDirectives from "rollup-plugin-preserve-directives";

const libName = "gatsby-source-storyblok";

export default defineConfig(() => {
  return {
    plugins: [preserveDirectives()],
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
      rollupOptions: {
        external: ["react"],
        output: {
          preserveModules: true,
          globals: { react: "React" },
        },
      },
    },
  };
});
