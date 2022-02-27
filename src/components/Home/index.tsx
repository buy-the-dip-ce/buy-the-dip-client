import type { Component } from "solid-js"
import { MetaProvider, Title, Meta } from "solid-meta"
import { Link } from "@rturnq/solid-router"
import styles from "./style.module.css"

const Home: Component = () => {
    return (
        <>
            <Title>Title of page</Title>
            <Meta name="example" content="whatever" />
            <div>
                <div class={styles.home}>홈 입니다.</div>
                <Link href="/posts">포스트로 이동</Link>
            </div>
        </>
    )
}

export default Home
