import { useState, useRef } from "react";
import axios from "axios";
import { publicAPI } from "~/utils/publicAPI"

interface ImageUploadProps {
  onUploadSuccess: (imageId: string, imageUrl: string) => void;
  label?: string;
}

export const ImageUpload = ({ onUploadSuccess, label = "Image" }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setError("Veuillez sélectionner une image valide");
      return;
    }

    // Créer une prévisualisation
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload vers MinIO
    await uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const apiSecret = localStorage.getItem('adminToken');
      const response = await publicAPI.post(`api/image/upload`, formData, {
        headers: {
          'X-API-Secret': apiSecret || '',
        },
      });

      const { id, url } = response.data;
      onUploadSuccess(id, url);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erreur lors de l'upload de l'image");
      } else {
        setError("Une erreur inconnue est survenue");
      }
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      await uploadImage(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
        {label}
      </label>

      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
          transition-colors duration-200
          ${uploading
            ? 'border-[#fe5c5c] bg-red-50 dark:bg-red-900/10'
            : 'border-gray-300 dark:border-gray-600 hover:border-[#fe5c5c] hover:bg-gray-50 dark:hover:bg-gray-800'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#fe5c5c]"></div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Upload en cours...
            </p>
          </div>
        ) : preview ? (
          <div className="flex flex-col items-center">
            <img
              src={preview}
              alt="Preview"
              className="max-h-32 rounded-lg object-contain"
            />
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              Image uploadée avec succès
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Cliquez ou glissez une image ici
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              PNG, JPG, GIF jusqu'à 10MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};
