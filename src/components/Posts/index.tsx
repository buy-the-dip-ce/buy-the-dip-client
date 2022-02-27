import type { Component } from "solid-js"
import styles from "./post-style.module.css"
import { Link } from "@rturnq/solid-router"

const Home: Component = () => {
    return (
        <div class={styles.poststyle}>
            포스트 홈 입니다.
            <Link href="/">홈으로 이동</Link>
        </div>
    )
}

export default Home
