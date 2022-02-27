/* @refresh reload */
import { hydrate } from "solid-js/web"
import "./index.css"
import App from "./App"

hydrate((props) => {
    console.log(props, "하이드레이트")
    return <App />
}, document.getElementById("root") as HTMLElement)
