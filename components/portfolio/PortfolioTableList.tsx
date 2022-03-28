import React, { useMemo } from "react"
import styled from "styled-components"
import AddStockButton from "./AddStockButton"
import { useQuery } from "react-query"
import { useRouter } from "next/router"
import { getPortfolio } from "../../lib/api/portfolio"

const Container = styled.div`
    display: block;
    margin-top: var(--medium3);

    .portfolioItem {
        display: block;
        margin-bottom: var(--medium6);
    }
    .portfolioItem:last-child {
        margin-bottom: var(--medium3);
    }

    .portfolioHeader {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: var(--small5);
    }

    .category {
        font-size: var(--medium2);
        color: var(--black500);
        font-weight: bold;
    }

    .portfolio {
        display: block;
        border-radius: var(--small3);
        overflow: hidden;
    }

    .portfolioTableHeader {
        display: grid;
        height: 53px;
        grid-template-columns: 60px 300px 120px 120px 120px auto;
        background-color: var(--grey400);
    }

    .portfolioTableHeader div {
        position: relative;
        font-size: var(--medium1);
        font-weight: bold;

        display: flex;
        justify-content: center;
        align-items: center;
    }
    .portfolioTableHeader div::after {
        position: absolute;
        right: 0;
        content: "";
        width: 1px;
        height: var(--medium6);
        border-radius: var(--small3);
        background-color: var(--grey500);
    }

    .portfolioTableHeader :last-child::after {
        content: none;
    }

    .portolioTableBorder {
        width: 100%;
        height: 1px;
        background-color: var(--grey600);
    }

    .portfolioTableItem {
        display: grid;
        height: 53px;
        grid-template-columns: 60px 300px 120px 120px 120px auto;
        background-color: var(--grey450);
    }

    .portfolioTableItem div {
        position: relative;
        font-size: var(--medium1);
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    .portfolioTableItem div::after {
        position: absolute;
        right: 0;
        content: "";
        width: 1px;
        height: var(--medium6);
        border-radius: var(--small3);
        background-color: var(--grey500);
    }

    .portfolioTableItem :last-child::after {
        content: none;
    }

    .portfolioItemPlusGraphGradient {
        position: absolute !important;
        height: 37px;
        left: -45px;
        background: linear-gradient(
            90deg,
            rgba(244, 248, 250, 0) 0%,
            rgba(255, 0, 0, 0.5) 100%
        );
        border-radius: 3px;
    }

    .portfolioItemMinusGraphGradient {
        position: absolute !important;
        height: 37px;
        left: -45px;
        background: linear-gradient(
            90deg,
            rgba(0, 51, 195, 0.5) 0%,
            rgba(244, 248, 250, 0) 100%
        );
        border-radius: 3px;
    }

    .addCategory {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 55px;
        font-size: var(--medium1);
        font-weight: bold;
        color: var(--grey500);
        cursor: pointer;
        border-radius: 5px;
        background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23C4C4C4FF' stroke-width='4' stroke-dasharray='17' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
    }
`

const PortfolioTableList: React.FC<{ portfolio: any }> = () => {
    const { query } = useRouter()
    const { data } = useQuery(
        [query["id"]],
        () => getPortfolio(query["id"] as string),
        { enabled: !!query["id"] }
    )
    const portfolio = useMemo(() => {
        return data?.data
    }, [data])

    return (
        <Container>
            {portfolio &&
                Object.keys(portfolio).map((category) => {
                    const portfolios = portfolio[category]
                    return (
                        <div className={"portfolioItem"}>
                            <div className={"portfolioHeader"}>
                                <h4 className={"category"}>{category}</h4>
                                <AddStockButton category={category} />
                            </div>
                            <div className={"portfolio"}>
                                <div className={"portfolioTableHeader"}>
                                    <div>티커</div>
                                    <div>종목명</div>
                                    <div>시가총액($B)</div>
                                    <div>MDD</div>
                                    <div>YTD</div>
                                    <div>예상 P/E</div>
                                </div>
                                <div className={"portolioTableBorder"} />
                                {portfolios.map((stock) => (
                                    <div className={"portfolioTableItem"}>
                                        <div>{stock.symbol}</div>
                                        <div>{stock.name}</div>
                                        <div>{stock.market_cap}</div>
                                        <div>
                                            <div
                                                className={
                                                    "portfolioItemPlusGraphGradient"
                                                }
                                                style={{
                                                    width: `${45 + 50}px`,
                                                }}
                                            />
                                            -50.3%
                                        </div>
                                        <div>
                                            <div
                                                className={
                                                    "portfolioItemPlusGraphGradient"
                                                }
                                                style={{
                                                    width: `${45 + 20}px`,
                                                }}
                                            />
                                            -20.3%
                                        </div>
                                        <div>{stock.per}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}

            <div className={"addCategory"} onClick={() => {}}>
                +카테고리 추가하기
            </div>
        </Container>
    )
}

export default PortfolioTableList
