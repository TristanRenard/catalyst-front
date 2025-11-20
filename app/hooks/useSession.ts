import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { publicAPI } from '~/utils/publicAPI'

interface UseSessionReturn {
  sessionToken: string | null
  user: any | null
  isLoading: boolean
}

export function useSession(): UseSessionReturn {
  const navigate = useNavigate()
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await publicAPI.get<{ user: any; sessionToken?: string }>("/@me")

        if (!response.data.user || !response.data.sessionToken) {
          navigate('/auth/login')
          return
        }

        setSessionToken(response.data.sessionToken)
        setUser(response.data.user)
        setIsLoading(false)
      } catch (error) {
        console.error('Erreur lors de la récupération de la session:', error)
        navigate('/auth/login')
      }
    }

    fetchSession()
  }, [navigate])

  return { sessionToken, user, isLoading }
}
