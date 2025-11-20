import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import GameActions from '~/components/GameActions'
import GameBoard from '~/components/GameBoard'
import GameStatus from '~/components/GameStatus'
import { useSession } from '~/hooks/useSession'
import { useWebSocket } from '~/hooks/useWebsocket'
import type {
  GameAction,
  GameState,
  MatchEndPayload,
  MatchStartPayload,
} from '~/types/socket'
import {
  determineWinner,
  isPlayerTurn,
  validateGameAction
} from '~/utils/gameLogic'

const GamePage = () => {
  const navigate = useNavigate()
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [myUserId, setMyUserId] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isMyTurn, setIsMyTurn] = useState(false)

  const { sessionToken, isLoading: isLoadingSession } = useSession()

  const { isConnected, sendGameAction, surrender, connectionState } = useWebSocket({
    url: import.meta.env.VITE_WS_URL || 'ws://localhost:5173/ws',
    token: sessionToken || '',
    autoConnect: !!sessionToken,
    handlers: {
      onMatchStart: (payload: MatchStartPayload) => {
        console.log('Match démarré:', payload)
        setGameState(payload.gameState)
        setMyUserId(payload.gameState.player1.userId)
      },
      onOpponentAction: (payload: unknown) => {
        console.log('Action de l\'adversaire:', payload)
        if (payload && typeof payload === 'object' && 'gameState' in payload) {
          setGameState((payload as { gameState: GameState }).gameState)
        }
      },
      onMatchEnd: (payload: MatchEndPayload) => {
        console.log('Match terminé:', payload)
        setTimeout(() => {
          navigate('/lobby')
        }, 5000)
      },
      onError: (payload) => {
        console.error('Erreur WebSocket:', payload)
        setError(payload.message)
      },
      onDisconnected: () => {
        console.log('Déconnecté')
        navigate('/lobby')
      },
    },
  })

  useEffect(() => {
    if (gameState && myUserId) {
      setIsMyTurn(isPlayerTurn(gameState, myUserId))
    }
  }, [gameState, myUserId])

  const handleAction = (action: GameAction) => {
    if (!gameState) return

    const validation = validateGameAction(gameState, myUserId, action)
    if (!validation.valid) {
      setError(validation.error || 'Action invalide')
      setTimeout(() => setError(null), 3000)
      return
    }

    sendGameAction(action)
    setError(null)
  }

  const handleSurrender = () => {
    if (window.confirm('Êtes-vous sûr de vouloir abandonner ?')) {
      surrender()
    }
  }

  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-2xl">
          <div className="text-white text-center">
            <div className="text-xl mb-4">Chargement...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-2xl">
          <div className="text-white text-center">
            <div className="text-xl mb-4">Connexion au serveur...</div>
            <div className="text-sm opacity-75">{connectionState}</div>
          </div>
        </div>
      </div>
    )
  }

  if (!gameState) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-2xl">
          <div className="text-white text-center">
            <div className="text-xl mb-4">En attente de la partie...</div>
          </div>
        </div>
      </div>
    )
  }

  const amIPlayer1 = gameState.player1.userId === myUserId

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <div className="text-white">
            <h1 className="text-3xl font-bold">Catalyst</h1>
            <p className="text-sm opacity-75">
              Tour {gameState.currentTurn} / {gameState.maxTurns}
            </p>
          </div>
          <button
            onClick={handleSurrender}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Abandonner
          </button>
        </div>

        <GameStatus
          gameState={gameState}
          myUserId={myUserId}
          isMyTurn={isMyTurn}
          error={error}
        />

        <GameBoard
          gameState={gameState}
          myUserId={myUserId}
        />

        {isMyTurn && gameState.phase !== 'game_over' && (
          <GameActions
            gameState={gameState}
            myUserId={myUserId}
            onAction={handleAction}
          />
        )}

        {gameState.phase === 'game_over' && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full">
              <h2 className="text-3xl font-bold mb-4 text-center">Partie terminée !</h2>
              {(() => {
                const result = determineWinner(gameState)
                const didIWin =
                  (result.winner === 'player1' && amIPlayer1) ||
                  (result.winner === 'player2' && !amIPlayer1)

                return (
                  <div className="text-center">
                    {result.winner === 'draw' ? (
                      <div className="text-xl mb-4">Match nul !</div>
                    ) : didIWin ? (
                      <div className="text-green-600 text-2xl font-bold mb-4">Vous avez gagné ! 🎉</div>
                    ) : (
                      <div className="text-red-600 text-2xl font-bold mb-4">Vous avez perdu 😢</div>
                    )}
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span>Vous:</span>
                        <span className="font-bold">
                          {amIPlayer1 ? result.player1Score : result.player2Score} points
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Adversaire:</span>
                        <span className="font-bold">
                          {amIPlayer1 ? result.player2Score : result.player1Score} points
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Redirection vers le lobby dans 5 secondes...
                    </p>
                  </div>
                )
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GamePage