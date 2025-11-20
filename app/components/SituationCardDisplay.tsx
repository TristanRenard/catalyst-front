import type { PlayedSituationCard, SituationCardWithEnergies, Energie } from "~/types/socket"
import { EnergieCardDisplay } from "./EnergieCardDisplay"

interface SituationCardDisplayProps {
  situation: PlayedSituationCard | SituationCardWithEnergies
  isPrivate?: boolean
  canPlaceEnergie?: boolean
  onPlaceEnergie?: () => void
  showBack?: boolean
}

export const SituationCardDisplay = ({
  situation,
  isPrivate = false,
  canPlaceEnergie = false,
  onPlaceEnergie,
  showBack = false
}: SituationCardDisplayProps) => {
  const isPlayed = "placedEnergies" in situation
  const card = isPlayed ? situation.situationCard.card : situation.card
  const requiredEnergies = isPlayed ? situation.situationCard.requiredEnergies : situation.requiredEnergies
  const placedEnergies = isPlayed ? situation.placedEnergies : []
  const quota = isPlayed ? situation.situationCard.quota : situation.quota
  const effect = isPlayed ? situation.situationCard.effect : situation.effect

  const imageUrl = (showBack && isPrivate) ? card.backImage : card.frontImage
  const isComplete = placedEnergies.length === 5

  return (
    <div className="relative">
      {/* Carte principale */}
      <div
        className={`
          w-48 h-64 rounded-lg border-2 transition-all duration-200
          ${isComplete ? "border-green-500" : "border-gray-600"}
          ${canPlaceEnergie ? "hover:border-yellow-500 cursor-pointer" : ""}
          bg-cover bg-center relative overflow-hidden
        `}
        style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : undefined }}
        onClick={canPlaceEnergie ? onPlaceEnergie : undefined}
      >
        {/* Overlay pour les cartes privées cachées */}
        {showBack && isPrivate && (
          <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-4xl mb-2">❓</div>
              <p className="text-sm">Carte Privée</p>
            </div>
          </div>
        )}

        {/* Quota en haut à droite */}
        {!showBack && (
          <div className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
            {quota}
          </div>
        )}

        {/* Effet en bas (si visible) */}
        {!showBack && (
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900/90 p-2">
            <p className="text-white text-xs text-center">
              {effect.name}: {effect.description}
            </p>
          </div>
        )}
      </div>

      {/* Énergies requises */}
      <div className="mt-2 flex justify-center gap-1">
        {requiredEnergies.map((energie, index) => (
          <div key={index} className="relative">
            <EnergieCardDisplay
              energie={energie}
              size="small"
              disabled
            />
            {/* Marquer si cette énergie est déjà placée */}
            {placedEnergies.some(placed => placed.id === energie.id) && (
              <div className="absolute inset-0 bg-green-500/30 rounded-lg flex items-center justify-center">
                <div className="text-white text-xl">✓</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Indicateur de complétion */}
      <div className="mt-1 text-center text-sm">
        <span className={isComplete ? "text-green-400 font-bold" : "text-gray-400"}>
          {placedEnergies.length}/5 énergies
        </span>
      </div>
    </div>
  )
}
