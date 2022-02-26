import type { Component } from "solid-js"
import { lazy } from "solid-js"
import { Routes, Route } from "solid-app-router"

const Home = lazy(() => import("./pages/index"))
const NotFound = lazy(() => import("./pages/404"))

const AppRoutes: Component = () => {
    return (
        <Routes>
            {/* <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<User />}>
                <Route path="/" element={<UserHome />} />
                <Route path="/settings" element={<UserSettings />} />
                <Route path="/*all" element={<UserNotFound />} />
            </Route> */}
            <Route path="/" element={<Home />} />
            <Route path="/*all" element={<NotFound />} />
        </Routes>
    )
}

export default AppRoutes
