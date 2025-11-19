
// Types d'événements que le client peut envoyer
export type ClientEventType =
  | "join_queue"
  | "leave_queue"
  | "create_private_room"
  | "join_private_room"
  | "leave_private_room"
  | "game_action"
  | "surrender"
  | "ping"

// Types d'événements que le serveur peut envoyer
export type ServerEventType =
  | "queue_joined"
  | "queue_left"
  | "match_found"
  | "match_start"
  | "opponent_action"
  | "match_end"
  | "private_room_created"
  | "private_room_joined"
  | "waiting_for_opponent"
  | "error"
  | "pong"

// Structure des événements du client
export interface ClientEvent<T = unknown> {
  type: ClientEventType
  payload?: T
}

// Payload pour join_private_room
export interface JoinPrivateRoomPayload {
  roomCode: string
}

// Payload pour private_room_created
export interface PrivateRoomCreatedPayload {
  roomId: string
  roomCode: string
}

// Payload pour private_room_joined
export interface PrivateRoomJoinedPayload {
  roomId: string
  roomCode: string
  host: {
    id: string
    username: string
  }
}

// Payload pour waiting_for_opponent
export interface WaitingForOpponentPayload {
  roomId: string
  roomCode: string
}

// Payload pour match_found
export interface MatchFoundPayload {
  roomId: string
  opponent: {
    id: string
    username: string
  }
  isPrivate: boolean
}

// Payload pour match_start
export interface MatchStartPayload {
  roomId: string
  yourTurn: boolean
  opponent: {
    id: string
    username: string
  }
  isPrivate: boolean
}

// Payload pour match_end
export interface MatchEndPayload {
  winner: "you" | "opponent" | "draw"
  reason: "surrender" | "disconnect" | "victory"
}

// Payload pour error
export interface ErrorPayload {
  message: string
  code?: string
}

// Payload pour queue_joined
export interface QueueJoinedPayload {
  queueSize: number
}

// Structure des événements du serveur avec type union discriminé
export type ServerEvent =
  | { type: "queue_joined"; payload: QueueJoinedPayload }
  | { type: "queue_left"; payload?: never }
  | { type: "match_found"; payload: MatchFoundPayload }
  | { type: "match_start"; payload: MatchStartPayload }
  | { type: "opponent_action"; payload: unknown }
  | { type: "match_end"; payload: MatchEndPayload }
  | { type: "private_room_created"; payload: PrivateRoomCreatedPayload }
  | { type: "private_room_joined"; payload: PrivateRoomJoinedPayload }
  | { type: "waiting_for_opponent"; payload: WaitingForOpponentPayload }
  | { type: "error"; payload: ErrorPayload }
  | { type: "pong"; payload?: never }

// État de connexion du WebSocket
export type ConnectionState = "disconnected" | "connecting" | "connected" | "error"

// Handlers pour les événements serveur
export interface WebSocketHandlers {
  onQueueJoined?: (payload: QueueJoinedPayload) => void
  onQueueLeft?: () => void
  onMatchFound?: (payload: MatchFoundPayload) => void
  onMatchStart?: (payload: MatchStartPayload) => void
  onOpponentAction?: (payload: unknown) => void
  onMatchEnd?: (payload: MatchEndPayload) => void
  onPrivateRoomCreated?: (payload: PrivateRoomCreatedPayload) => void
  onPrivateRoomJoined?: (payload: PrivateRoomJoinedPayload) => void
  onWaitingForOpponent?: (payload: WaitingForOpponentPayload) => void
  onError?: (payload: ErrorPayload) => void
  onConnected?: () => void
  onDisconnected?: () => void
  onConnectionError?: (error: Event) => void
}