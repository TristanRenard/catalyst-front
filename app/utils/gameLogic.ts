import type {
  GameState,
  PlayerGameState,
  PlayedSituationCard,
  SituationCardWithEnergies,
  Energie,
  GameAction,
  DrawEnergiePayload,
  PlaceEnergiePayload,
  DiscardEnergiePayload,
  ApplyEffectPayload,
  ReplaceSituationPayload,
} from '~/types/socket'

/**
 * Vérifie si une situation est complétée
 * Une situation est complétée si elle a exactement 5 énergies
 * et que ces énergies correspondent aux énergies requises
 */
export function isSituationCompleted(situation: PlayedSituationCard): boolean {
  // Vérifier qu'il y a exactement 5 énergies
  if (situation.placedEnergies.length !== 5) {
    return false
  }

  // Vérifier que les énergies correspondent aux énergies requises
  const requiredIds = situation.situationCard.requiredEnergies.map(e => e.id).sort()
  const placedIds = situation.placedEnergies.map(e => e.id).sort()

  return JSON.stringify(requiredIds) === JSON.stringify(placedIds)
}

/**
 * Compte les énergies d'un joueur
 */
export function countEnergies(player: PlayerGameState): number {
  return player.handEnergieCards.length
}

/**
 * Vérifie si un joueur peut piocher une énergie
 */
export function canDrawEnergie(gameState: GameState, playerId: string): boolean {
  const player = gameState.player1.userId === playerId ? gameState.player1 : gameState.player2

  // Ne peut pas avoir plus de 3 énergies en main
  if (countEnergies(player) >= 3) {
    return false
  }

  // Il faut au moins une énergie disponible (pioche ou défausse)
  return gameState.energieDeck.length > 0 || gameState.energieDiscard.length > 0
}

/**
 * Vérifie si un joueur peut piocher depuis la défausse
 */
export function canDrawFromDiscard(gameState: GameState): boolean {
  return gameState.energieDiscard.length > 0
}

/**
 * Vérifie si un joueur peut placer une énergie sur une situation
 */
export function canPlaceEnergie(
  situation: PlayedSituationCard | null,
): boolean {
  if (!situation) {
    return false
  }

  // Ne peut pas placer plus de 5 énergies
  return situation.placedEnergies.length < 5
}

/**
 * Calcule les points d'un joueur à la fin de la partie
 */
export function calculatePlayerScore(
  player: PlayerGameState,
  commonSituation: PlayedSituationCard | null,
): number {
  let score = 0

  // Points de la situation privée si non complétée
  if (player.privateSituationCard && !isSituationCompleted(player.privateSituationCard)) {
    score += player.privateSituationCard.situationCard.quota
  }

  // Points de la situation commune si non complétée
  if (commonSituation && !isSituationCompleted(commonSituation)) {
    score += commonSituation.situationCard.quota
  }

  return score
}

/**
 * Détermine le vainqueur à la fin de la partie
 */
export function determineWinner(gameState: GameState): {
  winner: 'player1' | 'player2' | 'draw'
  player1Score: number
  player2Score: number
} {
  const player1Score = calculatePlayerScore(gameState.player1, gameState.commonSituationCard)
  const player2Score = calculatePlayerScore(gameState.player2, gameState.commonSituationCard)

  if (player1Score < player2Score) {
    return { winner: 'player1', player1Score, player2Score }
  } else if (player2Score < player1Score) {
    return { winner: 'player2', player1Score, player2Score }
  } else {
    // En cas d'égalité, le premier à avoir reçu des points perd
    if (gameState.firstPlayerToScore === 'player1') {
      return { winner: 'player2', player1Score, player2Score }
    } else if (gameState.firstPlayerToScore === 'player2') {
      return { winner: 'player1', player1Score, player2Score }
    } else {
      return { winner: 'draw', player1Score, player2Score }
    }
  }
}

/**
 * Vérifie si la partie est terminée
 */
export function isGameOver(gameState: GameState): boolean {
  return gameState.phase === 'game_over' || gameState.currentTurn > gameState.maxTurns
}

/**
 * Obtient le joueur actuel
 */
export function getCurrentPlayer(gameState: GameState): PlayerGameState {
  return gameState.currentPlayer === 'player1' ? gameState.player1 : gameState.player2
}

/**
 * Obtient l'adversaire du joueur actuel
 */
export function getOpponentPlayer(gameState: GameState): PlayerGameState {
  return gameState.currentPlayer === 'player1' ? gameState.player2 : gameState.player1
}

/**
 * Vérifie si c'est le tour du joueur
 */
export function isPlayerTurn(gameState: GameState, userId: string): boolean {
  const currentPlayer = getCurrentPlayer(gameState)
  return currentPlayer.userId === userId
}

/**
 * Vérifie si une action de jeu est valide
 */
