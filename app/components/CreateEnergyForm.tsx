import { useState } from "react";

interface CreateEnergyFormProps {
  onSubmit?: (data: EnergyCardFormData) => void;
  onCancel?: () => void;
}

interface EnergyCardFormData {
  name: string;
  color: string;
  quota: number;
  frontImage: File | null;
  backImage: File | null;
}

const CreateEnergyForm = ({
  onSubmit,
  onCancel,
}: CreateEnergyFormProps) => {
  const [formData, setFormData] = useState<EnergyCardFormData>({
    name: "",
    color: "#000000",
    quota: 0,
    frontImage: null,
    backImage: null,
  });

  const [frontPreview, setFrontPreview] = useState<string>("");
  const [backPreview, setBackPreview] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quota" ? parseInt(value) || 0 : value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "back"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "front") {
          setFrontPreview(reader.result as string);
          setFormData((prev) => ({ ...prev, frontImage: file }));
        } else {
          setBackPreview(reader.result as string);
          setFormData((prev) => ({ ...prev, backImage: file }));
        }
      };
      reader.readAsDataURL(file);
    }
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

      <div>
        <label
          htmlFor="frontImage"
          className="block text-sm font-medium text-[#EBDFF0] mb-2"
        >
          Image avant de la carte *
        </label>
        <input
          type="file"
          id="frontImage"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "front")}
          required
          className="w-full px-4 py-2 bg-[#232029] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none focus:border-[#df93ff] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#df93ff] file:text-[#1a1820] file:font-semibold hover:file:bg-[#EBDFF0]"
        />
        {frontPreview && (
          <div className="mt-4">
            <img
              src={frontPreview}
              alt="Preview front"
              className="max-w-xs rounded-lg shadow-md"
            />
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="backImage"
          className="block text-sm font-medium text-[#EBDFF0] mb-2"
        >
          Image arrière de la carte *
        </label>
        <input
          type="file"
          id="backImage"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "back")}
          required
          className="w-full px-4 py-2 bg-[#232029] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none focus:border-[#df93ff] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#df93ff] file:text-[#1a1820] file:font-semibold hover:file:bg-[#EBDFF0]"
        />
        {backPreview && (
          <div className="mt-4">
            <img
              src={backPreview}
              alt="Preview back"
              className="max-w-xs rounded-lg shadow-md"
            />
          </div>
        )}
      </div>

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
