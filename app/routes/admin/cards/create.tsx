import { useState } from "react"
import { useNavigate } from "react-router"
import CreateSituationCardForm from "~/components/CreateSituationCardForm"
import { useAdminToken } from "~/hooks/useAdminToken"
import { publicAPI } from "~/utils/publicAPI"

export const meta = () => {
  return [{ title: "Créer une carte - Catalyst" }]
}

const CreateCardPage = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const adminToken = useAdminToken()
  const navigate = useNavigate()

  const handleSituationCardSubmit = async (data: any) => {
    try {
      setLoading(true)
      setError(null)

      await publicAPI.post(
        "/situation-card",
        {
          effectId: data.effectId,
          backImage: data.backImage,
          frontImage: data.frontImage,
          quota: data.quota,
          energie1Id: data.energie1Id,
          energie2Id: data.energie2Id,
          energie3Id: data.energie3Id,
          energie4Id: data.energie4Id,
          energie5Id: data.energie5Id,
        },
        {
          headers: {
            "X-API-Secret": adminToken || "",
          },
        }
      )

      setSuccess(true)
      setTimeout(() => {
        navigate("/admin/cards")
      }, 1500)
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Erreur lors de la création de la carte situation"
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/admin/cards")
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#EBDFF0] mb-8">
        Créer une carte situation
      </h1>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-4">
          Carte créée avec succès ! Redirection...
        </div>
      )}

      <div className="max-w-2xl">
        <div className="bg-[#2a2830] p-6 rounded-lg border border-[#3a3840]">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#df93ff]"></div>
              <p className="mt-4 text-[#EBDFF0] opacity-70">
                Création en cours...
              </p>
            </div>
          ) : (
            <CreateSituationCardForm
              onSubmit={handleSituationCardSubmit}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateCardPage
