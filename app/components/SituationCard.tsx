import type { PlayedSituationCard } from '~/types/socket'
import EnergieCard from './EnergieCard'

interface SituationCardProps {
  situation: PlayedSituationCard
  onClick?: () => void
  selected?: boolean
}

export default function SituationCard({ situation, onClick, selected = false }: SituationCardProps) {
  return (
    <div
      className={`
        w-64 bg-white rounded-xl shadow-2xl overflow-hidden
        transition-all
        ${onClick ? 'cursor-pointer hover:scale-105' : ''}
        ${selected ? 'ring-4 ring-yellow-400' : ''}
      `}
      onClick={onClick}
    >
      {/* Image */}
      {situation.situationCard.card.frontImage && (
        <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <img
            src={situation.situationCard.card.frontImage}
            alt={situation.situationCard.effect.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Info */}
      <div className="p-4">
        <h4 className="font-bold text-lg mb-2">{situation.situationCard.effect.name}</h4>
        <p className="text-sm text-gray-600 mb-3">{situation.situationCard.effect.description}</p>

        {/* Énergies requises */}
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">Énergies requises:</div>
          <div className="flex gap-1 flex-wrap">
            {situation.situationCard.requiredEnergies.map((energie, index) => (
              <EnergieCard key={index} energie={energie} size="small" />
            ))}
          </div>
        </div>

        {/* Quota */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Quota:</span>
          <span className="font-bold text-red-600">{situation.situationCard.quota} points</span>
        </div>
      </div>
    </div>
  )
}
