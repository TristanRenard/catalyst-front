import { Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { publicAPI } from "~/utils/publicAPI";

export const meta = () => {
  return [
    { title: "Bibliothèque - Catalyst" },
    { name: "description", content: "Gestion de la bibliothèque d'images" },
  ];
};

interface ImageItem {
  id: string;
  url: string;
  filename: string;
  createdAt: string;
}

const API_BASE_URL = 'http://localhost:5173/api';

const LibraryPage = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const apiSecret = localStorage.getItem('X-API-Secret');
      const response = await axios.get<ImageItem[] | { images: ImageItem[] }>(`${API_BASE_URL}/image`, {
        headers: {
          'X-API-Secret': apiSecret || '',
        },
      });
      const data = response.data;
      setImages(Array.isArray(data) ? data : data.images || []);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erreur lors du chargement des images");
      } else {
        setError("Une erreur inconnue est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        setError("Veuillez sélectionner uniquement des images");
        continue;
      }
      await uploadImage(file);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const apiSecret = localStorage.getItem('X-API-Secret');
      await publicAPI.post(`api/image/upload`, formData, {
        headers: {
          'X-API-Secret': apiSecret || '',
          'Content-Type': 'multipart/form-data',
        },
      });

      // Rafraîchir la liste
      fetchImages();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erreur lors de l'upload de l'image");
      } else {
        setError("Une erreur inconnue est survenue");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;

    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        await uploadImage(file);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const deleteImage = async (imageId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) return;

    try {
      const apiSecret = localStorage.getItem('X-API-Secret');
      await axios.delete(`${API_BASE_URL}/image/${imageId}`, {
        headers: {
          'X-API-Secret': apiSecret || '',
        },
      });
      fetchImages();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erreur lors de la suppression");
      } else {
        setError("Une erreur inconnue est survenue");
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Bibliothèque d'images
          </h1>
          <Link
            to="/admin"
            className="px-4 py-2 bg-[#fe5c5c] text-white font-semibold rounded-lg hover:bg-[#ff7676] transition-colors"
          >
            ← Retour
          </Link>
        </div>

        {/* Upload Zone */}
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`
            mb-8 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
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
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fe5c5c]"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Upload en cours...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-gray-400"
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
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Cliquez ou glissez des images ici
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                PNG, JPG, GIF - Plusieurs fichiers supportés
              </p>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#fe5c5c]"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
          </div>
        )}

        {/* Images Grid */}
        {!loading && (
          <>
            {images.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Aucune image dans la bibliothèque
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden group relative"
                  >
                    <div className="">
                      <img
                        src={`${API_BASE_URL}/image/${image.id}/thumbnail`}
                        alt={image.filename}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to original size if thumbnail fails
                          const target = e.target as HTMLImageElement;
                          if (!target.src.endsWith(image.id)) {
                            target.src = `${API_BASE_URL}/image/${image.id}`;
                          }
                        }}
                      />
                    </div>
                    {/* Delete button on hover */}
                    <button
                      onClick={() => deleteImage(image.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Stats Footer */}
            {images.length > 0 && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Total : <span className="font-semibold">{images.length}</span> image(s)
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default LibraryPage;
