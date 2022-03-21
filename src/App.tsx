import type { Component } from "solid-js"
import { Link, MetaProvider } from "solid-meta"
import { createSignal } from "solid-js"
import { isServer } from "solid-js/web"
import Routes from "./Routes"
import { Router, pathIntegration } from "@rturnq/solid-router"
import "./styles/index.css"
import "./styles/palette.css"

const App: Component<{ url?: string }> = ({ url }) => {
    return (
        <MetaProvider tags={[]}>
            <Link rel="stylesheet" href="index.css" />
            <Router
                integration={
                    isServer ? createSignal({ value: url! }) : pathIntegration()
                }
            >
                <Routes />
            </Router>
            <div id="root-modal" />
        </MetaProvider>
    )
}

export default App
