import type { Energie } from "~/types/socket"

interface EnergieCardDisplayProps {
  energie: Energie
  onClick?: () => void
  selected?: boolean
  disabled?: boolean
  size?: "small" | "medium" | "large"
}

export const EnergieCardDisplay = ({
  energie,
  onClick,
  selected = false,
  disabled = false,
  size = "medium"
}: EnergieCardDisplayProps) => {
  const sizeClasses = {
    small: "w-12 h-16",
    medium: "w-16 h-24",
    large: "w-20 h-28"
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || !onClick}
      className={`
        ${sizeClasses[size]}
        rounded-lg border-2 transition-all duration-200
        ${selected ? "border-yellow-400 ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900" : "border-gray-600"}
        ${disabled ? "opacity-50 cursor-not-allowed" : onClick ? "hover:border-yellow-500 hover:scale-105 cursor-pointer" : "cursor-default"}
        flex flex-col items-center justify-center
        ${energie.backImage ? "bg-cover bg-center" : ""}
      `}
      style={{
        backgroundColor: energie.color,
        backgroundImage: energie.backImage ? `url(${energie.backImage})` : undefined
      }}
    >
      {energie.picto && (
        <img
          src={energie.picto}
          alt={energie.name}
          className="w-full h-full object-contain p-1"
        />
      )}
      {!energie.picto && (
        <span className="text-white font-bold text-xs text-center px-1">
          {energie.name}
        </span>
      )}
    </button>
  )
}
