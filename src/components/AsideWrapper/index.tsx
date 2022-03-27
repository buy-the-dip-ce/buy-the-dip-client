import type { Component } from "solid-js"
import styles from "./style.module.css"
import Link from "../common/Link"

const AsideWrapper: Component = ({ children }) => {
    return (
        <div class="root">
            <div class={styles.contentsWrapper}>
                <aside class={styles.contentsAside}>
                    <h1 class={styles.logoTitle}>Buy The Dip</h1>
                    <nav class={styles.navigation}>
                        <Link href="/posts">포트폴리오</Link>
                        <Link href="/posts">포트폴리오 생성기</Link>
                        <Link href="/posts">배당 캘린더</Link>
                    </nav>
                </aside>
                <div class={styles.contents}>{children}</div>
            </div>
        </div>
    )
}

export default AsideWrapper
