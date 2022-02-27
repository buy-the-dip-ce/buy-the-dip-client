import nodeResolve from "@rollup/plugin-node-resolve"
import common from "@rollup/plugin-commonjs"
import babel from "@rollup/plugin-babel"
import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import copy from "rollup-plugin-copy"
import css from "rollup-plugin-import-css"

const extensions = [".js", ".ts", ".tsx", ".jsx", ".css"]

export default [
    {
        input: "ssr/index.js",
        output: [
            {
                dir: "./ssr/dist",
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
                exclude: "**/*.css",
                extensions,
                babelHelpers: "bundled",
                presets: [["solid", { generate: "ssr", hydratable: true }]],
            }),

            common(),
            css(),
            copy({
                targets: [
                    {
                        src: ["**/*.css"],
                        dest: "./ssr/dist/public",
                    },
                ],
            }),
        ],

        preserveEntrySignatures: false,
    },
]
