import babel from "@rollup/plugin-babel";

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/tracker.cjs.js",
      format: "cjs",
    },
    {
      file: "dist/tracker.esm.js",
      format: "es",
    },
    {
      file: "dist/tracker.umd.js",
      format: "umd",
      name: "SimpleTracker",
    },
  ],
  plugins: [
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-env"],
    }),
  ],
};
