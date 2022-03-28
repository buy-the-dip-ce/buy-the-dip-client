import React, { useState } from "react"
import styled from "styled-components"

const Container = styled.div`
    width: 640px;
    height: 400px;
    padding: var(--medium3) var(--medium1);
    background-color: white;
    z-index: 100;
    border-radius: var(--small3);
    overflow: hidden;

    .searchStockTitle {
        font-size: var(--medium1);
        font-weight: bold;
        margin-bottom: var(--small4);
    }

    .searchStockKeywordInput {
        width: 100%;
        height: var(--large2);
        font-size: var(--medium1);
        font-weight: normal;
        border-radius: var(--small3);
        padding: var(--small5) var(--small6);
        border: 1px solid var(--grey500);
        margin-bottom: var(--small4);
    }

    .searchStockKeywordInput::placeholder {
        font-size: var(--medium1);
        font-weight: normal;
        color: var(--grey700);
    }

    .searchStockResult {
        width: 100%;
        max-height: 239px;
        border-radius: var(--small3);
        border: 1px solid var(--grey500);
        overflow: hidden;
    }

    .searchStockResultItem {
        width: 100%;
        padding: var(--small5) var(--small6);

        font-size: var(--medium1);
        color: var(--grey700);
        border-bottom: 1px solid var(--grey500);
        cursor: pointer;
    }

    .searchStockResultItem:last-child {
        border-bottom: none;
    }

    .searchStockResultItem:hover {
        background-color: var(--grey300);
    }
`

const SearchStockModal: React.FC<{ category: string }> = ({ category }) => {
    const [keyword, setKeyword] = useState("")

    const onChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword((e.target as HTMLInputElement).value)
    }

    const onClickStockItem = (stock: string) => {}

    return (
        <Container className={"searchStockWrapper"}>
            <p className={"searchStockTitle"}>주식명</p>
            <input
                className={"searchStockKeywordInput"}
                onChange={onChangeKeyword}
                value={keyword}
                placeholder="AAPL"
            />
            <ul className={"searchStockResult"}>
                <li
                    className={"searchStockResultItem"}
                    onClick={() => {
                        onClickStockItem("AAPL")
                    }}
                >
                    AAPL ( NASDAQ : Apple Inc )
                </li>
                <li className={"searchStockResultItem"}>
                    AAPL ( NASDAQ : Apple Inc )
                </li>
                <li className={"searchStockResultItem"}>
                    AAPL ( NASDAQ : Apple Inc )
                </li>
                <li className={"searchStockResultItem"}>
                    AAPL ( NASDAQ : Apple Inc )
                </li>
            </ul>
        </Container>
    )
}

export default SearchStockModal
