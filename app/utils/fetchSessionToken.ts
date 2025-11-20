import { publicAPI } from "~/utils/publicAPI"

export const fetchSessionToken = async () => {
  console.log("[fetchSessionToken] 🔍 Starting token fetch from /@me...")
  console.log("[fetchSessionToken] 🌐 publicAPI baseURL:", publicAPI.defaults.baseURL)
  console.log("[fetchSessionToken] 🌐 Full URL will be:", `${publicAPI.defaults.baseURL}/@me`)

  try {
    console.log("[fetchSessionToken] ⏳ Sending GET request...")
    const response = await publicAPI.get<{ user: any; sessionToken?: string }>("/@me").catch((err) => {
      console.error("[fetchSessionToken] 🔴 Axios promise rejection:", err)
      throw err
    })
    console.log("[fetchSessionToken] 📡 Response received!")
    console.log("[fetchSessionToken] 📊 Response details:", {
      status: response.status,
      statusText: response.statusText,
      hasData: !!response.data,
      dataKeys: response.data ? Object.keys(response.data) : [],
      hasSessionToken: !!response.data?.sessionToken,
      tokenPreview: response.data?.sessionToken
        ? `${response.data.sessionToken.substring(0, 15)}... (length: ${response.data.sessionToken.length})`
        : "NONE",
      userData: response.data?.user ? "User data present" : "No user data"
    })

    if (response.data?.sessionToken) {
      console.log("[fetchSessionToken] ✅ Returning session token")
      return response.data.sessionToken
    } else {
      console.warn("[fetchSessionToken] ⚠️  No sessionToken in response!")
      console.log("[fetchSessionToken] 📋 Full response.data:", response.data)
    }
  } catch (err: any) {
    console.error("[fetchSessionToken] 🔴 ERROR fetching session token:", err)
    console.error("[fetchSessionToken] 🔴 Error type:", typeof err)

    if (err.response) {
      // La requête a été faite et le serveur a répondu avec un code d'erreur
      console.error("[fetchSessionToken] 🔴 Response error:", {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data,
        headers: err.response.headers
      })
    } else if (err.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error("[fetchSessionToken] 🔴 No response received. Request:", err.request)
      console.error("[fetchSessionToken] 🔴 Network error or timeout")
    } else {
      // Quelque chose s'est passé lors de la configuration de la requête
      console.error("[fetchSessionToken] 🔴 Request setup error:", err.message)
    }

    if (err instanceof Error) {
      console.error("[fetchSessionToken] 🔴 Error details:", {
        message: err.message,
        name: err.name,
        stack: err.stack
      })
    }
  }

  console.log("[fetchSessionToken] ❌ Returning undefined")
  return undefined
}