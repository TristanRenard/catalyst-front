import { useState, useEffect } from "react"
import { useAdminToken } from "~/hooks/useAdminToken"
import { publicAPI } from "~/utils/publicAPI"
import { ImageLibrarySelector } from "./ImageLibrarySelector"
import type { Effect } from "~/types/effect"
import type { Energy } from "~/types/energy"

interface CreateSituationCardFormProps {
  onSubmit?: (data: SituationCardFormData) => void
  onCancel?: () => void
}

interface SituationCardFormData {
  effectId: string
  frontImage: string
  backImage: string
  quota: number
  energie1Id: string
  energie2Id: string
  energie3Id: string
  energie4Id: string
  energie5Id: string
}

const CreateSituationCardForm = ({
  onSubmit,
  onCancel,
}: CreateSituationCardFormProps) => {
  const adminToken = useAdminToken()
  const [formData, setFormData] = useState<SituationCardFormData>({
    effectId: "",
    frontImage: "",
    backImage: "",
    quota: 1,
    energie1Id: "",
    energie2Id: "",
    energie3Id: "",
    energie4Id: "",
    energie5Id: "",
  })

  const [effects, setEffects] = useState<Effect[]>([])
  const [energies, setEnergies] = useState<Energy[]>([])
  const [loadingEffects, setLoadingEffects] = useState(false)
  const [loadingEnergies, setLoadingEnergies] = useState(false)

  useEffect(() => {
    if (!adminToken) return
    fetchEffects()
    fetchEnergies()
  }, [adminToken])

  const fetchEffects = async () => {
    try {
      setLoadingEffects(true)
      const { data } = await publicAPI.get("/effect", {
        headers: { "X-API-Secret": adminToken || "" },
      })
      setEffects(data?.effects || [])
    } catch (err) {
      console.error("Erreur lors du chargement des effets", err)
    } finally {
      setLoadingEffects(false)
    }
  }

  const fetchEnergies = async () => {
    try {
      setLoadingEnergies(true)
      const { data } = await publicAPI.get("/energie", {
        headers: { "X-API-Secret": adminToken || "" },
      })
      setEnergies(data?.energies || [])
    } catch (err) {
      console.error("Erreur lors du chargement des énergies", err)
    } finally {
      setLoadingEnergies(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quota" ? parseInt(value) || 1 : value,
    }))
  }

  const handleFrontImageSelect = (imageId: string) => {
    setFormData((prev) => ({ ...prev, frontImage: imageId }))
  }

  const handleBackImageSelect = (imageId: string) => {
    setFormData((prev) => ({ ...prev, backImage: imageId }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Effet */}
      <div>
        <label
          htmlFor="effectId"
          className="block text-sm font-medium text-[#EBDFF0] mb-2"
        >
          Effet *
        </label>
        {loadingEffects ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#df93ff]"></div>
          </div>
        ) : (
          <select
            id="effectId"
            name="effectId"
            value={formData.effectId}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 bg-[#232029] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none focus:border-[#df93ff] transition-colors"
          >
            <option value="">Sélectionner un effet</option>
            {effects.map((effect) => (
              <option key={effect.id} value={effect.id}>
                {effect.name} ({effect.points} points)
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Quota */}
      <div>
        <label
          htmlFor="quota"
          className="block text-sm font-medium text-[#EBDFF0] mb-2"
        >
          Quota *
        </label>
        <input
          type="number"
          id="quota"
          name="quota"
          value={formData.quota}
          onChange={handleInputChange}
          required
          min="1"
          className="w-full px-4 py-2 bg-[#232029] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none focus:border-[#df93ff] transition-colors"
          placeholder="Ex: 1"
        />
      </div>

      {/* Images */}
      <ImageLibrarySelector
        label="Image avant de la carte *"
        onSelectImage={handleFrontImageSelect}
        selectedImageId={formData.frontImage || undefined}
      />

      <ImageLibrarySelector
        label="Image arrière de la carte *"
        onSelectImage={handleBackImageSelect}
        selectedImageId={formData.backImage || undefined}
      />

      {/* Énergies requises */}
      <div className="border-t border-[#3a3840] pt-6">
        <h3 className="text-lg font-semibold text-[#EBDFF0] mb-4">
          Énergies requises (5)
        </h3>

        {loadingEnergies ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#df93ff]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num}>
                <label
                  htmlFor={`energie${num}Id`}
                  className="block text-sm font-medium text-[#EBDFF0] mb-2"
                >
                  Énergie {num} *
                </label>
                <select
                  id={`energie${num}Id`}
                  name={`energie${num}Id`}
                  value={formData[`energie${num}Id` as keyof SituationCardFormData]}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-[#232029] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none focus:border-[#df93ff] transition-colors"
                >
                  <option value="">Sélectionner une énergie</option>
                  {energies.map((energy) => (
                    <option key={energy.id} value={energy.id}>
                      <span style={{ color: energy.color }}>●</span> {energy.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={!formData.frontImage || !formData.backImage || !formData.effectId}
          className="flex-1 bg-[#df93ff] text-[#1a1820] py-3 px-6 rounded-lg hover:bg-[#EBDFF0] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Créer la carte
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-[#2a2830] text-[#EBDFF0] py-3 px-6 rounded-lg hover:bg-[#3a3840] transition-colors font-medium"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  )
}

export default CreateSituationCardForm
