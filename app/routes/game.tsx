import { useEffect, useState } from "react"
import { useNavigate, useRouteLoaderData } from "react-router"
import { useWebSocket } from "~/hooks/useWebsocket"
import { fetchSessionToken } from "~/utils/fetchSessionToken"
import { GameBoardComponent } from "~/components/GameBoardComponent"
import type {
  PrivateRoomCreatedPayload,
  PrivateRoomJoinedPayload,
  WaitingForOpponentPayload,
  MatchFoundPayload,
  MatchStartPayload,
  MatchEndPayload,
  GameState,
  ErrorPayload,
  QueueJoinedPayload,
  GameAction,
  GameActionResult,
  ConnectedPayload
} from "~/types/socket"

type GameMode = "menu" | "queue" | "waiting_in_room" | "in_game" | "game_over"

const Game = () => {
  const { ws_url } = useRouteLoaderData("root") as { ws_url: string }
  console.log("[Game] 🚀 Component mounted")
  console.log("[Game] 🌐 WebSocket URL from loader:", ws_url)
  const [sessionToken, setSessionToken] = useState<string>("")
  const [connected, setConnected] = useState<boolean>(false)
  const [gameMode, setGameMode] = useState<GameMode>("menu")
  const [roomCode, setRoomCode] = useState<string>("")
  const [roomCodeInput, setRoomCodeInput] = useState<string>("")
  const [queueSize, setQueueSize] = useState<number>(0)
  const [opponent, setOpponent] = useState<{ id: string; username: string } | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [error, setError] = useState<string>("")
  const [matchEndResult, setMatchEndResult] = useState<MatchEndPayload | null>(null)
  const [myUserId, setMyUserId] = useState<string>("")

  const navigate = useNavigate()

  const connectionHandler = () => {
    console.log("[Game] ✅ Connection handler called - WebSocket CONNECTED")
  }

  const handleConnected = (payload: ConnectedPayload) => {
    console.log("[Game] ✅ WebSocket connected confirmed!")
    console.log("[Game] 👤 User:", payload.username, "ID:", payload.userId)
    setMyUserId(payload.userId)
    setConnected(true)
  }

  const disconnectHandler = () => {
    console.log("[Game] ❌ Disconnect handler called - navigating to /")
    setConnected(false)
    navigate("/")
  }

  // Handlers pour les événements WebSocket
  const handleQueueJoined = (payload: QueueJoinedPayload) => {
    console.log("[Game] 📋 Joined queue, size:", payload.queueSize)
    setQueueSize(payload.queueSize)
    setGameMode("queue")
    setError("")
  }

  const handleQueueLeft = () => {
    console.log("[Game] 🚪 Left queue")
    setGameMode("menu")
    setQueueSize(0)
  }

  const handlePrivateRoomCreated = (payload: PrivateRoomCreatedPayload) => {
    console.log("[Game] 🏠 Private room created:", payload.roomCode)
    setRoomCode(payload.roomCode)
    setGameMode("waiting_in_room")
    setError("")
  }

  const handlePrivateRoomJoined = (payload: PrivateRoomJoinedPayload) => {
    console.log("[Game] 🚪 Joined private room:", payload.roomCode)
    setRoomCode(payload.roomCode)
    setGameMode("waiting_in_room")
    setError("")
  }

  const handleWaitingForOpponent = (payload: WaitingForOpponentPayload) => {
    console.log("[Game] ⏳ Waiting for opponent in room:", payload.roomCode)
    setRoomCode(payload.roomCode)
    setGameMode("waiting_in_room")
  }

  const handleMatchFound = (payload: MatchFoundPayload) => {
    console.log("[Game] 🎮 Match found! Opponent:", payload.opponent.username)
    setOpponent(payload.opponent)
    // Le match trouvé passe automatiquement en attente de match_start
    // On ne change pas gameMode ici, on attend match_start
  }

  const handleMatchStart = (payload: MatchStartPayload) => {
    console.log("[Game] 🎮 Match started! Your turn:", payload.yourTurn)
    console.log("[Game] 📊 GameState received:", payload.gameState)
    setOpponent(payload.opponent)
    setGameState(payload.gameState)
    setGameMode("in_game")
    setError("")
  }

  const handleOpponentAction = (result: GameActionResult) => {
    console.log("[Game] 👥 Opponent action received:", result)
    if (result.success && result.gameState) {
      setGameState(result.gameState)
    } else if (!result.success && result.error) {
      console.error("[Game] ❌ Action failed:", result.error)
    }
  }

  const handleMatchEnd = (payload: MatchEndPayload) => {
    console.log("[Game] 🏁 Match ended:", payload)
    setMatchEndResult(payload)
    setGameMode("game_over")
  }

  const handleError = (payload: ErrorPayload) => {
    console.error("[Game] 🔴 Server error:", payload.message)
    setError(payload.message)
  }

  console.log("[Game] 🔧 Creating WebSocket with:", {
    url: ws_url,
    token: sessionToken ? `${sessionToken.substring(0, 15)}...` : "EMPTY",
    autoConnect: true,
  })

  const ws = useWebSocket({
    url: ws_url,
    token: sessionToken,
    autoConnect: true,
    handlers: {
      onServerConnected: handleConnected,
      onConnected: connectionHandler,
      onDisconnected: disconnectHandler,
      onQueueJoined: handleQueueJoined,
      onQueueLeft: handleQueueLeft,
      onPrivateRoomCreated: handlePrivateRoomCreated,
      onPrivateRoomJoined: handlePrivateRoomJoined,
      onWaitingForOpponent: handleWaitingForOpponent,
      onMatchFound: handleMatchFound,
      onMatchStart: handleMatchStart,
      onOpponentAction: handleOpponentAction,
      onMatchEnd: handleMatchEnd,
      onError: handleError,
      onConnectionError: (error) => {
        console.error("[Game] 🔴 Connection ERROR:", error)
      },
    }
  })

  // Actions de jeu
  const handleJoinQueue = () => {
    console.log("[Game] 🎯 Joining queue...")
    ws.joinQueue()
  }

  const handleLeaveQueue = () => {
    console.log("[Game] 🚪 Leaving queue...")
    ws.leaveQueue()
  }

  const handleCreatePrivateRoom = () => {
    console.log("[Game] 🏠 Creating private room...")
    ws.createPrivateRoom()
  }

  const handleJoinPrivateRoom = () => {
    if (!roomCodeInput.trim()) {
      setError("Veuillez entrer un code de salle")
      return
    }
    console.log("[Game] 🚪 Joining private room:", roomCodeInput)
    ws.joinPrivateRoom(roomCodeInput.toUpperCase())
  }

  const handleLeaveRoom = () => {
    console.log("[Game] 🚪 Leaving private room...")
    ws.leavePrivateRoom()
    setGameMode("menu")
    setRoomCode("")
    setRoomCodeInput("")
  }

  const handleBackToMenu = () => {
    if (gameMode === "queue") {
      handleLeaveQueue()
    } else if (gameMode === "waiting_in_room") {
      handleLeaveRoom()
    }
    setGameMode("menu")
    setOpponent(null)
    setGameState(null)
    setMatchEndResult(null)
    setError("")
  }

  const handleGameAction = (action: GameAction) => {
    console.log("[Game] 🎮 Sending game action:", action)
    ws.sendGameAction(action)
  }

  const handleSurrender = () => {
    if (confirm("Êtes-vous sûr de vouloir abandonner ?")) {
      console.log("[Game] 🏳️ Surrendering...")
      ws.surrender()
    }
  }

  useEffect(() => {
    console.log("[Game] 📥 useEffect - Loading session token...")
    let isMounted = true

    const loadToken = async () => {
      console.log("[Game] 🔍 Fetching session token from API...")
      const token = await fetchSessionToken()
      console.log("[Game] 📦 Session token received:", token ? `${token.substring(0, 15)}... (length: ${token.length})` : "❌ NULL/EMPTY")

      if (isMounted) {
        console.log("[Game] ✅ Component still mounted, setting token")
        setSessionToken(token || "")
      } else {
        console.log("[Game] ⚠️ Component unmounted, discarding token")
      }
    }

    loadToken()

    return () => {
      console.log("[Game] 🧹 Cleanup - marking component as unmounted")
      isMounted = false
    }
  }, [])

  console.log("[Game] 🎨 Render - State:", {
    connected,
    connectionState: ws.connectionState,
    hasToken: !!sessionToken,
    tokenPreview: sessionToken ? sessionToken.substring(0, 15) + "..." : "none",
    gameMode,
  })

  // Affichage pendant la connexion
  if (!connected) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <h1 className="text-2xl font-bold text-white">Connexion au serveur...</h1>
          <div className="text-gray-400 space-y-1">
            <p>État: {ws.connectionState}</p>
            <p>Token: {sessionToken ? "✅ Chargé" : "⏳ Chargement..."}</p>
          </div>
        </div>
      </main>
    )
  }

  // Menu principal
  if (gameMode === "menu") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Catalyst - Menu Principal</h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Matchmaking rapide */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">🎯 Matchmaking Rapide</h2>
              <p className="text-gray-400 mb-6">Trouvez un adversaire aléatoire et commencez à jouer immédiatement</p>
              <button
                onClick={handleJoinQueue}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Rejoindre la file d'attente
              </button>
            </div>

            {/* Créer une partie privée */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">🏠 Partie Privée</h2>
              <p className="text-gray-400 mb-6">Créez une salle privée et invitez un ami avec le code</p>
              <button
                onClick={handleCreatePrivateRoom}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Créer une salle privée
              </button>
            </div>

            {/* Rejoindre une partie privée */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 md:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-4">🚪 Rejoindre une Salle</h2>
              <p className="text-gray-400 mb-4">Entrez le code de la salle pour rejoindre une partie privée</p>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  placeholder="CODE SALLE"
                  maxLength={6}
                  className="flex-1 bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 uppercase"
                />
                <button
                  onClick={handleJoinPrivateRoom}
                  disabled={!roomCodeInput.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  Rejoindre
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Retour à l'accueil
            </button>
          </div>
        </div>
      </main>
    )
  }

  // File d'attente
  if (gameMode === "queue") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 max-w-md w-full text-center">
          <div className="animate-pulse mb-6">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-3xl font-bold text-white mb-2">Recherche d'adversaire...</h1>
            <p className="text-gray-400">Joueurs en file d'attente: {queueSize}</p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>

          {opponent && (
            <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded mb-4 animate-bounce">
              <p className="font-bold">✨ Adversaire trouvé !</p>
              <p>{opponent.username}</p>
              <p className="text-xs mt-2">Démarrage de la partie...</p>
            </div>
          )}

          <button
            onClick={handleBackToMenu}
            disabled={!!opponent}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {opponent ? "Démarrage..." : "Annuler"}
          </button>
        </div>
      </main>
    )
  }

  // Salle d'attente privée
  if (gameMode === "waiting_in_room") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🏠</div>
            <h1 className="text-3xl font-bold text-white mb-4">Salle Privée</h1>

            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <p className="text-gray-400 text-sm mb-2">Code de la salle</p>
              <p className="text-4xl font-bold text-white tracking-widest">{roomCode}</p>
              <p className="text-gray-400 text-sm mt-2">Partagez ce code avec votre ami</p>
            </div>

            <div className="animate-pulse">
              <p className="text-gray-400">En attente d'un adversaire...</p>
            </div>
          </div>

          {opponent && (
            <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded mb-4 animate-bounce">
              <p className="font-bold">✨ Adversaire rejoint !</p>
              <p>{opponent.username}</p>
              <p className="text-xs mt-2">Démarrage de la partie...</p>
            </div>
          )}

          <button
            onClick={handleBackToMenu}
            disabled={!!opponent}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {opponent ? "Démarrage..." : "Quitter la salle"}
          </button>
        </div>
      </main>
    )
  }

  // Partie en cours
  if (gameMode === "in_game") {
    if (!gameState) {
      return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto"></div>
            <h1 className="text-2xl font-bold text-white">Chargement de la partie...</h1>
            <p className="text-gray-400">Initialisation du plateau de jeu</p>
          </div>
        </main>
      )
    }

    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Header avec bouton abandonner */}
          <div className="bg-gray-800 border-b border-gray-700 p-4">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-white">Catalyst</h1>
              <button
                onClick={handleSurrender}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                🏳️ Abandonner
              </button>
            </div>
          </div>

          {/* Plateau de jeu */}
          <GameBoardComponent
            gameState={gameState}
            isMyTurn={true}
            myPlayerId={myUserId || gameState.player1.userId}
            onGameAction={handleGameAction}
          />
        </div>
      </main>
    )
  }

  // Écran de fin de partie
  if (gameMode === "game_over" && matchEndResult) {
    const isVictory = matchEndResult.winner === "you"
    const isDraw = matchEndResult.winner === "draw"

    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 max-w-2xl w-full text-center">
          <div className="mb-6">
            <div className="text-8xl mb-4">
              {isVictory ? "🏆" : isDraw ? "🤝" : "😔"}
            </div>
            <h1 className={`text-4xl font-bold mb-2 ${isVictory ? "text-green-400" : isDraw ? "text-yellow-400" : "text-red-400"}`}>
              {isVictory ? "Victoire !" : isDraw ? "Match Nul" : "Défaite"}
            </h1>
            <p className="text-gray-400 text-lg">
              {matchEndResult.reason === "surrender" && (isVictory ? "Votre adversaire a abandonné" : "Vous avez abandonné")}
              {matchEndResult.reason === "disconnect" && (isVictory ? "Votre adversaire s'est déconnecté" : "Déconnexion")}
              {matchEndResult.reason === "victory" && (isVictory ? "Vous avez le moins de points !" : "Votre adversaire a gagné")}
            </p>
          </div>

          {gameState && (
            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="text-white font-bold mb-4">Scores finaux</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">{gameState.player1.username}</p>
                  <p className="text-3xl font-bold text-white">{gameState.player1.points} pts</p>
                </div>
                <div>
                  <p className="text-gray-400">{gameState.player2.username}</p>
                  <p className="text-3xl font-bold text-white">{gameState.player2.points} pts</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleBackToMenu}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Retour au menu
          </button>
        </div>
      </main>
    )
  }

  // État par défaut
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center text-white">
        <p>État non géré: {gameMode}</p>
      </div>
    </main>
  )
}

export default Game
