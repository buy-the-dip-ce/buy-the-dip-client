export type PortfolioStock = {
    country: string //"United States"
    exchange: string //"NYSE"
    high_52: string //"215.49"
    industry: string //"Other Consumer Servi"
    market_cap: string //"0.87"
    name: string //"Airbnb Inc. Class A Common Stock"
    per: string //"0.00"
    sector: string //"Transportation"
    symbol: string //"ABNB"
    updated_at: string //"2022-03-12T04:46:42.126Z"
}

export const getPortfolioAPI = async (
    id: string
): Promise<{ [key: string]: PortfolioStock[] }> => {
    const data = await fetch(`http://localhost:4000/portfolios/${id}`)
    return await data.json()
}

type CreatePortfolioBody = { [key: string]: string[] }

export const createPortfolioAPI = async (body: CreatePortfolioBody) => {
    const data = await fetch("http://localhost:4000/portfolios", {
        method: "POST",

        body: JSON.stringify(body),
    })
    return await data.text()
}

type AddStockBody = { portfolioId: string; category: string; symbol: string }

export const addStockAPI = async (body: AddStockBody) => {
    await fetch("http://localhost:4000/portfolios", {
        method: "POST",

        body: JSON.stringify(body),
    })
}
