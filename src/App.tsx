import type { Component } from "solid-js"

import Routes from "./Routes"
import { Router } from "solid-app-router"

const App: Component = () => {
    return (
        <Router>
            <Routes />
        </Router>
    )
}

export default App
