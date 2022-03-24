import type { Component } from "solid-js"
import PortfolioPage from "../../components/portfolio/PortfolioPage"
import { Title } from "solid-meta"

const Home: Component = () => {
    return (
        <>
            <Title>Buy The Dip</Title>
            <PortfolioPage />
        </>
    )
}

export default Home
