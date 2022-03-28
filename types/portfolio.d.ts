export type PortfolioStore = {
    [key: string]: PortfolioStock[]
}

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
