import type { Component } from "solid-js"
import { Link } from "@rturnq/solid-router"
import styles from "./style.module.css"
import { lazy } from "solid-js"

const PortfolioTableList = lazy(
    () => import("../../portfolio/PortfolioTableList")
)

const PortfolioPage: Component = () => {
    return (
        <>
            <div class="root">
                <div class={styles.contentsWrapper}>
                    <aside class={styles.contentsAside}>
                        <h1 class={styles.logoTitle}>Buy The Dip</h1>
                        <nav class={styles.navigation}>
                            <Link href="/posts">고점대비 하락율</Link>
                            <Link href="/posts">포트폴리오 생성기</Link>
                            <Link href="/posts">배당 캘린더</Link>
                        </nav>
                    </aside>
                    <div class={styles.contents}>
                        <h2 class={styles.contentsTitle}>고점 대비 하락율</h2>
                        <div class={styles.subInfo}>
                            <h3 class={styles.contentsSubTitle}>
                                ID:8D0DEWL37
                            </h3>
                            <p class={styles.date}>기준날짜: 2020.03.07</p>
                        </div>
                        <PortfolioTableList />
                    </div>
                </div>
            </div>
        </>
    )
}

export default PortfolioPage
