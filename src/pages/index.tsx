import type { Component } from "solid-js"
import HomeComponent from "../components/Home"
import { Title } from "solid-meta"

const Home: Component = () => {
    return (
        <>
            <Title>Buy The Dip</Title>
            <HomeComponent />
        </>
    )
}

export default Home
