import { useEffect, useState } from "react"
import { Link } from "react-router"
import type { SituationCard } from "~/types/cards"
import { useAdminToken } from "~/hooks/useAdminToken"
import { publicAPI } from "~/utils/publicAPI"

export const meta = () => {
  return [{ title: "Cartes - Catalyst" }]
}

const CardsPage = () => {
  const [situationCards, setSituationCards] = useState<SituationCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const adminToken = useAdminToken()

  useEffect(() => {
    if (!adminToken) return

    fetchCards()
  }, [adminToken])

  const fetchCards = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data } = await publicAPI.get("/situation-card", {
        headers: { "X-API-Secret": adminToken || "" },
      })

      setSituationCards(data?.situationCards || [])
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erreur lors du chargement des cartes")
      } else {
        setError("Une erreur inconnue est survenue")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette carte ?")) return

    try {
      await publicAPI.delete(`/situation-card/${id}`, {
        headers: {
          "X-API-Secret": adminToken || "",
        },
      })
      fetchCards()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erreur lors de la suppression de la carte")
      } else {
        setError("Une erreur inconnue est survenue")
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#EBDFF0]">
          Gestion des Cartes Situation
        </h1>
        <Link
          to="/admin/cards/create"
          className="bg-[#df93ff] hover:bg-[#c77de8] text-[#1a1820] font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          + Créer une carte
        </Link>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#df93ff]"></div>
          <p className="mt-4 text-[#EBDFF0] opacity-70">Chargement...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {!loading && !error && situationCards.length === 0 && (
        <div className="bg-[#2a2830] rounded-2xl border border-[#3a3840] p-8 text-center">
          <p className="text-[#EBDFF0] opacity-70">
            Aucune carte situation disponible.
          </p>
          <Link
            to="/admin/cards/create"
            className="inline-block mt-4 text-[#df93ff] hover:text-[#c77de8] transition-colors"
          >
            Créer votre première carte →
          </Link>
        </div>
      )}

      {!loading && !error && situationCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {situationCards.map((card) => (
            <div
              key={card.id}
              className="bg-[#2a2830] rounded-2xl border border-[#3a3840] overflow-hidden hover:border-[#df93ff] transition-colors"
            >
              <div className="aspect-3/4 relative bg-[#232029]">
                {card.frontImage ? (
                  <img
                    src={`/api/image/${card.frontImage}`}
                    alt={`Carte ${card.id}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#EBDFF0] opacity-30">
                    Pas d'image
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#EBDFF0] opacity-70">Effet:</span>
                    <span className="text-[#df93ff] font-mono text-xs">
                      {card.effect?.name || card.effectId}
                    </span>
                  </div>
                  {card.effect && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#EBDFF0] opacity-70">Points:</span>
                      <span className="text-[#df93ff] font-semibold">
                        {card.effect.points}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#EBDFF0] opacity-70">Quota:</span>
                    <span className="text-[#df93ff] font-semibold">
                      {card.quota}
                    </span>
                  </div>
                </div>

                {/* Énergies requises */}
                {card.requiredEnergies && card.requiredEnergies.length > 0 && (
                  <div className="mb-4 pb-4 border-b border-[#3a3840]">
                    <div className="text-xs text-[#EBDFF0] opacity-70 mb-2">
                      Énergies requises:
                    </div>
                    <div className="flex gap-1">
                      {card.requiredEnergies.map((energy, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full border border-white/30"
                          style={{ backgroundColor: energy.color }}
                          title={energy.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-[#3a3840]">
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="w-full bg-red-900/30 hover:bg-red-900/50 text-red-400 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CardsPage
