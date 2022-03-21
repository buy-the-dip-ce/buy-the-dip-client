import type { Component } from "solid-js"
import { Title, Meta } from "solid-meta"
import { Link } from "@rturnq/solid-router"
import styles from "./style.module.css"
import { lazy } from "solid-js"
const AddStockButton = lazy(() => import("./AddStockButton"))

const Home: Component = () => {
    return (
        <>
            <Title>Title of page</Title>
            <Meta name="example" content="whatever" />
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
                        <div class={styles.porfolioList}>
                            <div class={styles.porfolioItem}>
                                <div class={styles.portfolioHeader}>
                                    <h4 class={styles.category}>여행관련</h4>

                                    <AddStockButton />
                                </div>
                                <div class={styles.portfolio}>
                                    <div class={styles.portfolioTableHeader}>
                                        <div>티커</div>
                                        <div>종목명</div>
                                        <div>시가총액($B)</div>
                                        <div>MDD</div>
                                        <div>YTD</div>
                                        <div>예상 P/E</div>
                                    </div>
                                    <div class={styles.portolioTableBorder} />
                                    <div class={styles.portfolioTableItem}>
                                        <div>ABNB</div>
                                        <div>Airbnb Inc</div>
                                        <div>20.3</div>
                                        <div>
                                            <div
                                                class={
                                                    styles.portfolioItemPlusGraphGradient
                                                }
                                                style={{
                                                    width: `${45 + 50}px`,
                                                }}
                                            />
                                            -50.3%
                                        </div>
                                        <div>
                                            <div
                                                class={
                                                    styles.portfolioItemPlusGraphGradient
                                                }
                                                style={{
                                                    width: `${45 + 20}px`,
                                                }}
                                            />
                                            -20.3%
                                        </div>
                                        <div>43.2</div>
                                    </div>
                                </div>
                            </div>
                            <div class={styles.addCategory}>
                                +카테고리 추가하기
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
