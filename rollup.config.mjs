import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";
import json from "@rollup/plugin-json";

// import pkg from "./package.json" assert { type: "json" };
import tsConfig from "./tsconfig.json"  assert { type: "json" };

const isProd = process.env.NODE_ENV === "production";

/**
 * @type {import("rollup").RollupOptions[]}
 */
export default [
  {
    input: "src/extension.ts",
    // TODO: fix externals
    external: ["vscode", "firebase", "firebase/app", "firebase/database"],
    output: {
      dir: "dist",
      format: "cjs",
    },
    context: "this",
    plugins: [
      json(),
      resolve({
        browser: false,
        preferBuiltins: true,
      }),
      commonjs({
        ignoreGlobal: true,
      }),
      esbuild({
        minify: isProd,
        sourceMap: !isProd,
        target: tsConfig.compilerOptions.target,
      }),
    ],
  },
];