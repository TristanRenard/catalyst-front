import { publicAPI } from "~/utils/publicAPI"

export const fetchSessionToken = async () => {
  try {
    const response = await publicAPI.get<{ user: any; sessionToken?: string }>("/@me")
    if (response.data.sessionToken) {
      return await response.data.sessionToken
    }
  } catch (err) {
    console.error("Erreur lors de la récupération du session token:", err)
  }
}