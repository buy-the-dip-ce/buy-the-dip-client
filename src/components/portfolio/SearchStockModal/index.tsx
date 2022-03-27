import styles from "./style.module.css"
import { createSignal, Component } from "solid-js"
import { useStore } from "../../../store/index"

const SearchStockModal: Component<{ category: string }> = ({ category }) => {
    const [keyword, setKeyword] = createSignal("")

    const [{ isOwnPortfolio }, { setPortfolio }] = useStore()

    const onChangeKeyword = (e: Event) => {
        setKeyword((e.target as HTMLInputElement).value)
    }

    const onClickStockItem = (stock: string) => {}

    return (
        <div class={styles.searchStockWrapper}>
            <p class={styles.searchStockTitle}>주식명</p>
            <input
                class={styles.searchStockKeywordInput}
                onChange={onChangeKeyword}
                value={keyword()}
                placeholder="AAPL"
            />
            <ul class={styles.searchStockResult}>
                <li
                    class={styles.searchStockResultItem}
                    onClick={() => {
                        onClickStockItem("AAPL")
                    }}
                >
                    AAPL ( NASDAQ : Apple Inc )
                </li>
                <li class={styles.searchStockResultItem}>
                    AAPL ( NASDAQ : Apple Inc )
                </li>
                <li class={styles.searchStockResultItem}>
                    AAPL ( NASDAQ : Apple Inc )
                </li>
                <li class={styles.searchStockResultItem}>
                    AAPL ( NASDAQ : Apple Inc )
                </li>
            </ul>
        </div>
    )
}

export default SearchStockModal
