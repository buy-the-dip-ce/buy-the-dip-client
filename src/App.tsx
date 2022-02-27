import type { Component } from "solid-js/"
import { createSignal } from "solid-js"
import { isServer } from "solid-js/web"
import Routes from "./Routes"
import { Router, pathIntegration } from "@rturnq/solid-router"

const App: Component<{ url: string }> = ({ url }) => {
    return (
        <Router
            integration={
                isServer ? createSignal({ value: url }) : pathIntegration()
            }
        >
            <Routes />
        </Router>
    )
}

export default App
