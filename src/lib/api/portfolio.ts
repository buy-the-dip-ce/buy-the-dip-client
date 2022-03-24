import { axios } from "./api"

export const getPortfolio = async (id: string) =>
    axios.get("portfolios/d9f5c706-4f47-45e9-81bd-928cc89d8d3b")
