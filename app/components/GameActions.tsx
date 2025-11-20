import { useState } from 'react'
import type {
  GameState,
  GameAction,
  DrawEnergiePayload,
  PlaceEnergiePayload,
  DiscardEnergiePayload,
  ApplyEffectPayload,
  ReplaceSituationPayload,
} from '~/types/socket'
import { canDrawFromDiscard, canPlaceEnergie, getSituationByType } from '~/utils/gameLogic'
import EnergieCard from './EnergieCard'
import SituationCard from './SituationCard'

interface GameActionsProps {
  gameState: GameState
  myUserId: string
  onAction: (action: GameAction) => void
}

export default function GameActions({ gameState, myUserId, onAction }: GameActionsProps) {
  const [selectedEnergieIndex, setSelectedEnergieIndex] = useState<number | null>(null)
  const [selectedSituationIndex, setSelectedSituationIndex] = useState<number | null>(null)

  const amIPlayer1 = gameState.player1.userId === myUserId
  const myPlayer = amIPlayer1 ? gameState.player1 : gameState.player2

  // Phase: Piocher une énergie
  if (gameState.phase === 'drawing_energie') {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
        <h3 className="text-white text-xl font-bold mb-4">📥 Piochez une Énergie</h3>
        <div className="flex gap-4">
          <button
            onClick={() => {
              const action: GameAction = {
                type: 'draw_energie',
                payload: { fromDiscard: false } as DrawEnergiePayload,
              }
              onAction(action)
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition"
          >
            Piocher depuis la pioche
            <div className="text-sm opacity-75 mt-1">
              {gameState.energieDeck.length} cartes disponibles
            </div>
          </button>

          <button
            onClick={() => {
              const action: GameAction = {
                type: 'draw_energie',
                payload: { fromDiscard: true } as DrawEnergiePayload,
              }
              onAction(action)
            }}
            disabled={!canDrawFromDiscard(gameState)}
            className={`
              flex-1 font-bold py-4 px-6 rounded-lg transition
              ${canDrawFromDiscard(gameState)
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Piocher depuis la défausse
            <div className="text-sm opacity-75 mt-1">
              {canDrawFromDiscard(gameState)
                ? `${gameState.energieDiscard.length} cartes disponibles`
                : 'Défausse vide'
              }
            </div>
          </button>
        </div>
      </div>
    )
  }

  // Phase: Placer ou défausser une énergie
  if (gameState.phase === 'placing_energie') {
    const myPrivateSituation = getSituationByType(gameState, 'my_private', myUserId)
    const opponentPrivateSituation = getSituationByType(gameState, 'opponent_private', myUserId)

    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
        <h3 className="text-white text-xl font-bold mb-4">🎯 Placez ou Défaussez une Énergie</h3>

        {/* Ma main d'énergies */}
        <div className="mb-6">
          <div className="text-white text-sm mb-2">Vos énergies:</div>
          <div className="flex gap-2">
            {myPlayer.handEnergieCards.map((energie, index) => (
              <EnergieCard
                key={index}
                energie={energie}
                size="medium"
                selected={selectedEnergieIndex === index}
                onClick={() => setSelectedEnergieIndex(index)}
              />
            ))}
          </div>
        </div>

        {selectedEnergieIndex !== null && (
          <div className="space-y-4">
            {/* Placer sur une situation */}
            <div>
              <div className="text-white text-sm mb-2">Placer sur:</div>
              <div className="grid grid-cols-3 gap-4">
                {/* Situation Commune */}
                <button
                  onClick={() => {
                    const action: GameAction = {
                      type: 'place_energie',
                      payload: {
                        energieCardIndex: selectedEnergieIndex,
                        targetSituation: 'common',
                      } as PlaceEnergiePayload,
                    }
                    onAction(action)
                    setSelectedEnergieIndex(null)
                  }}
                  disabled={!canPlaceEnergie(gameState.commonSituationCard)}
                  className={`
                    p-4 rounded-lg transition
                    ${canPlaceEnergie(gameState.commonSituationCard)
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  🌍 Situation Commune
                  {gameState.commonSituationCard && (
                    <div className="text-xs mt-1">
                      {gameState.commonSituationCard.placedEnergies.length}/5
                    </div>
                  )}
                </button>

                {/* Ma Situation Privée */}
                <button
                  onClick={() => {
                    const action: GameAction = {
                      type: 'place_energie',
                      payload: {
                        energieCardIndex: selectedEnergieIndex,
                        targetSituation: 'my_private',
                      } as PlaceEnergiePayload,
                    }
                    onAction(action)
                    setSelectedEnergieIndex(null)
                  }}
                  disabled={!canPlaceEnergie(myPrivateSituation)}
                  className={`
                    p-4 rounded-lg transition
                    ${canPlaceEnergie(myPrivateSituation)
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  🔒 Ma Situation
                  {myPrivateSituation && (
                    <div className="text-xs mt-1">
                      {myPrivateSituation.placedEnergies.length}/5
                    </div>
                  )}
                </button>

                {/* Situation Privée Adversaire */}
                <button
                  onClick={() => {
                    const action: GameAction = {
                      type: 'place_energie',
                      payload: {
                        energieCardIndex: selectedEnergieIndex,
                        targetSituation: 'opponent_private',
                      } as PlaceEnergiePayload,
                    }
                    onAction(action)
                    setSelectedEnergieIndex(null)
                  }}
                  disabled={!canPlaceEnergie(opponentPrivateSituation)}
                  className={`
                    p-4 rounded-lg transition
                    ${canPlaceEnergie(opponentPrivateSituation)
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  🎭 Situation Adversaire
                  {opponentPrivateSituation && (
                    <div className="text-xs mt-1">
                      {opponentPrivateSituation.placedEnergies.length}/5
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Défausser */}
            <div>
              <button
                onClick={() => {
                  const action: GameAction = {
                    type: 'discard_energie',
                    payload: {
                      energieCardIndex: selectedEnergieIndex,
                    } as DiscardEnergiePayload,
                  }
                  onAction(action)
                  setSelectedEnergieIndex(null)
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                🗑️ Défausser cette énergie
              </button>
            </div>
          </div>
        )}

        {selectedEnergieIndex === null && (
          <div className="text-white/60 text-center py-4">
            Sélectionnez une énergie à placer ou défausser
          </div>
        )}
      </div>
    )
  }

  // Phase: Appliquer un effet
  if (gameState.phase === 'waiting_effect') {
    const completedSituation = gameState.completedSituation

    if (!completedSituation) {
      return null
    }

    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
        <h3 className="text-white text-xl font-bold mb-4">⚡ Appliquez l'Effet</h3>

        <div className="mb-4">
          <div className="bg-green-500/20 border-2 border-green-500 text-white p-4 rounded-lg mb-4">
            <div className="font-bold mb-2">Situation complétée !</div>
            <div className="text-sm">
              {completedSituation.card.effect.name}: {completedSituation.card.effect.description}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => {
              const action: GameAction = {
                type: 'apply_effect',
                payload: {
                  situationType: completedSituation.type === 'common' ? 'common' :
                    completedSituation.type === 'player1_private' ? 'my_private' : 'opponent_private',
                  targetPlayer: amIPlayer1 ? 'player2' : 'player1',
                } as ApplyEffectPayload,
              }
              onAction(action)
            }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Appliquer l'effet sur l'adversaire
          </button>

          <button
            onClick={() => {
              const action: GameAction = {
                type: 'apply_effect',
                payload: {
                  situationType: completedSituation.type === 'common' ? 'common' :
                    completedSituation.type === 'player1_private' ? 'my_private' : 'opponent_private',
                  targetPlayer: amIPlayer1 ? 'player1' : 'player2',
                } as ApplyEffectPayload,
              }
              onAction(action)
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Appliquer l'effet sur moi
          </button>
        </div>
      </div>
    )
  }

  // Phase: Remplacer une situation
  if (gameState.phase === 'waiting_replacement') {
    const completedSituation = gameState.completedSituation

    if (!completedSituation) {
      return null
    }

    // Déterminer quel type de situation peut être remplacé
    const canReplaceCommon = completedSituation.type === 'common'
    const canReplacePrivate = completedSituation.type === (amIPlayer1 ? 'player1_private' : 'player2_private')

    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
        <h3 className="text-white text-xl font-bold mb-4">🔄 Remplacez la Situation</h3>

        <div className="mb-4">
          <div className="text-white text-sm mb-2">
            Choisissez une carte de votre main pour remplacer la situation complétée:
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {myPlayer.handSituationCards.map((card, index) => (
            <div
              key={index}
              onClick={() => setSelectedSituationIndex(index)}
              className={`cursor-pointer transition-transform ${
                selectedSituationIndex === index ? 'scale-105 ring-4 ring-yellow-400' : ''
              }`}
            >
              <SituationCard
                situation={{
                  situationCard: card,
                  placedEnergies: [],
                  playedBy: amIPlayer1 ? 'player1' : 'player2',
                }}
              />
            </div>
          ))}
        </div>

        {selectedSituationIndex !== null && (
          <div className="space-y-2">
            {canReplaceCommon && (
              <button
                onClick={() => {
                  const action: GameAction = {
                    type: 'replace_situation',
                    payload: {
                      situationType: 'common',
                      newSituationCardIndex: selectedSituationIndex,
                    } as ReplaceSituationPayload,
                  }
                  onAction(action)
                  setSelectedSituationIndex(null)
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Remplacer la Situation Commune
              </button>
            )}

            {canReplacePrivate && (
              <button
                onClick={() => {
                  const action: GameAction = {
                    type: 'replace_situation',
                    payload: {
                      situationType: 'my_private',
                      newSituationCardIndex: selectedSituationIndex,
                    } as ReplaceSituationPayload,
                  }
                  onAction(action)
                  setSelectedSituationIndex(null)
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Remplacer Ma Situation Privée
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  return null
}
