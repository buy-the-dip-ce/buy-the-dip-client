import type { Component } from "solid-js"
import {
    createResource,
    children,
    createSignal,
    createEffect,
    lazy,
} from "solid-js"
import styles from "./style.module.css"
const PortfolioTableList = lazy(
    () => import("../../portfolio/PortfolioTableList")
)

import { useStore } from "../../../store/index"
import { getPortfolioAPI, PortfolioStock } from "@api/portfolio"

const PortfolioPage: Component<{ pathname: string }> = ({ pathname }) => {
    const [portfolio, setPortfolio] = createSignal<{
        [key: string]: PortfolioStock[]
    }>({})

    const [result] = createResource(
        pathname.replace("/portfolios/", ""),
        getPortfolioAPI
    )

    createEffect(() => {
        if (result()) {
            setPortfolio(result()!)
        }
    })

    return (
        <>
            <h2 class={styles.contentsTitle}>고점 대비 하락율</h2>
            <div class={styles.subInfo}>
                <h3 class={styles.contentsSubTitle}>ID:8D0DEWL37</h3>
                <p class={styles.date}>기준날짜: 2020.03.07</p>
            </div>
            <PortfolioTableList portfolio={portfolio()} />
        </>
    )
}

export default PortfolioPage
