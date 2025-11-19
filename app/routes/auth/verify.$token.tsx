import { redirect, type LoaderFunctionArgs } from "@remix-run/node"
import { AxiosError } from "axios"
import { publicAPI } from "~/utils/publicAPI"

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const token = params.token
  console.log("Verifying token:", token)

  if (!token) {
    return redirect("/?error=missing-token")
  }

  console.log("Sending verification request for token:", token)

  try {
    const response = await publicAPI.post(
      `/verify`,
      { verificationToken: token }
    )

    const message = response?.data?.message || "Token verified successfully. You can now log in."

    const setCookieHeader = response.headers["set-cookie"]
    const headers: HeadersInit = {}

    if (setCookieHeader) {
      if (Array.isArray(setCookieHeader)) {
        const headersObj = new Headers()
        setCookieHeader.forEach(cookie => {
          headersObj.append("Set-Cookie", cookie)
        })
        return redirect(`/?success=${encodeURIComponent(message)}`, {
          headers: headersObj
        })
      } else {
        headers["Set-Cookie"] = setCookieHeader
      }
    }

    return redirect(`/?success=${encodeURIComponent(message)}`, {
      headers: Object.keys(headers).length > 0 ? headers : undefined
    })

  } catch (error) {
    console.error("Error during token verification:", error)

    let errorMessage = "An error occurred"

    if (error instanceof AxiosError) {
      errorMessage = error?.response?.data?.message || error?.message || errorMessage
    } else if (error instanceof Error) {
      errorMessage = error.message
    }

    const description = `${errorMessage}. Please try again later if the issue persists contact support.`

    return redirect(`/?error=${encodeURIComponent(description)}`)
  }
}

const VerifyTokenPage = () => {
  return null
}

export default VerifyTokenPage