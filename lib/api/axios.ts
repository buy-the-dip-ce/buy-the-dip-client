import Axios from "axios"
console.log(process.env.NEXT_PUBLIC_API_URL)
export const axios = Axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL })
