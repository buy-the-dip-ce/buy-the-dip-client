import type { Component } from "solid-js"
import { MetaProvider } from "solid-meta"
import { createSignal, batch, createEffect } from "solid-js"
import { isServer } from "solid-js/web"
import Routes from "./Routes"
import "./styles/index.css"
import "./styles/palette.css"
import { StoreProvider } from "./store"

const CLIENT_URL = "http://localhost:8080"

const App: Component<{
    router?: {
        url: string
        pathname: string
        query: {}
    }
}> = ({ router }) => {
    const [pathname, setPathname] = createSignal<string>(
        isServer ? router!.url : window.location.pathname
    )
    const [history, setHistory] = createSignal<string[]>([])

    const _handleLocationChange = (
        event: CustomEvent<{
            href: string
            as?: string
        }>
    ) => {
        const { href } = event.detail
        if (!href) {
            return
        }

        //* 외부 라우팅
        if (href.startsWith("http") && !href.startsWith(CLIENT_URL)) {
            window.location.href = href
            return
        }

        //* 내부 라우팅
        //* 마지막 pathname이 href 라면
        if (history()[history.length - 1] === href) {
            return
        }
        batch(() => {
            setHistory((_history) => [..._history, href])
            setPathname(window.location.pathname)
        })
        setPathname((s) => window.location.pathname)
        window.history.pushState({}, "", href)

        return
    }

    //? 뒤로가기 또는 앞으로 가기 시
    const _handlePopState = () => {
        const _pathname = window.location.pathname

        //? 뒤로 가기시 -2가 undefined여도 뒤로가기임
        const nextPath = history()[history.length]

        //? 앞으로 가기시
        const index = history().findIndex((_history) => _history === _pathname)
        if (!index) {
            setHistory((_history) => [..._history, _pathname])
        }
        //? 현재 pathname 다음이 pathname이 아니면 뒤를 자르고 pathname 추가
        if (index && nextPath !== _pathname) {
            setHistory((_history) => [...history().splice(0, index), _pathname])
        }

        setPathname(pathname)
    }

    if (!isServer) {
        window.addEventListener("locationchange", _handleLocationChange as any)
        window.addEventListener("popstate", _handlePopState)
    }

    return (
        <StoreProvider router={router}>
            <MetaProvider tags={[]}>
                <Routes pathname={pathname()} />
                <div id="root-modal" />
            </MetaProvider>
        </StoreProvider>
    )
}

export default App
