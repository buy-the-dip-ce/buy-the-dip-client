import { axios } from "./axios"
export const getPortfolio = async (id: string) => axios.get(`/portfolios/${id}`)
