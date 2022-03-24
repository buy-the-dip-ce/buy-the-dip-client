import styles from "./style.module.css"
import { Component, createResource, onMount, For } from "solid-js"
import { useStore } from "../../../store/index"
import AddStockButton from "../AddStockButton"
import { getPortfolio } from "../../../lib/api/portfolio"
import { isServer } from "solid-js/web"
interface ModalProps {
    onClickOutside?: () => void
}
const fetchUser = async (id) => {
    const data = await fetch(
        `http://localhost:4000/portfolios/d9f5c706-4f47-45e9-81bd-928cc89d8d3b`
    )
    return await data.json()
}

const PortfolioTableList: Component<ModalProps> = ({
    onClickOutside,
    children,
}) => {
    // const [{ portfolio, router }, { setPortfolio }] = useStore()
    const [portfolio] = createResource("asd", fetchUser)

    return (
        <div class={styles.portfolioList}>
            {!portfolio.loading && (
                <For each={Object.keys(portfolio())}>
                    {(category, i) => {
                        const portfolios = portfolio()[category]
                        console.log(category)
                        return (
                            <div class={styles.portfolioItem}>
                                <div class={styles.portfolioHeader}>
                                    <h4 class={styles.category}>{category}</h4>

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
                                    <For each={portfolios}>
                                        {(stock) => (
                                            <div
                                                class={
                                                    styles.portfolioTableItem
                                                }
                                            >
                                                <div>{stock.symbol}</div>
                                                <div>{stock.name}</div>
                                                <div>{stock.market_cap}</div>
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

            <div class={styles.addCategory}>+카테고리 추가하기</div>
        </div>
    )
}

export default PortfolioTableList
