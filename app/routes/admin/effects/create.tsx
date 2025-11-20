import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router"
import CreateEffectForm from "~/components/CreateEffectForm"
import { publicAPI } from "~/utils/publicAPI"

const CreateEffectPage = () => {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true)
      setError(null)

      const apiSecret = localStorage.getItem('adminToken')
      await publicAPI.post('effect', {
        name: data.name,
        description: data.description,
        type: data.type,
        points: data.points,
        slug: data.slug
      }, {
        headers: {
          'X-API-Secret': apiSecret || '',
        },
      })

      navigate("/admin/effects")
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Erreur lors de la création de l'effet")
      } else {
        setError("Une erreur inconnue est survenue")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/admin/effects")
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#EBDFF0] mb-6">
        Créer un nouvel effet
      </h2>
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#df93ff]"></div>
          <p className="mt-4 text-[#8b8693]">Création en cours...</p>
        </div>
      ) : (
        <CreateEffectForm onSubmit={handleSubmit} onCancel={handleCancel} />
      )}
    </div>
  )
}

export default CreateEffectPage
