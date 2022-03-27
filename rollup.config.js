import nodeResolve from "@rollup/plugin-node-resolve"
import common from "@rollup/plugin-commonjs"
import babel from "@rollup/plugin-babel"
import typescript from "@rollup/plugin-typescript"
import postcss from "rollup-plugin-postcss"
import copy from "rollup-plugin-copy"
import run from "@rollup/plugin-run"

const extensions = [".js", ".ts", ".tsx", ".jsx", ".css"]

export default [
    {
        input: "index.js",
        output: [
            {
                dir: "./dist",
                format: "cjs",
            },
        ],
        external: ["solid-js", "solid-js/web", "path", "express", "stream"],
        plugins: [
            typescript(),
            nodeResolve({
                extensions,
                browser: true,
                preferBuiltins: true,
                exportConditions: ["solid", "node"],
            }),
            babel({
                exclude: "src/**/*.css",
                extensions,
                babelHelpers: "bundled",
                presets: [["solid", { generate: "ssr", hydratable: true }]],
            }),

            common(),
            postcss({
                extract: "public/index.css",
            }),
            run({ allowRestarts: true }),

            copy({
                targets: [{ src: "public", dest: "dist" }],
            }),
        ],

        preserveEntrySignatures: false,
    },
    {
        input: "src/index.tsx",
        output: [
            {
                dir: "./dist/public",
                format: "esm",
            },
        ],
        sourceMap: "inline",

        plugins: [
            typescript(),
            nodeResolve({
                exportConditions: ["solid"],
                extensions: [".mjs", ".js", ".jsx", ".json"],
            }),

            babel({
                exclude: "src/**/*.css",

                extensions,
                babelHelpers: "bundled",

                presets: [["solid", { generate: "dom", hydratable: true }]],
            }),

            common(),
            postcss({
                extensions: [".css"],
            }),
        ],

        preserveEntrySignatures: false,
    },
]
