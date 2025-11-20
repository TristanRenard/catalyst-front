import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useWebSocket } from "~/hooks/useWebsocket"
import { fetchSessionToken } from "~/utils/fetchSessionToken"

const Game = () => {
  const [ws, setWs] = useState<typeof useWebSocket | null>(null)
  const [sessionToken, setSessionToken] = useState<string>("")
  const navigate = useNavigate()

  useEffect(() => {
    const loadToken = async () => {
      const token = await fetchSessionToken()
      setSessionToken(token || "")
    }
    loadToken()
  }, [])


  return (
    <>
      {
        !true ? (
          <> test</>
        )
          : (
            <>test2</>
          )
      }
    </>
  )
}

export default Game