import type { Component } from "solid-js/"
import { Link } from "solid-meta"
import { createSignal } from "solid-js"
import { isServer } from "solid-js/web"
import Routes from "./Routes"
import { Router, pathIntegration } from "@rturnq/solid-router"
import "./styles/index.css"

const App: Component<{ url?: string }> = ({ url }) => {
    return (
        <>
            <Link rel="stylesheet" href="index.css" />
            <Router
                integration={
                    isServer ? createSignal({ value: url! }) : pathIntegration()
                }
            >
                <Routes />
            </Router>
        </>
    )
}

export default App
