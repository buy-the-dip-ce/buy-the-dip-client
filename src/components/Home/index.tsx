import type { Component } from "solid-js"
import { MetaProvider, Title, Link, Meta } from "solid-meta"

const Home: Component = () => {
    return (
        <>
            <Title>Title of page</Title>
            <Meta name="example" content="whatever" />
            <Link rel="stylesheet" href="./style.css" />
            <div>
                <div class={"sample"}>포스트 디테일 입니다.</div>
            </div>
        </>
    )
}

export default Home
