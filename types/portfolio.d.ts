export type PortfolioStore = {
  [key: string]: PortfolioStock[];
};

export type PortfolioStock = {
  market_cap: string; //"18.84"
  mdd: string; //"5.97"
  name: string; //"Alphabet Inc. Class A Common Stock"
  per: string; //"25.40"
  symbol: string; //"GOOGL"
  ytd: string; // "-1.62"
};
