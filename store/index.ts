import { PortfolioStore } from "./../types/portfolio.d"
import { atom } from "recoil"

//* 로그박스 display 여부
const portfolio = atom<{ portfolio: PortfolioStore | null }>({
    key: "global-portfolio",
    default: null,
})

const portfolioState = {
    portfolio,
}

export default portfolioState
