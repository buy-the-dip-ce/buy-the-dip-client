import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { useQuery, useQueryClient } from "react-query";
import { searchStockAPI, updatePortfolioAPI } from "../../lib/api/portfolio";

import { useRouter } from "next/router";

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
`;

const SearchStockModal: React.FC<{ category: string; setShowModal: any }> = ({ category, setShowModal }) => {
  const [keyword, setKeyword] = useState("");

  const { data } = useQuery(["get-stocks", keyword], () => searchStockAPI(keyword), {
    enabled: !!keyword,
  });

  const { query } = useRouter();
  const queryClient = useQueryClient();

  const portfolioId = useMemo(() => query["id"], [query]);

  const stocks = useMemo(() => {
    return (
      data?.data || [
        { symbol: "AAPL", name: "Apple industry" },
        { symbol: "GOOGL", name: "google inc." },
      ]
    );
  }, [data]);

  const onChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword((e.target as HTMLInputElement).value);
  };

  const onClickStockItem = async (symbol: string) => {
    try {
      await updatePortfolioAPI(portfolioId as string, category, symbol);
      queryClient.resetQueries(["get-portfolio", query["id"]]);
      setShowModal(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container className={"searchStockWrapper"}>
      <p className={"searchStockTitle"}>주식명</p>
      <input className={"searchStockKeywordInput"} onChange={onChangeKeyword} value={keyword} placeholder="AAPL" />
      <ul className={"searchStockResult"}>
        {stocks.map((stock) => (
          <li
            className={"searchStockResultItem"}
            onClick={() => {
              onClickStockItem(stock.symbol);
            }}>
            {stock.symbol} {stock.name}
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default SearchStockModal;
