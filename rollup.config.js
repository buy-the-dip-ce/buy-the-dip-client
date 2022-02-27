import nodeResolve from "@rollup/plugin-node-resolve"
import common from "@rollup/plugin-commonjs"
import babel from "@rollup/plugin-babel"
import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import postcss from "rollup-plugin-postcss"
import run from "@rollup/plugin-run"
import copy from "rollup-plugin-copy"
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
                preferBuiltins: true,
                exportConditions: ["solid", "node"],
            }),
            resolve({ extensions, browser: true }),
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
]
