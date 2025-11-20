import type { Energie } from '~/types/socket'

interface EnergieCardProps {
  energie: Energie
  size?: 'small' | 'medium' | 'large'
  selected?: boolean
  onClick?: () => void
}

export default function EnergieCard({ energie, size = 'medium', selected = false, onClick }: EnergieCardProps) {
  const sizeClasses = {
    small: 'w-16 h-20 text-xs',
    medium: 'w-24 h-32 text-sm',
    large: 'w-32 h-40 text-base',
  }

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-lg shadow-lg
        flex flex-col items-center justify-center
        transition-all cursor-pointer
        ${selected ? 'ring-4 ring-yellow-400 scale-105' : 'hover:scale-105'}
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
      `}
      style={{ backgroundColor: energie.color }}
      onClick={onClick}
    >
      {energie.picto && (
        <div className="text-4xl mb-2">{energie.picto}</div>
      )}
      <div className="text-white font-bold text-center px-2">
        {energie.name}
      </div>
    </div>
  )
}
