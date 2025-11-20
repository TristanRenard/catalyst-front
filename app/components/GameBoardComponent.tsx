import { useState } from "react"
import type { GameState, GameAction, Energie } from "~/types/socket"
import { EnergieCardDisplay } from "./EnergieCardDisplay"
import { SituationCardDisplay } from "./SituationCardDisplay"

interface GameBoardProps {
  gameState: GameState
  isMyTurn: boolean
  myPlayerId: string
  onGameAction: (action: GameAction) => void
}

export const GameBoardComponent = ({
  gameState,
  isMyTurn,
  myPlayerId,
  onGameAction
}: GameBoardProps) => {
  const [selectedEnergieIndex, setSelectedEnergieIndex] = useState<number | null>(null)
  const [selectedSituationIndex, setSelectedSituationIndex] = useState<number | null>(null)

  // Déterminer quel joueur je suis
  const isPlayer1 = gameState.player1.userId === myPlayerId
  const me = isPlayer1 ? gameState.player1 : gameState.player2
  const opponent = isPlayer1 ? gameState.player2 : gameState.player1
  const isMyTurnActive = (isPlayer1 && gameState.currentPlayer === "player1") || (!isPlayer1 && gameState.currentPlayer === "player2")

  // Phase actuelle
  const phase = gameState.phase

  // Actions disponibles selon la phase
  const canDrawEnergie = isMyTurnActive && phase === "drawing_energie" && me.handEnergieCards.length < 3
  const canPlaceOrDiscardEnergie = isMyTurnActive && phase === "placing_energie" && me.handEnergieCards.length > 0
  const needsToApplyEffect = isMyTurnActive && phase === "waiting_effect"
  const needsToReplaceSituation = isMyTurnActive && phase === "waiting_replacement"

  // Gérer la pioche d'énergie
  const handleDrawEnergie = (fromDiscard: boolean) => {
    if (!canDrawEnergie) return

    onGameAction({
      type: "draw_energie",
      payload: { fromDiscard }
    })
  }

  // Gérer la sélection d'une énergie
  const handleSelectEnergie = (index: number) => {
    if (!canPlaceOrDiscardEnergie) return
    setSelectedEnergieIndex(selectedEnergieIndex === index ? null : index)
  }

  // Placer une énergie sur une situation
  const handlePlaceEnergie = (targetSituation: "common" | "my_private" | "opponent_private") => {
    if (selectedEnergieIndex === null || !canPlaceOrDiscardEnergie) return

    onGameAction({
      type: "place_energie",
      payload: {
        energieCardIndex: selectedEnergieIndex,
        targetSituation
      }
    })

    setSelectedEnergieIndex(null)
  }

  // Défausser une énergie
  const handleDiscardEnergie = () => {
    if (selectedEnergieIndex === null || !canPlaceOrDiscardEnergie) return

    onGameAction({
      type: "discard_energie",
      payload: {
        energieCardIndex: selectedEnergieIndex
      }
    })

    setSelectedEnergieIndex(null)
  }

  // Appliquer un effet
  const handleApplyEffect = (targetPlayer: "player1" | "player2") => {
    if (!needsToApplyEffect || !gameState.completedSituation) return

    onGameAction({
      type: "apply_effect",
      payload: {
        situationType: gameState.completedSituation.type === "common" ? "common" :
                      gameState.completedSituation.type === "player1_private" ? "my_private" : "opponent_private",
        targetPlayer
      }
    })
  }

  // Remplacer une situation
  const handleReplaceSituation = () => {
    if (!needsToReplaceSituation || selectedSituationIndex === null || !gameState.completedSituation) return

    onGameAction({
      type: "replace_situation",
      payload: {
        situationType: gameState.completedSituation.type === "common" ? "common" : "my_private",
        newSituationCardIndex: selectedSituationIndex
      }
    })

    setSelectedSituationIndex(null)
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* En-tête: Informations adversaire */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-white font-bold">{opponent.username}</h3>
            <p className="text-gray-400 text-sm">Points: {opponent.points}</p>
          </div>
          <div className="flex gap-2">
            <div className="text-gray-400 text-sm">
              Main: {opponent.handSituationCards.length} situations, {opponent.handEnergieCards.length} énergies
            </div>
          </div>
        </div>
      </div>

      {/* Zone adversaire */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-white font-bold mb-3 text-center">Zone Adversaire</h3>
        <div className="flex justify-center">
          {opponent.privateSituationCard ? (
            <SituationCardDisplay
              situation={opponent.privateSituationCard}
              isPrivate
              showBack
              canPlaceEnergie={canPlaceOrDiscardEnergie && selectedEnergieIndex !== null}
              onPlaceEnergie={() => handlePlaceEnergie("opponent_private")}
            />
          ) : (
            <div className="w-48 h-64 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-500">
              Aucune situation
            </div>
          )}
        </div>
      </div>

      {/* Zone commune */}
      <div className="bg-gray-700/50 rounded-lg p-4">
        <h3 className="text-white font-bold mb-3 text-center">Situation Commune</h3>
        <div className="flex justify-center">
          {gameState.commonSituationCard ? (
            <SituationCardDisplay
              situation={gameState.commonSituationCard}
              canPlaceEnergie={canPlaceOrDiscardEnergie && selectedEnergieIndex !== null}
              onPlaceEnergie={() => handlePlaceEnergie("common")}
            />
          ) : (
            <div className="w-48 h-64 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-500">
              Aucune situation
            </div>
          )}
        </div>
      </div>

      {/* Zone joueur */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-white font-bold mb-3 text-center">Ma Zone</h3>
        <div className="flex justify-center">
          {me.privateSituationCard ? (
            <SituationCardDisplay
              situation={me.privateSituationCard}
              isPrivate
              canPlaceEnergie={canPlaceOrDiscardEnergie && selectedEnergieIndex !== null}
              onPlaceEnergie={() => handlePlaceEnergie("my_private")}
            />
          ) : (
            <div className="w-48 h-64 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-500">
              Aucune situation
            </div>
          )}
        </div>
      </div>

      {/* Pioches et défausse */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-bold mb-3">Pioches</h3>
        <div className="flex justify-around">
          <button
            onClick={() => handleDrawEnergie(false)}
            disabled={!canDrawEnergie}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-lg border-2
              ${canDrawEnergie ? "border-blue-500 hover:bg-blue-500/20 cursor-pointer" : "border-gray-600 opacity-50 cursor-not-allowed"}
            `}
          >
            <div className="w-16 h-24 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600">
              <span className="text-2xl">🃏</span>
            </div>
            <span className="text-white text-sm">Pioche Énergies ({gameState.energieDeck.length})</span>
          </button>

          <button
            onClick={() => handleDrawEnergie(true)}
            disabled={!canDrawEnergie || gameState.energieDiscard.length === 0}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-lg border-2
              ${canDrawEnergie && gameState.energieDiscard.length > 0 ? "border-green-500 hover:bg-green-500/20 cursor-pointer" : "border-gray-600 opacity-50 cursor-not-allowed"}
            `}
          >
            <div className="w-16 h-24 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600">
              {gameState.energieDiscard.length > 0 ? (
                <EnergieCardDisplay energie={gameState.energieDiscard[gameState.energieDiscard.length - 1]} size="small" />
              ) : (
                <span className="text-2xl">∅</span>
              )}
            </div>
            <span className="text-white text-sm">Défausse ({gameState.energieDiscard.length})</span>
          </button>
        </div>
      </div>

      {/* Main du joueur - Énergies */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-bold mb-3">Mes Énergies ({me.handEnergieCards.length}/3)</h3>
        <div className="flex justify-center gap-4">
          {me.handEnergieCards.map((energie, index) => (
            <EnergieCardDisplay
              key={index}
              energie={energie}
              selected={selectedEnergieIndex === index}
              onClick={() => handleSelectEnergie(index)}
              disabled={!canPlaceOrDiscardEnergie}
              size="large"
            />
          ))}
          {me.handEnergieCards.length === 0 && (
            <p className="text-gray-400">Aucune énergie en main</p>
          )}
        </div>

        {/* Bouton défausser */}
        {selectedEnergieIndex !== null && canPlaceOrDiscardEnergie && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleDiscardEnergie}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Défausser cette énergie
            </button>
          </div>
        )}
      </div>

      {/* Main du joueur - Situations */}
      {(needsToReplaceSituation || me.handSituationCards.length > 0) && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-white font-bold mb-3">
            Mes Cartes Situation ({me.handSituationCards.length}/5)
            {needsToReplaceSituation && <span className="text-yellow-400 ml-2">- Choisissez une carte pour remplacer</span>}
          </h3>
          <div className="flex justify-center gap-4 flex-wrap">
            {me.handSituationCards.map((situation, index) => (
              <button
                key={index}
                onClick={() => needsToReplaceSituation && setSelectedSituationIndex(index)}
                disabled={!needsToReplaceSituation}
                className={`
                  ${selectedSituationIndex === index ? "ring-4 ring-yellow-400" : ""}
                  ${needsToReplaceSituation ? "cursor-pointer hover:scale-105" : "cursor-default"}
                  transition-all
                `}
              >
                <SituationCardDisplay situation={situation} />
              </button>
            ))}
          </div>

          {needsToReplaceSituation && selectedSituationIndex !== null && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleReplaceSituation}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
              >
                Confirmer le remplacement
              </button>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {isMyTurnActive && (
        <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-4">
          <p className="text-white text-center font-bold">
            {canDrawEnergie && "🎯 Piochez une carte Énergie (pioche ou défausse)"}
            {canPlaceOrDiscardEnergie && !selectedEnergieIndex && "💡 Sélectionnez une Énergie à placer ou défausser"}
            {canPlaceOrDiscardEnergie && selectedEnergieIndex !== null && "🎴 Cliquez sur une Situation pour placer l'Énergie ou défaussez-la"}
            {needsToApplyEffect && "⚡ Appliquez l'effet de la situation complétée"}
            {needsToReplaceSituation && "🔄 Sélectionnez une nouvelle carte Situation pour remplacer"}
          </p>
        </div>
      )}

      {!isMyTurnActive && (
        <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
          <p className="text-gray-400 text-center">
            ⏳ En attente du tour de {opponent.username}...
          </p>
        </div>
      )}

      {/* Informations joueur */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-white font-bold">{me.username}</h3>
            <p className="text-gray-400 text-sm">Points: {me.points}</p>
          </div>
          <div className="text-right text-sm text-gray-400">
            <p>Tour {gameState.currentTurn}/{gameState.maxTurns}</p>
            <p className={isMyTurnActive ? "text-green-400 font-bold" : ""}>
              {isMyTurnActive ? "🟢 Votre tour" : "⏸️  Tour adversaire"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