export function validateGameAction(
  gameState: GameState,
  userId: string,
  action: GameAction,
): { valid: boolean; error?: string } {
  // Vérifier que c'est le tour du joueur
  if (!isPlayerTurn(gameState, userId)) {
    return { valid: false, error: "Ce n'est pas votre tour" }
  }

  const player = getCurrentPlayer(gameState)

  switch (action.type) {
    case 'draw_energie': {
      const payload = action.payload as DrawEnergiePayload

      // Vérifier la phase
      if (gameState.phase !== 'drawing_energie') {
        return { valid: false, error: 'Vous devez être en phase de pioche' }
      }

      // Vérifier qu'on peut piocher
      if (!canDrawEnergie(gameState, userId)) {
        return { valid: false, error: 'Vous avez déjà 3 énergies en main' }
      }

      // Si on veut piocher depuis la défausse, vérifier qu'elle n'est pas vide
      if (payload.fromDiscard && !canDrawFromDiscard(gameState)) {
        return { valid: false, error: 'La défausse est vide' }
      }

      return { valid: true }
    }

    case 'place_energie': {
      const payload = action.payload as PlaceEnergiePayload

      // Vérifier la phase
      if (gameState.phase !== 'placing_energie') {
        return { valid: false, error: 'Vous devez être en phase de placement' }
      }

      // Vérifier qu'on a une énergie à l'index spécifié
      if (payload.energieCardIndex < 0 || payload.energieCardIndex >= player.handEnergieCards.length) {
        return { valid: false, error: 'Index de carte invalide' }
      }

      // Vérifier qu'on peut placer sur la situation cible
      let targetSituation: PlayedSituationCard | null = null
      if (payload.targetSituation === 'common') {
        targetSituation = gameState.commonSituationCard
      } else if (payload.targetSituation === 'my_private') {
        targetSituation = player.privateSituationCard
      } else if (payload.targetSituation === 'opponent_private') {
        const opponent = getOpponentPlayer(gameState)
        targetSituation = opponent.privateSituationCard
      }

      if (!canPlaceEnergie(targetSituation)) {
        return { valid: false, error: 'Cette situation a déjà 5 énergies' }
      }

      return { valid: true }
    }

    case 'discard_energie': {
      const payload = action.payload as DiscardEnergiePayload

      // Vérifier la phase
      if (gameState.phase !== 'placing_energie') {
        return { valid: false, error: 'Vous devez être en phase de placement' }
      }

      // Vérifier qu'on a une énergie à l'index spécifié
      if (payload.energieCardIndex < 0 || payload.energieCardIndex >= player.handEnergieCards.length) {
        return { valid: false, error: 'Index de carte invalide' }
      }

      return { valid: true }
    }

    case 'apply_effect': {
      // Vérifier la phase
      if (gameState.phase !== 'waiting_effect') {
        return { valid: false, error: 'Aucun effet à appliquer' }
      }

      return { valid: true }
    }

    case 'replace_situation': {
      const payload = action.payload as ReplaceSituationPayload

      // Vérifier la phase
      if (gameState.phase !== 'waiting_replacement') {
        return { valid: false, error: 'Aucune situation à remplacer' }
      }

      // Vérifier qu'on a une carte situation à l'index spécifié
      if (payload.newSituationCardIndex < 0 || payload.newSituationCardIndex >= player.handSituationCards.length) {
        return { valid: false, error: 'Index de carte invalide' }
      }

      // On ne peut remplacer que common ou my_private
      if (payload.situationType !== 'common' && payload.situationType !== 'my_private') {
        return { valid: false, error: 'Vous ne pouvez remplacer que la situation commune ou votre situation privée' }
      }

      return { valid: true }
    }

    default:
      return { valid: false, error: 'Action inconnue' }
  }
}

/**
 * Obtient la situation selon son type
 */
export function getSituationByType(
  gameState: GameState,
  situationType: 'common' | 'my_private' | 'opponent_private',
  userId: string,
): PlayedSituationCard | null {
  if (situationType === 'common') {
    return gameState.commonSituationCard
  }

  const isPlayer1 = gameState.player1.userId === userId

  if (situationType === 'my_private') {
    return isPlayer1 ? gameState.player1.privateSituationCard : gameState.player2.privateSituationCard
  } else {
    return isPlayer1 ? gameState.player2.privateSituationCard : gameState.player1.privateSituationCard
  }
}

/**
 * Formatte le message d'erreur pour l'utilisateur
 */
export function getActionErrorMessage(error: string): string {
  const errorMessages: Record<string, string> = {
    "Ce n'est pas votre tour": "⏳ Attendez votre tour pour jouer",
    "Vous devez être en phase de pioche": "📥 C'est le moment de piocher une énergie",
    "Vous avez déjà 3 énergies en main": "✋ Vous ne pouvez pas avoir plus de 3 énergies",
    "La défausse est vide": "🚫 La défausse d'énergies est vide",
    "Vous devez être en phase de placement": "🎯 C'est le moment de placer ou défausser une énergie",
    "Index de carte invalide": "❌ Cette carte n'existe pas dans votre main",
    "Cette situation a déjà 5 énergies": "⚡ Cette situation est déjà complète",
    "Aucun effet à appliquer": "⏸️ Aucun effet en attente",
    "Aucune situation à remplacer": "⏸️ Aucune situation à remplacer",
    "Action inconnue": "❓ Action non reconnue",
  }

  return errorMessages[error] || error
}
