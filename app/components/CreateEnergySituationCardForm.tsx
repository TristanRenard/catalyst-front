import { useState } from "react";

interface CreateEnergySituationCardFormProps {
  onSubmit?: (data: SituationCardFormData) => void;
  onCancel?: () => void;
}

interface SituationCardFormData {
  cardId: string;
  quota: number;
  energy1Id: string;
  energy2Id: string;
  energy3Id: string;
  energy4Id: string;
  energy5Id: string;
}

const CreateEnergySituationCardForm = ({
  onSubmit,
  onCancel,
}: CreateEnergySituationCardFormProps) => {
  const [formData, setFormData] = useState<SituationCardFormData>({
    cardId: "",
    quota: 0,
    energy1Id: "",
    energy2Id: "",
    energy3Id: "",
    energy4Id: "",
    energy5Id: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quota" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="cardId"
          className="block text-sm font-medium text-[#EBDFF0] mb-2"
        >
          ID de la carte *
        </label>
        <input
          type="text"
          id="cardId"
          name="cardId"
          value={formData.cardId}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 bg-[#232029] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none focus:border-[#df93ff] transition-colors"
          placeholder="Ex: card_001"
        />
      </div>

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
          min="0"
          className="w-full px-4 py-2 bg-[#232029] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none focus:border-[#df93ff] transition-colors"
          placeholder="Ex: 5"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="energy1Id"
            className="block text-sm font-medium text-[#EBDFF0] mb-2"
          >
            Énergie 1 ID
          </label>
          <input
            type="text"
            id="energy1Id"
            name="energy1Id"
            value={formData.energy1Id}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-[#232029] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none focus:border-[#df93ff] transition-colors"
            placeholder="Ex: energy_001"
          />
        </div>

        <div>
          <label
            htmlFor="energy2Id"
            className="block text-sm font-medium text-[#EBDFF0] mb-2"
          >
            Énergie 2 ID
          </label>
          <input
            type="text"
            id="energy2Id"
            name="energy2Id"
            value={formData.energy2Id}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-[#232029] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none focus:border-[#df93ff] transition-colors"
            placeholder="Ex: energy_002"
          />
        </div>

        <div>
          <label
            htmlFor="energy3Id"
            className="block text-sm font-medium text-[#EBDFF0] mb-2"
          >
            Énergie 3 ID
          </label>
          <input
            type="text"
            id="energy3Id"
            name="energy3Id"
            value={formData.energy3Id}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-[#232029] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none focus:border-[#df93ff] transition-colors"
            placeholder="Ex: energy_003"
          />
        </div>

        <div>
          <label
            htmlFor="energy4Id"
            className="block text-sm font-medium text-[#EBDFF0] mb-2"
          >
            Énergie 4 ID
          </label>
          <input
            type="text"
            id="energy4Id"
            name="energy4Id"
            value={formData.energy4Id}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-[#232029] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none focus:border-[#df93ff] transition-colors"
            placeholder="Ex: energy_004"
          />
        </div>

        <div>
          <label
            htmlFor="energy5Id"
            className="block text-sm font-medium text-[#EBDFF0] mb-2"
          >
            Énergie 5 ID
          </label>
          <input
            type="text"
            id="energy5Id"
            name="energy5Id"
            value={formData.energy5Id}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-[#232029] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none focus:border-[#df93ff] transition-colors"
            placeholder="Ex: energy_005"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-[#df93ff] text-[#1a1820] py-3 px-6 rounded-lg hover:bg-[#EBDFF0] transition-colors font-semibold"
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
  );
};

export default CreateEnergySituationCardForm;
