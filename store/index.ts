import { PortfolioStore } from "./../types/portfolio.d";
import { atom } from "recoil";

const isOwnPortfolio = atom<boolean>({
  key: "global-is-own-portfolio",
  default: false,
});

const portfolio = atom<PortfolioStore | null>({
  key: "global-portfolio",
  default: {},
});

const portfolioState = {
  portfolio,
  isOwnPortfolio,
};

export default portfolioState;
