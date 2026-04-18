import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import copy from "rollup-plugin-copy";

export default {
  input: "src/perfectdraft-card.ts",
  output: {
    file: "dist/perfectdraft-card.js",
    format: "es",
    sourcemap: false,
  },
  plugins: [
    resolve(),
    typescript(),
    terser({
      format: { comments: false },
    }),
    copy({
      targets: [{ src: "src/assets/**/*", dest: "dist/assets" }],
    }),
  ],
};
