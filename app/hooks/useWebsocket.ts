import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  ClientEvent,
  ClientEventType,
  ConnectionState,
  JoinPrivateRoomPayload,
  ServerEvent,
  WebSocketHandlers,
} from '~/types/socket'

interface UseWebSocketOptions {
  url: string
  token: string
  handlers?: WebSocketHandlers
  autoConnect?: boolean
  reconnectOnError?: boolean
  reconnectDelay?: number
  heartbeatInterval?: number
}

interface UseWebSocketReturn {
  connectionState: ConnectionState
  isConnected: boolean
  connect: () => void
  disconnect: () => void
  send: <T = unknown>(type: ClientEventType, payload?: T) => void
  joinQueue: () => void
  leaveQueue: () => void
  createPrivateRoom: () => void
  joinPrivateRoom: (roomCode: string) => void
  leavePrivateRoom: () => void
  sendGameAction: (action: unknown) => void
  surrender: () => void
}

export const useWebSocket = (options: UseWebSocketOptions): UseWebSocketReturn => {
  const {
    url,
    token,
    handlers,
    autoConnect = true,
    reconnectOnError = false,
    reconnectDelay = 3000,
    heartbeatInterval = 30000,
  } = options

  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected')
  const wsRef = useRef<WebSocket | null>(null)
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const handlersRef = useRef(handlers)

  // Mettre à jour les handlers sans recréer les fonctions
  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  // Fonction pour nettoyer les timers
  const cleanupTimers = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
      heartbeatIntervalRef.current = null
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }, [])

  // Fonction pour gérer les événements du serveur
  const handleServerEvent = useCallback((event: ServerEvent) => {
    const currentHandlers = handlersRef.current

    switch (event.type) {
      case 'queue_joined':
        currentHandlers?.onQueueJoined?.(event.payload)
        break
      case 'queue_left':
        currentHandlers?.onQueueLeft?.()
        break
      case 'match_found':
        currentHandlers?.onMatchFound?.(event.payload)
        break
      case 'match_start':
        currentHandlers?.onMatchStart?.(event.payload)
        break
      case 'opponent_action':
        currentHandlers?.onOpponentAction?.(event.payload)
        break
      case 'match_end':
        currentHandlers?.onMatchEnd?.(event.payload)
        break
      case 'private_room_created':
        currentHandlers?.onPrivateRoomCreated?.(event.payload)
        break
      case 'private_room_joined':
        currentHandlers?.onPrivateRoomJoined?.(event.payload)
        break
      case 'waiting_for_opponent':
        currentHandlers?.onWaitingForOpponent?.(event.payload)
        break
      case 'error':
        currentHandlers?.onError?.(event.payload)
        break
      case 'pong':
        // Heartbeat OK, rien à faire
        break
    }
  }, [])

  // Fonction pour envoyer un message au serveur
  const send = useCallback(<T = unknown>(type: ClientEventType, payload?: T) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const event: ClientEvent<T> = { type, payload }
      wsRef.current.send(JSON.stringify(event))
    } else {
      console.error('WebSocket non connecté')
    }
  }, [])

  // Fonction pour démarrer le heartbeat
  const startHeartbeat = useCallback(() => {
    cleanupTimers()
    heartbeatIntervalRef.current = setInterval(() => {
      send('ping')
    }, heartbeatInterval)
  }, [send, heartbeatInterval, cleanupTimers])

  // Fonction de connexion
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.warn('WebSocket déjà connecté')
      return
    }

    cleanupTimers()
    setConnectionState('connecting')

    try {
      // Note: Le navigateur standard WebSocket ne supporte pas les headers personnalisés
      // Il faut passer le token dans l'URL ou utiliser une bibliothèque compatible
      const wsUrl = `${url}?token=${encodeURIComponent(token)}`
      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log('WebSocket connecté')
        setConnectionState('connected')
        handlersRef.current?.onConnected?.()
        startHeartbeat()
      }

      ws.onmessage = (event) => {
        try {
          const data: ServerEvent = JSON.parse(event.data)
          handleServerEvent(data)
        } catch (error) {
          console.error('Erreur de parsing du message WebSocket:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('Erreur WebSocket:', error)
        setConnectionState('error')
        handlersRef.current?.onConnectionError?.(error)
      }

      ws.onclose = () => {
        console.log('WebSocket déconnecté')
        setConnectionState('disconnected')
        cleanupTimers()
        handlersRef.current?.onDisconnected?.()

        // Tentative de reconnexion si activée
        if (reconnectOnError) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Tentative de reconnexion...')
            connect()
          }, reconnectDelay)
        }
      }

      wsRef.current = ws
    } catch (error) {
      console.error('Erreur lors de la création du WebSocket:', error)
      setConnectionState('error')
    }
  }, [url, token, handleServerEvent, startHeartbeat, reconnectOnError, reconnectDelay, cleanupTimers])

  // Fonction de déconnexion
  const disconnect = useCallback(() => {
    cleanupTimers()
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setConnectionState('disconnected')
  }, [cleanupTimers])

  // Actions de jeu simplifiées
  const joinQueue = useCallback(() => send('join_queue'), [send])
  const leaveQueue = useCallback(() => send('leave_queue'), [send])
  const createPrivateRoom = useCallback(() => send('create_private_room'), [send])
  const joinPrivateRoom = useCallback(
    (roomCode: string) => send<JoinPrivateRoomPayload>('join_private_room', { roomCode }),
    [send]
  )
  const leavePrivateRoom = useCallback(() => send('leave_private_room'), [send])
  const sendGameAction = useCallback((action: unknown) => send('game_action', action), [send])
  const surrender = useCallback(() => send('surrender'), [send])

  // Connexion automatique au montage si autoConnect est activé
  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    // Nettoyage à la déconnexion du composant
    return () => {
      disconnect()
    }
  }, [autoConnect, connect, disconnect])

  return {
    connectionState,
    isConnected: connectionState === 'connected',
    connect,
    disconnect,
    send,
    joinQueue,
    leaveQueue,
    createPrivateRoom,
    joinPrivateRoom,
    leavePrivateRoom,
    sendGameAction,
    surrender,
  }
}