import type { Component } from "solid-js"
import HomeComponent from "../components/Home"
import { MetaProvider, Title, Link, Meta } from "solid-meta"

const Home: Component = () => {
    return (
        <>
            <Title>Title of page</Title>
            <Meta name="example" content="whatever" />
            <Link rel="stylesheet" href="./style.css" />
            <HomeComponent />
        </>
    )
}

export default Home
