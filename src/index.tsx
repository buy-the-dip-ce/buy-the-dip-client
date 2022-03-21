/* @refresh reload */
import * as solid from "solid-js/web"
import App from "./App"

solid.hydrate(() => <App />, document.getElementById("root") as HTMLDivElement)
console.log("hydreated")
