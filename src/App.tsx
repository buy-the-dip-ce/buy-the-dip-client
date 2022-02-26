import type { Component } from "solid-js"

import logo from "./logo.svg"
import styles from "./App.module.css"
import Routes from "./Routes"

const App: Component = () => {
    return (
        <div class={styles.App}>
            <Routes />
        </div>
    )
}

export default App
