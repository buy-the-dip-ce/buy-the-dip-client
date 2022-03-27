import type { Component } from "solid-js"
import { Switch, createEffect, children } from "solid-js"
import { lazy } from "solid-js"
import PortfolioPage from "./components/portfolio/PortfolioPage/index"
import AsideWrapper from "./components/AsideWrapper/index"
import PortfolioMainPage from "./components/portfolio/PortfolioMainPage/index"

const Posts = lazy(() => import("./pages/posts/index"))
const PostDetail = lazy(() => import("./pages/posts/[id]/index"))

const Home = lazy(() => import("./pages/index"))
const NotFound = lazy(() => import("./pages/404"))

const AppRoutes: Component<{ pathname: string }> = ({ pathname }) => {
    const c = children(() => {
        if (pathname.startsWith("/portfolios/")) {
            return (
                <AsideWrapper>
                    <PortfolioPage pathname={pathname} />
                </AsideWrapper>
            )
        }
        if (pathname === "/portfolios") {
            return (
                <AsideWrapper>
                    <PortfolioMainPage />
                </AsideWrapper>
            )
        }
        return <div>404</div>
    })

    return c()
}

export default AppRoutes
