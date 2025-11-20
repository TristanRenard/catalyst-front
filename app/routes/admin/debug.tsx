import { useState, useEffect, useRef } from "react"
import { publicAPI } from "~/utils/publicAPI"

export const meta = () => {
  return [{ title: "Debug WebSocket - Catalyst" }]
}

interface Message {
  direction: "sent" | "received"
  timestamp: Date
  type: string
  payload?: any
  raw: string
}

const DebugPage = () => {
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionToken, setSessionToken] = useState("")
  const [eventType, setEventType] = useState("join_queue")
  const [payloadInput, setPayloadInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch session token on mount
  useEffect(() => {
    const fetchSessionToken = async () => {
      try {
        const response = await publicAPI.get<{ user: any; sessionToken?: string }>("/@me")
        if (response.data.sessionToken) {
          setSessionToken(response.data.sessionToken)
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du session token:", err)
      }
    }
    fetchSessionToken()
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [ws])

  const connect = () => {
    if (!sessionToken) {
      alert("Session token non disponible. Veuillez vous reconnecter.")
      return
    }

    try {
      // Pass token in URL query parameter
      const socket = new WebSocket(`ws://localhost:5173/ws?token=${sessionToken}`)

      socket.onopen = () => {
        setConnected(true)
        addMessage("received", "connection", undefined, "WebSocket connecté (token passé en URL)")
      }

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          addMessage("received", data.type, data.payload, event.data)
        } catch (err) {
          addMessage("received", "raw", undefined, event.data)
        }
      }

      socket.onerror = (error) => {
        addMessage("received", "error", undefined, `Erreur WebSocket: ${error}`)
      }

      socket.onclose = () => {
        setConnected(false)
        addMessage("received", "close", undefined, "WebSocket déconnecté")
        setWs(null)
      }

      setWs(socket)
    } catch (err) {
      alert(`Erreur de connexion: ${err}`)
    }
  }

  const disconnect = () => {
    if (ws) {
      ws.close()
    }
  }

  const sendEvent = () => {
    if (!ws || !connected) {
      alert("WebSocket non connecté")
      return
    }

    try {
      let payload: any = undefined
      if (payloadInput.trim()) {
        payload = JSON.parse(payloadInput)
      }

      const event = { type: eventType, payload }
      const raw = JSON.stringify(event)

      ws.send(raw)
      addMessage("sent", eventType, payload, raw)

      // Clear payload after sending
      setPayloadInput("")
    } catch (err) {
      alert(`Erreur: ${err}`)
    }
  }

  const addMessage = (direction: "sent" | "received", type: string, payload: any, raw: string) => {
    setMessages((prev) => [
      ...prev,
      {
        direction,
        timestamp: new Date(),
        type,
        payload,
        raw,
      },
    ])
  }

  const clearMessages = () => {
    setMessages([])
  }

  const quickEvents = [
    { type: "join_queue", label: "Rejoindre la queue", payload: null },
    { type: "leave_queue", label: "Quitter la queue", payload: null },
    { type: "create_private_room", label: "Créer room privée", payload: null },
    { type: "ping", label: "Ping", payload: null },
    { type: "surrender", label: "Abandonner", payload: null },
  ]

  const sendQuickEvent = (type: string, payload: any) => {
    if (!ws || !connected) {
      alert("WebSocket non connecté")
      return
    }

    const event = { type, payload }
    const raw = JSON.stringify(event)

    ws.send(raw)
    addMessage("sent", type, payload, raw)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#EBDFF0] mb-2">
          Debug WebSocket
        </h1>
        <p className="text-[#EBDFF0] opacity-70 text-sm">
          Testez les événements WebSocket en temps réel
        </p>
      </div>

      {/* Connexion */}
      <div className="bg-[#2a2830] rounded-xl border border-[#3a3840] p-6">
        <h2 className="text-xl font-semibold text-[#EBDFF0] mb-4">Connexion</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#EBDFF0] mb-2">
              Session Token
            </label>
            <div className="relative">
              <input
                type="text"
                value={sessionToken}
                readOnly
                className="w-full px-4 py-2 bg-[#232029] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none opacity-70"
                placeholder="Chargement du token..."
              />
              {sessionToken && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 text-sm">
                  ✓ Token récupéré
                </div>
              )}
            </div>
            <p className="text-xs text-[#8b8693] mt-1">
              Token automatiquement récupéré depuis l'API /@me
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={connect}
              disabled={connected || !sessionToken}
              className="flex-1 bg-[#df93ff] hover:bg-[#c77de8] disabled:bg-gray-600 disabled:cursor-not-allowed text-[#1a1820] font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              {connected ? "Connecté" : "Se connecter"}
            </button>

            <button
              onClick={disconnect}
              disabled={!connected}
              className="flex-1 bg-red-900/30 hover:bg-red-900/50 disabled:bg-gray-600 disabled:cursor-not-allowed text-red-400 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Déconnecter
            </button>
          </div>

          <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
            connected
              ? "bg-green-900/30 text-green-400 border border-green-700"
              : "bg-gray-900/30 text-gray-400 border border-gray-700"
          }`}>
            Statut: {connected ? "✅ Connecté" : "❌ Déconnecté"}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-[#2a2830] rounded-xl border border-[#3a3840] p-6">
        <h2 className="text-xl font-semibold text-[#EBDFF0] mb-4">Actions rapides</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickEvents.map((event) => (
            <button
              key={event.type}
              onClick={() => sendQuickEvent(event.type, event.payload)}
              disabled={!connected}
              className="px-4 py-3 bg-[#232029] hover:bg-[#3a3840] disabled:bg-gray-800 disabled:cursor-not-allowed text-[#EBDFF0] rounded-lg transition-colors text-sm font-medium border border-[#3a3840] hover:border-[#df93ff]"
            >
              {event.label}
            </button>
          ))}
        </div>
      </div>

      {/* Envoyer un événement personnalisé */}
      <div className="bg-[#2a2830] rounded-xl border border-[#3a3840] p-6">
        <h2 className="text-xl font-semibold text-[#EBDFF0] mb-4">Événement personnalisé</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#EBDFF0] mb-2">
                Type d'événement
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-4 py-2 bg-[#232029] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none focus:border-[#df93ff] transition-colors"
              >
                <option value="join_queue">join_queue</option>
                <option value="leave_queue">leave_queue</option>
                <option value="create_private_room">create_private_room</option>
                <option value="join_private_room">join_private_room</option>
                <option value="leave_private_room">leave_private_room</option>
                <option value="game_action">game_action</option>
                <option value="surrender">surrender</option>
                <option value="ping">ping</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#EBDFF0] mb-2">
                Payload (JSON)
              </label>
              <input
                type="text"
                value={payloadInput}
                onChange={(e) => setPayloadInput(e.target.value)}
                className="w-full px-4 py-2 bg-[#232029] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none focus:border-[#df93ff] transition-colors"
                placeholder='{"roomCode": "ABC123"}'
              />
            </div>
          </div>

          <button
            onClick={sendEvent}
            disabled={!connected}
            className="w-full bg-[#df93ff] hover:bg-[#c77de8] disabled:bg-gray-600 disabled:cursor-not-allowed text-[#1a1820] font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Envoyer l'événement
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-[#2a2830] rounded-xl border border-[#3a3840] overflow-hidden">
        <div className="p-6 border-b border-[#3a3840] flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#EBDFF0]">
            Messages ({messages.length})
          </h2>
          <button
            onClick={clearMessages}
            className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors text-sm font-medium"
          >
            Effacer
          </button>
        </div>

        <div className="p-6 max-h-[600px] overflow-y-auto space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-[#EBDFF0] opacity-50">
              Aucun message pour le moment
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  msg.direction === "sent"
                    ? "bg-blue-900/20 border-blue-700/50"
                    : "bg-green-900/20 border-green-700/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {msg.direction === "sent" ? "↗️" : "↙️"}
                    </span>
                    <span className={`font-semibold ${
                      msg.direction === "sent" ? "text-blue-400" : "text-green-400"
                    }`}>
                      {msg.direction === "sent" ? "Envoyé" : "Reçu"}
                    </span>
                    <span className="text-[#EBDFF0] font-mono text-sm">
                      {msg.type}
                    </span>
                  </div>
                  <span className="text-xs text-[#EBDFF0] opacity-50">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                <pre className="bg-[#232029] p-3 rounded text-xs text-[#EBDFF0] overflow-x-auto">
                  {msg.raw}
                </pre>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}

export default DebugPage
