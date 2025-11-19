import { useState } from "react";
import { ImageLibrarySelector } from "./ImageLibrarySelector";

interface CreateEnergyFormProps {
  onSubmit?: (data: EnergyCardFormData) => void;
  onCancel?: () => void;
}

interface EnergyCardFormData {
  name: string;
  color: string;
  quota: number;
  frontImageId: string | null;
  backImageId: string | null;
}

const CreateEnergyForm = ({
  onSubmit,
  onCancel,
}: CreateEnergyFormProps) => {
  const [formData, setFormData] = useState<EnergyCardFormData>({
    name: "",
    color: "#000000",
    quota: 0,
    frontImageId: null,
    backImageId: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quota" ? parseInt(value) || 0 : value,
    }));
  };

  const handleFrontImageSelect = (imageId: string) => {
    setFormData((prev) => ({ ...prev, frontImageId: imageId }));
  };

  const handleBackImageSelect = (imageId: string) => {
    setFormData((prev) => ({ ...prev, backImageId: imageId }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-[#EBDFF0] mb-2"
        >
          Nom de la carte *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 bg-[#232029] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none focus:border-[#df93ff] transition-colors"
          placeholder="Ex: Énergie solaire"
        />
      </div>

      <div>
        <label
          htmlFor="color"
          className="block text-sm font-medium text-[#EBDFF0] mb-2"
        >
          Couleur *
        </label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            className="h-12 w-24 rounded cursor-pointer"
          />
          <span className="text-[#EBDFF0]">{formData.color}</span>
        </div>
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
          placeholder="Ex: 10"
        />
      </div>

      <ImageLibrarySelector
        label="Image avant de la carte"
        onSelectImage={handleFrontImageSelect}
        selectedImageId={formData.frontImageId || undefined}
      />

      <ImageLibrarySelector
        label="Image arrière de la carte"
        onSelectImage={handleBackImageSelect}
        selectedImageId={formData.backImageId || undefined}
      />

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-[#df93ff] text-[#1a1820] py-3 px-6 rounded-lg hover:bg-[#EBDFF0] transition-colors font-semibold"
        >
          Créer l'énergie
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

export default CreateEnergyForm;
