import type { Component } from "solid-js"
import { Switch } from "solid-js"
import { lazy } from "solid-js"
import { MatchRoute, Route } from "@rturnq/solid-router"

const Posts = lazy(() => import("./pages/posts/index"))
const PostDetail = lazy(() => import("./pages/posts/[id]/index"))

const Home = lazy(() => import("./pages/index"))
const NotFound = lazy(() => import("./pages/404"))

const AppRoutes: Component = () => {
    return (
        <Switch fallback={<div>404</div>}>
            <MatchRoute path="/posts/:id">
                {(route) => <PostDetail />}
            </MatchRoute>
            <MatchRoute path="/posts">
                <Posts />
            </MatchRoute>
            <MatchRoute path="/" end>
                <Home />
            </MatchRoute>
        </Switch>
    )
}

export default AppRoutes
