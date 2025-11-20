import type { GameState, PlayedSituationCard, Energie } from '~/types/socket'
import { isSituationCompleted } from '~/utils/gameLogic'
import EnergieCard from './EnergieCard'
import SituationCard from './SituationCard'

interface GameBoardProps {
  gameState: GameState
  myUserId: string
}

export default function GameBoard({ gameState, myUserId }: GameBoardProps) {
  const amIPlayer1 = gameState.player1.userId === myUserId
  const myPrivateSituation = amIPlayer1 ? gameState.player1.privateSituationCard : gameState.player2.privateSituationCard
  const opponentPrivateSituation = amIPlayer1 ? gameState.player2.privateSituationCard : gameState.player1.privateSituationCard

  return (
    <div className="mb-6 space-y-6">
      {/* Situation Privée Adversaire */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
        <h3 className="text-white text-lg font-semibold mb-4">
          🎭 Situation Privée Adversaire (Face cachée)
        </h3>
        {opponentPrivateSituation ? (
          <div className="flex gap-4">
            {/* Carte de dos (on ne voit pas le contenu) */}
            <div className="w-48 h-64 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg shadow-lg flex items-center justify-center border-2 border-white/20">
              <div className="text-white text-6xl">?</div>
            </div>

            {/* Énergies placées */}
            <div className="flex-1">
              <div className="text-white/80 text-sm mb-2">
                Énergies placées: {opponentPrivateSituation.placedEnergies.length}/5
              </div>
              <div className="flex gap-2 flex-wrap">
                {opponentPrivateSituation.placedEnergies.map((energie, index) => (
                  <EnergieCard key={index} energie={energie} size="small" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-white/60 text-center py-8">Aucune situation</div>
        )}
      </div>

      {/* Situation Commune */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
        <h3 className="text-white text-lg font-semibold mb-4">
          🌍 Situation Commune
        </h3>
        {gameState.commonSituationCard ? (
          <div className="flex gap-4">
            <SituationCard situation={gameState.commonSituationCard} />
            <div className="flex-1">
              <div className="text-white/80 text-sm mb-2">
                Énergies placées: {gameState.commonSituationCard.placedEnergies.length}/5
              </div>
              <div className="flex gap-2 flex-wrap mb-4">
                {gameState.commonSituationCard.placedEnergies.map((energie, index) => (
                  <EnergieCard key={index} energie={energie} size="small" />
                ))}
              </div>
              {isSituationCompleted(gameState.commonSituationCard) && (
                <div className="bg-green-500/20 border-2 border-green-500 text-green-300 p-2 rounded text-center">
                  ✅ Complétée !
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-white/60 text-center py-8">Aucune situation</div>
        )}
      </div>

      {/* Ma Situation Privée */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
        <h3 className="text-white text-lg font-semibold mb-4">
          🔒 Ma Situation Privée
        </h3>
        {myPrivateSituation ? (
          <div className="flex gap-4">
            <SituationCard situation={myPrivateSituation} />
            <div className="flex-1">
              <div className="text-white/80 text-sm mb-2">
                Énergies placées: {myPrivateSituation.placedEnergies.length}/5
              </div>
              <div className="flex gap-2 flex-wrap mb-4">
                {myPrivateSituation.placedEnergies.map((energie, index) => (
                  <EnergieCard key={index} energie={energie} size="small" />
                ))}
              </div>
              {isSituationCompleted(myPrivateSituation) && (
                <div className="bg-green-500/20 border-2 border-green-500 text-green-300 p-2 rounded text-center">
                  ✅ Complétée !
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-white/60 text-center py-8">Aucune situation</div>
        )}
      </div>

      {/* Deck Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 backdrop-blur-md rounded-lg p-4">
          <div className="text-white/60 text-sm mb-1">Pioche Situations</div>
          <div className="text-white font-bold text-2xl">
            {gameState.situationDeck.length} 🎴
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-lg p-4">
          <div className="text-white/60 text-sm mb-1">Pioche Énergies</div>
          <div className="text-white font-bold text-2xl">
            {gameState.energieDeck.length} ⚡
          </div>
        </div>
      </div>

      {/* Défausse Énergies */}
      {gameState.energieDiscard.length > 0 && (
        <div className="bg-white/5 backdrop-blur-md rounded-lg p-4">
          <div className="text-white/60 text-sm mb-2">
            Défausse Énergies ({gameState.energieDiscard.length})
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {gameState.energieDiscard.slice(-5).map((energie, index) => (
              <EnergieCard key={index} energie={energie} size="small" />
            ))}
            {gameState.energieDiscard.length > 5 && (
              <div className="text-white/60 text-sm self-center">
                +{gameState.energieDiscard.length - 5} autres...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
