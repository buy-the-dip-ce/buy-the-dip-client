import styles from "./style.module.css"
import { Component, For, children } from "solid-js"
import { useStore } from "../../../store/index"
import AddStockButton from "../AddStockButton"
import { createPortfolioAPI } from "@api/portfolio"

const PortfolioTableList: Component = (_portpolio) => {
    console.log(_portpolio, "프롭스")
    children(() => {
        console.log(_portpolio)
    })
    // const onClickAddCategory = async () => {
    //     try {
    //         const portfolioBody: any = { ...portfolio }

    //         Object.keys(portfolio).forEach((category) => {
    //             if (portfolioBody[category]) {
    //                 return portfolioBody[category].map(
    //                     (_portfolio) => _portfolio.symbol
    //                 )
    //             }
    //             return []
    //         })
    //         const result = await createPortfolioAPI(portfolioBody)

    //         const locationChangeEvent = new CustomEvent("locationchange", {
    //             composed: true,
    //             detail: { href: `/portfolios/${result}` },
    //         })
    //         window.dispatchEvent(locationChangeEvent)
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
    // const _children = children(() => {
    //     console.log(portfolio, "칠드런")
    //     return (
            <div class={styles.portfolioList}>
                {JSON.stringify(portfolio)}
                {portfolio && (
                    <For each={Object.keys(portfolio)}>
                        {(category) => {
                            const portfolios = portfolio[category]
                            return (
                                <div class={styles.portfolioItem}>
                                    <div class={styles.portfolioHeader}>
                                        <h4 class={styles.category}>
                                            {category}
                                        </h4>

                                        <AddStockButton category={category} />
                                    </div>
                                    <div class={styles.portfolio}>
                                        <div
                                            class={styles.portfolioTableHeader}
                                        >
                                            <div>티커</div>
                                            <div>종목명</div>
                                            <div>시가총액($B)</div>
                                            <div>MDD</div>
                                            <div>YTD</div>
                                            <div>예상 P/E</div>
                                        </div>
                                        <div
                                            class={styles.portolioTableBorder}
                                        />
                                        <For each={portfolios}>
                                            {(stock) => (
                                                <div
                                                    class={
                                                        styles.portfolioTableItem
                                                    }
                                                >
                                                    <div>{stock.symbol}</div>
                                                    <div>{stock.name}</div>
                                                    <div>
                                                        {stock.market_cap}
                                                    </div>
                                                    <div>
                                                        <div
                                                            class={
                                                                styles.portfolioItemPlusGraphGradient
                                                            }
                                                            style={{
                                                                width: `${
                                                                    45 + 50
                                                                }px`,
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
                                                                width: `${
                                                                    45 + 20
                                                                }px`,
                                                            }}
                                                        />
                                                        -20.3%
                                                    </div>
                                                    <div>{stock.per}</div>
                                                </div>
                                            )}
                                        </For>
                                    </div>
                                </div>
                            )
                        }}
                    </For>
                )}

                <div class={styles.addCategory} onClick={onClickAddCategory}>
                    +카테고리 추가하기
                </div>
            </div>
    //     )
    // })
    return <div />
}

export default PortfolioTableList
