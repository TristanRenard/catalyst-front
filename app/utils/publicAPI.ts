import axios from "axios"

// Detect if we're running on the server or client
const isServer = typeof window === "undefined"

export const publicAPI = axios.create({
  baseURL: isServer ? "http://localhost:3000/api" : "/api",
  withCredentials: true,
})