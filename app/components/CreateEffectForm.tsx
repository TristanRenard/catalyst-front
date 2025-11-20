import { useState } from "react"

interface CreateEffectFormProps {
  onSubmit?: (data: EffectFormData) => void
  onCancel?: () => void
}

interface EffectFormData {
  name: string
  description: string
  type: string
  points: number
  slug: string
}

const CreateEffectForm = ({
  onSubmit,
  onCancel,
}: CreateEffectFormProps) => {
  const [formData, setFormData] = useState<EffectFormData>({
    name: "",
    description: "",
    type: "points",
    points: 0,
    slug: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "points" ? parseInt(value) || 0 : value,
    }))
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    setFormData((prev) => ({
      ...prev,
      name,
      slug,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-[#EBDFF0] mb-2"
        >
          Nom de l'effet *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleNameChange}
          required
          className="w-full px-4 py-2 bg-[#232029] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none focus:border-[#df93ff] transition-colors"
          placeholder="Ex: Bonus de points"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-[#EBDFF0] mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-2 bg-[#232029] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none focus:border-[#df93ff] transition-colors resize-none"
          placeholder="Description de l'effet..."
        />
      </div>

      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-[#EBDFF0] mb-2"
        >
          Type d'effet *
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 bg-[#232029] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none focus:border-[#df93ff] transition-colors"
        >
          <option value="points">Points</option>
          <option value="bonus">Bonus</option>
          <option value="malus">Malus</option>
          <option value="special">Spécial</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="points"
          className="block text-sm font-medium text-[#EBDFF0] mb-2"
        >
          Points *
        </label>
        <input
          type="number"
          id="points"
          name="points"
          value={formData.points}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 bg-[#232029] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none focus:border-[#df93ff] transition-colors"
          placeholder="Ex: 10"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-[#EBDFF0] mb-2"
        >
          Slug * <span className="text-xs opacity-70">(généré automatiquement)</span>
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleInputChange}
          required
          pattern="^[a-z0-9_-]+$"
          className="w-full px-4 py-2 bg-[#232029] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none focus:border-[#df93ff] transition-colors font-mono text-sm"
          placeholder="bonus-points"
        />
        <p className="mt-1 text-xs text-[#EBDFF0] opacity-50">
          Uniquement lettres minuscules, chiffres, tirets et underscores
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-[#df93ff] text-[#1a1820] py-3 px-6 rounded-lg hover:bg-[#EBDFF0] transition-colors font-semibold"
        >
          Créer l'effet
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

export default CreateEffectForm
