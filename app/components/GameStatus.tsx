import type { GameState } from '~/types/socket'

interface GameStatusProps {
  gameState: GameState
  myUserId: string
  isMyTurn: boolean
  error: string | null
}

export default function GameStatus({ gameState, myUserId, isMyTurn, error }: GameStatusProps) {
  const getPhaseMessage = () => {
    switch (gameState.phase) {
      case 'setup':
        return 'Mise en place de la partie...'
      case 'drawing_energie':
        return isMyTurn ? '📥 Piochez une carte Énergie' : '⏳ L\'adversaire pioche une énergie'
      case 'placing_energie':
        return isMyTurn ? '🎯 Placez ou défaussez une Énergie' : '⏳ L\'adversaire joue'
      case 'waiting_effect':
        return isMyTurn ? '⚡ Appliquez l\'effet de la situation complétée' : '⏳ L\'adversaire applique un effet'
      case 'waiting_replacement':
        return isMyTurn ? '🔄 Remplacez la situation complétée' : '⏳ L\'adversaire remplace une situation'
      case 'game_over':
        return '🏁 Partie terminée !'
      default:
        return 'En jeu...'
    }
  }

  const amIPlayer1 = gameState.player1.userId === myUserId
  const myPlayer = amIPlayer1 ? gameState.player1 : gameState.player2
  const opponentPlayer = amIPlayer1 ? gameState.player2 : gameState.player1

  return (
    <div className="mb-6 space-y-4">
      {/* Phase actuelle */}
      <div className={`text-center p-4 rounded-lg ${isMyTurn ? 'bg-green-500/20 border-2 border-green-500' : 'bg-white/10'}`}>
        <div className="text-white text-xl font-semibold">
          {getPhaseMessage()}
        </div>
        {isMyTurn && (
          <div className="text-green-300 text-sm mt-1">
            C'est votre tour !
          </div>
        )}
      </div>

      {/* Erreur */}
      {error && (
        <div className="bg-red-500/20 border-2 border-red-500 text-white p-4 rounded-lg text-center">
          ❌ {error}
        </div>
      )}

      {/* Info joueurs */}
      <div className="grid grid-cols-2 gap-4">
        {/* Moi */}
        <div className={`bg-white/10 backdrop-blur-md rounded-lg p-4 ${isMyTurn ? 'ring-2 ring-green-500' : ''}`}>
          <div className="text-white/60 text-sm mb-1">Vous</div>
          <div className="text-white font-bold text-lg">{myPlayer.username}</div>
          <div className="mt-2 space-y-1 text-sm">
            <div className="text-white/80">
              🎴 Situations: {myPlayer.handSituationCards.length}
            </div>
            <div className="text-white/80">
              ⚡ Énergies: {myPlayer.handEnergieCards.length}/3
            </div>
            {myPlayer.points > 0 && (
              <div className="text-red-400 font-bold">
                📊 Points: {myPlayer.points}
              </div>
            )}
          </div>
        </div>

        {/* Adversaire */}
        <div className={`bg-white/10 backdrop-blur-md rounded-lg p-4 ${!isMyTurn && gameState.phase !== 'game_over' ? 'ring-2 ring-yellow-500' : ''}`}>
          <div className="text-white/60 text-sm mb-1">Adversaire</div>
          <div className="text-white font-bold text-lg">{opponentPlayer.username}</div>
          <div className="mt-2 space-y-1 text-sm">
            <div className="text-white/80">
              🎴 Situations: {opponentPlayer.handSituationCards.length}
            </div>
            <div className="text-white/80">
              ⚡ Énergies: {opponentPlayer.handEnergieCards.length}/3
            </div>
            {opponentPlayer.points > 0 && (
              <div className="text-red-400 font-bold">
                📊 Points: {opponentPlayer.points}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
