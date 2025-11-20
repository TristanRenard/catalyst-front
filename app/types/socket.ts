
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
  gameState: GameState
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

// Types pour le jeu

export interface Energie {
  id: string
  name: string
  color: string
  quota: number
  backImage: string
  frontImage: string
  picto: string
}

export interface Effect {
  id: string
  name: string
  description: string
  type: string
  points: number
  slug: string
}

export interface SituationCard {
  id: string
  effectId: string
  backImage: string
  frontImage: string
}

export interface SituationCardWithEnergies {
  card: SituationCard
  effect: Effect
  requiredEnergies: Energie[]
  quota: number
}

export interface PlayedSituationCard {
  situationCard: SituationCardWithEnergies
  placedEnergies: Energie[]
  playedBy: "player1" | "player2"
}

export interface PlayerGameState {
  userId: string
  username: string
  handSituationCards: SituationCardWithEnergies[]
  handEnergieCards: Energie[]
  points: number
  firstToReceivePoints: boolean
  privateSituationCard: PlayedSituationCard | null
}

export interface GameState {
  roomId: string
  player1: PlayerGameState
  player2: PlayerGameState
  commonSituationCard: PlayedSituationCard | null
  situationDeck: SituationCardWithEnergies[]
  energieDeck: Energie[]
  situationDiscard: SituationCardWithEnergies[]
  energieDiscard: Energie[]
  currentTurn: number
  maxTurns: number
  currentPlayer: "player1" | "player2"
  phase: "setup" | "drawing_energie" | "placing_energie" | "waiting_effect" | "waiting_replacement" | "game_over"
  firstPlayerToScore: "player1" | "player2" | null
  completedSituation?: {
    type: "common" | "player1_private" | "player2_private"
    card: SituationCardWithEnergies
  }
  createdAt: Date
  startedAt?: Date
  finishedAt?: Date
}

// Actions de jeu

export type GameActionType =
  | "draw_energie"
  | "place_energie"
  | "discard_energie"
  | "apply_effect"
  | "replace_situation"

export interface DrawEnergiePayload {
  fromDiscard: boolean
}

export interface PlaceEnergiePayload {
  energieCardIndex: number
  targetSituation: "common" | "my_private" | "opponent_private"
}

export interface DiscardEnergiePayload {
  energieCardIndex: number
}

export interface ApplyEffectPayload {
  situationType: "common" | "my_private" | "opponent_private"
  targetPlayer: "player1" | "player2"
}

export interface ReplaceSituationPayload {
  situationType: "common" | "my_private"
  newSituationCardIndex: number
}

export interface GameAction {
  type: GameActionType
  payload: DrawEnergiePayload | PlaceEnergiePayload | DiscardEnergiePayload | ApplyEffectPayload | ReplaceSituationPayload
}

export type GameEventType =
  | "energie_drawn"
  | "energie_placed"
  | "energie_discarded"
  | "situation_completed"
  | "effect_applied"
  | "situation_replaced"
  | "card_drawn"
  | "turn_changed"
  | "game_over"

export interface GameEvent {
  type: GameEventType
  data: unknown
}

export interface GameActionResult {
  success: boolean
  error?: string
  gameState?: GameState
  events?: GameEvent[]
}