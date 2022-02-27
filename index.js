import express from "express"
import path from "path"

import { renderToString, generateHydrationScript } from "solid-js/web"
import App from "./src/App"
import { MetaProvider, renderTags } from "solid-meta"

const app = express()
const port = 8080

app.use(express.static(path.join(__dirname, "/public")))

app.get("*", (req, res) => {
    let app
    const tags = [] // mutated during render so you can include in server-rendered template later
    try {
        app = renderToString(() => (
            <MetaProvider tags={tags}>
                <App url={req.url} />
            </MetaProvider>
        ))
    } catch (err) {
        console.error(err)
    } finally {
        res.send(`
            <!doctype html>
            <html>
                <head>
                ${renderTags(tags)}
                ${generateHydrationScript()}
                </head>
                <body>
                <div id="root">${app}</div>
                </body>
            </html>
            `)
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
