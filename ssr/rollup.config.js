import nodeResolve from "@rollup/plugin-node-resolve"
import common from "@rollup/plugin-commonjs"
import babel from "@rollup/plugin-babel"
import resolve from "@rollup/plugin-node-resolve"

import copy from "rollup-plugin-copy"
import typescript from "@rollup/plugin-typescript"

const extensions = [".js", ".ts", ".tsx", ".jsx"]

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
                extensions,
                babelHelpers: "bundled",
                presets: [["solid", { generate: "ssr", hydratable: true }]],
            }),
            common(),
        ],
        preserveEntrySignatures: false,
    },
    // {
    //     input: "shared/src/index.js",
    //     output: [
    //         {
    //             dir: "ssr/public/js",
    //             format: "esm",
    //         },
    //     ],
    //     preserveEntrySignatures: false,
    //     plugins: [
    //         nodeResolve({ exportConditions: ["solid"] }),
    //         babel({
    //             babelHelpers: "bundled",
    //             presets: [["solid", { generate: "dom", hydratable: true }]],
    //         }),
    //         common(),
    //         copy({
    //             targets: [
    //                 {
    //                     src: ["examples/shared/static/*"],
    //                     dest: "examples/ssr/public",
    //                 },
    //             ],
    //         }),
    //     ],
    // },
]
