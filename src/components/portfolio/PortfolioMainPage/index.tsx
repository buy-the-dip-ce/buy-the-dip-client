import type { Component } from "solid-js"
import styles from "./style.module.css"

import PortfolioTableList from "../../portfolio/PortfolioTableList"
import { useStore } from "../../../store/index"

const PortfolioMainPage: Component = () => {
    const [state, setState] = useStore()

    return (
        <>
            <h2 class={styles.contentsTitle}>고점 대비 하락율</h2>
            <div class={styles.subInfo}>
                <h3 class={styles.contentsSubTitle}>ID:8D0DEWL37</h3>
                <p class={styles.date}>기준날짜: 2020.03.07</p>
            </div>

            <PortfolioTableList />
        </>
    )
}

export default PortfolioMainPage
