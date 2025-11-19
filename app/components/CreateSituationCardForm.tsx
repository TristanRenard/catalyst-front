import { useState, useEffect } from "react";
import axios from "axios";

interface CreateSituationCardFormProps {
  onSubmit?: (data: SituationCardFormData) => void;
  onCancel?: () => void;
}

interface SituationCardFormData {
  effectId: string;
  frontImage: string;
  backImage: string;
}

interface ImageItem {
  id: string;
  url: string;
  filename: string;
}

const API_BASE_URL = 'http://localhost:5173/api';

const CreateSituationCardForm = ({
  onSubmit,
  onCancel,
}: CreateSituationCardFormProps) => {
  const [formData, setFormData] = useState<SituationCardFormData>({
    effectId: "",
    frontImage: "",
    backImage: "",
  });

  const [libraryImages, setLibraryImages] = useState<ImageItem[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [selectingFor, setSelectingFor] = useState<'front' | 'back' | null>(null);

  useEffect(() => {
    fetchLibraryImages();
  }, []);

  const fetchLibraryImages = async () => {
    try {
      setLoadingImages(true);
      const apiSecret = localStorage.getItem('X-API-Secret');
      const response = await axios.get<ImageItem[] | { images: ImageItem[] }>(`${API_BASE_URL}/image`, {
        headers: {
          'X-API-Secret': apiSecret || '',
        },
      });
      const data = response.data;
      setLibraryImages(Array.isArray(data) ? data : data.images || []);
    } catch (err) {
      console.error("Erreur lors du chargement des images", err);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectImage = (imageId: string) => {
    if (selectingFor === 'front') {
      setFormData({ ...formData, frontImage: imageId });
    } else if (selectingFor === 'back') {
      setFormData({ ...formData, backImage: imageId });
    }
    setSelectingFor(null);
  };

  const getImageUrl = (imageId: string) => {
    return `${API_BASE_URL}/image/${imageId}/thumbnail`;
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
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
        >
          ID de l'effet (optionnel)
        </label>
        <input
          type="text"
          id="effectId"
          name="effectId"
          value={formData.effectId}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#fe5c5c] focus:border-transparent"
          placeholder="Ex: effect_001"
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Identifiant unique de l'effet associé à cette carte
        </p>
      </div>

      {/* Image Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Front Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Image Face *
          </label>
          {formData.frontImage ? (
            <div className="relative">
              <img
                src={getImageUrl(formData.frontImage)}
                alt="Front"
                className="w-full h-100 object-cover rounded-lg border-2 border-[#fe5c5c]"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, frontImage: '' })}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSelectingFor('front')}
              className={`w-full h-100 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
                selectingFor === 'front'
                  ? 'border-[#fe5c5c] bg-red-50 dark:bg-red-900/10'
                  : 'border-gray-300 dark:border-gray-600 hover:border-[#fe5c5c]'
              }`}
            >
              <span className="text-gray-500 dark:text-gray-400">
                {selectingFor === 'front' ? 'Sélectionnez une image ci-dessous' : 'Cliquez pour sélectionner'}
              </span>
            </button>
          )}
        </div>

        {/* Back Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Image Dos *
          </label>
          {formData.backImage ? (
            <div className="relative">
              <img
                src={getImageUrl(formData.backImage)}
                alt="Back"
                className="w-full h-100 object-cover rounded-lg border-2 border-[#fe5c5c]"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, backImage: '' })}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSelectingFor('back')}
              className={`w-full h-100 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
                selectingFor === 'back'
                  ? 'border-[#fe5c5c] bg-red-50 dark:bg-red-900/10'
                  : 'border-gray-300 dark:border-gray-600 hover:border-[#fe5c5c]'
              }`}
            >
              <span className="text-gray-500 dark:text-gray-400">
                {selectingFor === 'back' ? 'Sélectionnez une image ci-dessous' : 'Cliquez pour sélectionner'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Library Images Grid */}
      {selectingFor && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
            Bibliothèque d'images - Sélectionnez pour {selectingFor === 'front' ? 'Image Face' : 'Image Dos'}
          </h3>
          {loadingImages ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#fe5c5c]"></div>
            </div>
          ) : libraryImages.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                Aucune image disponible. Ajoutez des images dans la bibliothèque.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3 max-h-60 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {libraryImages.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => selectImage(image.id)}
                  className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-[#fe5c5c] transition-colors focus:outline-none focus:border-[#fe5c5c]"
                >
                  <img
                    src={`${API_BASE_URL}/image/${image.id}/thumbnail`}
                    alt={image.filename}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={!formData.frontImage || !formData.backImage}
          className="flex-1 bg-[#fe5c5c] text-white py-3 px-6 rounded-lg hover:bg-[#ff7676] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Créer la carte
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default CreateSituationCardForm;
