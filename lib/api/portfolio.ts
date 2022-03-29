import { axios } from "./axios";
import { PortfolioStore } from "../../types/portfolio";

export const getPortfolio = async (id: string) => axios.get<PortfolioStore>(`/portfolios/${id}`);

export const searchStockAPI = async (keyword: string) =>
  axios.get<{ symbol: string; name: string }[]>(`/tickers/search?keyword=${keyword}`);

export const createPortfolioAPI = async (body: PortfolioStore) => {
  return axios.post("/portfolios", body);
};

export const createCategoryAPI = async (portfolioId: string, category: string) =>
  axios.post(`/portfolios/${portfolioId}/categories`, { category });

export const updatePortfolioAPI = async (portfolioId: string, category: string, symbol: string) =>
  axios.post(`/portfolios/${portfolioId}/categories/${category}`, { symbol });

export const editCategoryNameAPI = async (
  portfolioId: string,
  category: string,
  body: { prevName: string; name: string }
) => axios.patch(`/portfolios/${portfolioId}/categories/${category}`, body);
