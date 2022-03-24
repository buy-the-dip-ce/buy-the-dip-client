import styles from "./style.module.css"
import { createSignal } from "solid-js"

const SearchStockModal = () => {
    const [keyword, setKeyword] = createSignal("")

    const onChangeKeyword = (e: Event) => {
        setKeyword((e.target as HTMLInputElement).value)
    }

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
                <li class={styles.searchStockResultItem}>
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
