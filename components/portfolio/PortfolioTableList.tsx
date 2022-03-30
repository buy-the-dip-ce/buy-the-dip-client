import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import AddStockButton from "./AddStockButton";
import { useQuery, useMutation } from "react-query";
import { useRouter } from "next/router";
import { getPortfolio, createPortfolioAPI, updatePortfolioAPI, createCategoryAPI } from "../../lib/api/portfolio";
import portfolioState from "../../store/index";
import PortfolioCategoryTitle from "./PortfolioCategoryTitle";
import isEmpty from "lodash/isEmpty";

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

  .portfolio {
    display: block;
    border-radius: var(--small3);
    overflow: hidden;
  }

  .portfolioTableHeader {
    display: grid;
    min-height: 53px;
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
    min-height: 53px;
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
    &: last-child ::after{
      content: none;
    }
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

  .portfolioTableDivider {
    width: 100%;
    height: 1px;
    background-color: var(--grey600);
  }

  .portfolioTableItem :last-child::after {
    content: none;
  }

  .portfolioItemPlusGraphGradient {
    position: absolute !important;
    height: 37px;
    left: -45px;
    background: linear-gradient(90deg, rgba(244, 248, 250, 0) 0%, rgba(255, 0, 0, 0.5) 100%);
    border-radius: 3px;
  }

  .portfolioItemMinusGraphGradient {
    position: absolute !important;
    height: 37px;
    left: -45px;
    background: linear-gradient(90deg, rgba(244, 248, 250, 0) 0%, rgba(0, 51, 195, 0.5) 100%);
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
`;

const PortfolioTableList: React.FC = () => {
  const [portfolio, setPortfolio] = useRecoilState(portfolioState.portfolio);
  const [isOwnPortfolio, setIswOwnPortfolio] = useRecoilState(portfolioState.isOwnPortfolio);

  const [loading, setLoading] = useState(false);

  const { push, query } = useRouter();

  useEffect(() => {
    if (!query["id"] && !isEmpty(portfolio)) {
      setPortfolio({});
      setIswOwnPortfolio(false);
    }
    if (query["id"]) {
      if (isEmpty(portfolio)) {
        refetch();
      }
      localStorage.setItem("portfolio", JSON.stringify(portfolio));
    }
  }, [portfolio, query]);

  const { data, refetch } = useQuery(["get-portfolio", query["id"]], () => getPortfolio(query["id"] as string), {
    enabled: !!query["id"],
    onSuccess: ({ data }) => {
      if (isEmpty(data)) {
        return;
      }
      setPortfolio(data);
      const localData = localStorage.getItem("portfolio");
      if (JSON.stringify(data) === localData) {
        setIswOwnPortfolio(true);
      }
    },
    keepPreviousData: true,
  });

  const { mutate } = useMutation(() => createPortfolioAPI(portfolio));
  const onClickAddPortfolio = async () => {
    let index = 1;
    let categoryName = "새카테고리";
    while (1) {
      if (index === 0 && !portfolio["새카테고리"]) {
        break;
      } else if (!portfolio[`새카테고리${index}`]) {
        categoryName = `새카테고리${index}`;
        break;
      }
      index += 1;
    }
    try {
      setLoading(true);
      if (isOwnPortfolio) {
        await createCategoryAPI(query["id"] as string, categoryName);
        refetch();
      } else {
        const newPortfolioBody = {};
        Object.keys(portfolio).forEach((_category) => {
          newPortfolioBody[_category] = portfolio[_category].map((stocks) => stocks.symbol);
        });
        newPortfolioBody[categoryName] = [];
        const { data } = await createPortfolioAPI(newPortfolioBody);
        push(`/portfolios/${data}`);
        setIswOwnPortfolio(true);
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);

    setPortfolio({ ...portfolio, [categoryName]: [] });
  };

  return (
    <Container>
      {portfolio &&
        Object.keys(portfolio).map((category, index) => {
          const portfolios = portfolio[category];
          return (
            <div className={"portfolioItem"} key={index}>
              <div className={"portfolioHeader"}>
                <PortfolioCategoryTitle category={category} />
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
                  <>
                    <div className={"portfolioTableItem"} key={stock.symbol}>
                      <div>{stock.symbol}</div>
                      <div>{stock.name}</div>
                      <div>{stock.market_cap}</div>
                      <div>
                        <div
                          className={"portfolioItemMinusGraphGradient"}
                          style={{
                            width: `${45 + Number(stock.mdd)}px`,
                          }}
                        />
                        -{stock.mdd}%
                      </div>
                      <div>
                        <div
                          className={
                            Number(stock.ytd) > 0 ? "portfolioItemPlusGraphGradient" : "portfolioItemMinusGraphGradient"
                          }
                          style={{
                            width: `${45 + Math.abs(Number(stock.ytd))}px`,
                          }}
                        />
                        {`${stock.ytd}%`}
                      </div>
                      <div>{stock.per}</div>
                    </div>
                    <div className={"portfolioTableDivider"} />
                  </>
                ))}
              </div>
            </div>
          );
        })}

      <div className={"addCategory"} onClick={onClickAddPortfolio}>
        {loading ? "카테고리 추가중..." : "+카테고리 추가하기"}
      </div>
    </Container>
  );
};

export default PortfolioTableList;
