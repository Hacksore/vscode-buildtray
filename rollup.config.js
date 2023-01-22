const typescript = require("@rollup/plugin-typescript");
const { terser } = require("rollup-plugin-terser");

const isProduction = process.env.NODE_ENV === "production";

/** @type {import('rollup').RollupOptions} */
module.exports = {
  input: "./src/extension.ts", // the entry point of this extension
  output: {
    file: "dist/extension.js",
    format: "cjs",
    sourcemap: !isProduction, // don't generate sourcemaps in production builds
  },
  external: ["vscode"],
  plugins: [typescript({ module: "es6" }), isProduction && terser()], // rollup doesn't transpile typescript by default, we need to use this plugin
};
