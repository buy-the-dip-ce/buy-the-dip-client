import { QueryClient, QueryClientProvider, useQuery } from "react-query"
import AsideWrapper from "../components/AsideWrapper"
import "../styles/index.css"
import "../styles/palette.css"

const queryClient = new QueryClient()

const App = ({ Component, pageProps }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AsideWrapper>
                <Component {...pageProps} />
            </AsideWrapper>
            <div id="root-modal" />
        </QueryClientProvider>
    )
}

export default App
