import { useState } from "react";

interface CreateSituationCardFormProps {
  onSubmit?: (data: SituationCardFormData) => void;
  onCancel?: () => void;
}

interface SituationCardFormData {
  effectId: string;
  frontImage: File | null;
  backImage: File | null;
}

const CreateSituationCardForm = ({
  onSubmit,
  onCancel,
}: CreateSituationCardFormProps) => {
  const [formData, setFormData] = useState<SituationCardFormData>({
    effectId: "",
    frontImage: null,
    backImage: null,
  });

  const [frontPreview, setFrontPreview] = useState<string>("");
  const [backPreview, setBackPreview] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
          htmlFor="effectId"
          className="block text-sm font-medium text-[#EBDFF0] mb-2"
        >
          ID de l'effet *
        </label>
        <input
          type="text"
          id="effectId"
          name="effectId"
          value={formData.effectId}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 bg-[#232029] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none focus:border-[#df93ff] transition-colors"
          placeholder="Ex: effect_001"
        />
        <p className="mt-1 text-sm text-[#EBDFF0] opacity-70">
          Identifiant unique de l'effet associé à cette carte
        </p>
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

export default CreateSituationCardForm;
