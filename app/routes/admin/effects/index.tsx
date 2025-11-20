import { useEffect, useState } from "react"
import { Link } from "react-router"
import { useAdminToken } from "~/hooks/useAdminToken"
import type { Effect } from "~/types/effect"
import { publicAPI } from "~/utils/publicAPI"

export const meta = () => {
  return [{ title: "Effets - Catalyst" }]
}

const EffectsPage = () => {
  const [effects, setEffects] = useState<Effect[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const adminToken = useAdminToken()

  useEffect(() => {
    if (!adminToken) return

    fetchEffects()
  }, [adminToken])

  const fetchEffects = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await publicAPI.get("/effect", {
        headers: {
          "X-API-Secret": adminToken || "",
        },
      })
      setEffects(data ? data.effects : [])
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erreur lors du chargement des effets")
      } else {
        setError("Une erreur inconnue est survenue")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet effet ?")) return

    try {
      await publicAPI.delete(`/effect/${id}`, {
        headers: {
          "X-API-Secret": adminToken || "",
        },
      })
      fetchEffects()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erreur lors de la suppression de l'effet")
      } else {
        setError("Une erreur inconnue est survenue")
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#EBDFF0]">
          Gestion des Effets
        </h1>
        <Link
          to="/admin/effects/create"
          className="bg-[#df93ff] hover:bg-[#c77de8] text-[#1a1820] font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          + Créer un effet
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

      {!loading && !error && effects.length === 0 && (
        <div className="bg-[#2a2830] rounded-2xl border border-[#3a3840] p-8 text-center">
          <p className="text-[#EBDFF0] opacity-70">Aucun effet disponible.</p>
          <Link
            to="/admin/effects/create"
            className="inline-block mt-4 text-[#df93ff] hover:text-[#c77de8] transition-colors"
          >
            Créer votre premier effet →
          </Link>
        </div>
      )}

      {!loading && !error && effects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {effects.map((effect) => (
            <div
              key={effect.id}
              className="bg-[#2a2830] rounded-2xl border border-[#3a3840] overflow-hidden hover:border-[#df93ff] transition-colors"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#EBDFF0] mb-2">
                      {effect.name}
                    </h3>
                    <p className="text-sm text-[#EBDFF0] opacity-70 mb-3">
                      {effect.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#EBDFF0] opacity-70">Type:</span>
                    <span className="text-[#df93ff] font-semibold">
                      {effect.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#EBDFF0] opacity-70">Points:</span>
                    <span className="text-[#df93ff] font-semibold">
                      {effect.points}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#EBDFF0] opacity-70">Slug:</span>
                    <code className="text-[#df93ff] font-mono text-xs bg-[#232029] px-2 py-1 rounded">
                      {effect.slug}
                    </code>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-[#3a3840]">
                  <button
                    onClick={() => handleDelete(effect.id)}
                    className="flex-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
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

export default EffectsPage
