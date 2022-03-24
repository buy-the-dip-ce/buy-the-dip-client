import type { Component } from "solid-js"
import { Link, MetaProvider } from "solid-meta"
import { createSignal } from "solid-js"
import { isServer } from "solid-js/web"
import Routes from "./Routes"
import { Router, pathIntegration } from "@rturnq/solid-router"
import "./styles/index.css"
import "./styles/palette.css"
import { StoreProvider } from "./store"

const App: Component<{
    router?: {
        url: string
        pathname: string
        router: { [key: string]: string }
    }
}> = ({ router }) => {
    return (
        <StoreProvider router={router}>
            <MetaProvider tags={[]}>
                <Router
                    integration={
                        isServer
                            ? createSignal({ value: router?.url! })
                            : pathIntegration()
                    }
                >
                    <Routes />
                </Router>
                <div id="root-modal" />
            </MetaProvider>
        </StoreProvider>
    )
}

export default App
