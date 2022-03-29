import React from "react";
import styled from "styled-components";
import PortfolioTableList from "./PortfolioTableList";

const Container = styled.div`
  .contentsTitle {
    font-size: var(--medium3);
    color: var(--black500);
    font-weight: bold;
  }

  .subInfo {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: flex-end;
  }

  .contentsSubTitle {
    font-size: var(--small6);
    color: var(--grey500);
    margin-top: var(--small2);
  }

  .date {
    color: var(--grey500);
    font-size: var(--small6);
    font-weight: bold;
  }
`;

const PortfolioMainPage: React.FC = () => {
  return (
    <Container>
      <h2 className={"contentsTitle"}>고점 대비 하락율</h2>
      <div className={"subInfo"}>
        <h3 className={"contentsSubTitle"}>ID:8D0DEWL37</h3>
        <p className={"date"}>기준날짜: 2020.03.07</p>
      </div>

      <PortfolioTableList />
    </Container>
  );
};

export default PortfolioMainPage;
