import express from "express"
import path from "path"

import { renderToString, generateHydrationScript } from "solid-js/web"
import App from "./src/App"

const app = express()
const port = 8080

app.use(express.static(path.join(__dirname, "/public")))

app.get("*", (req, res) => {
    let app

    const router = {
        url: req.url,
        pathname: req.path,
        query: req.query,
    }
    try {
        app = renderToString(() => <App router={router} />)
    } catch (err) {
        console.error(err)
    } finally {
        res.send(`
            <!doctype html>
            <html>
                <head>
                ${generateHydrationScript()}
                
                </head>
                <body>
                <script type="module" src="/index.js" async></script>

                <div id="root">${app}</div>
                </body>
            </html>
            `)
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
