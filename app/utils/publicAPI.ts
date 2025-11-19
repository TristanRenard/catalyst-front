import axios from "axios"

export const publicAPI = axios.create({
  baseURL: "/",
  withCredentials: true,
})