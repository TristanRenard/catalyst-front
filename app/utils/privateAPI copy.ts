import axios from "axios"

export const privateAPI = axios.create({
  baseURL: "/api/admin",
  withCredentials: true,
})