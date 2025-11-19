import { useState, useEffect } from "react";
import axios from "axios";

interface ImageItem {
  id: string;
  url: string;
  filename: string;
  createdAt: string;
}

interface ImageLibrarySelectorProps {
  onSelectImage: (imageId: string) => void;
  selectedImageId?: string;
  label: string;
}

const API_BASE_URL = 'http://localhost:5173/api';

export const ImageLibrarySelector = ({
  onSelectImage,
  selectedImageId,
  label,
}: ImageLibrarySelectorProps) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      fetchImages();
    }
  }, [isModalOpen]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const apiSecret = localStorage.getItem('adminToken');
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

  const handleSelectImage = (imageId: string) => {
    onSelectImage(imageId);
    setIsModalOpen(false);
  };

  const selectedImage = images.find(img => img.id === selectedImageId);

  return (
    <div>
      <label className="block text-sm font-medium text-[#EBDFF0] mb-2">
        {label} *
      </label>

      <div
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer border-2 border-[#3a3840] rounded-lg p-4 bg-[#232029] hover:border-[#df93ff] transition-colors"
      >
        {selectedImageId && selectedImage ? (
          <div className="flex items-center gap-4">
            <img
              src={`${API_BASE_URL}/image/${selectedImageId}/thumbnail`}
              alt={selectedImage.filename}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <p className="text-[#EBDFF0] font-medium">Image sélectionnée</p>
              <p className="text-[#8b8693] text-sm">{selectedImage.filename}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-[#8b8693]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Cliquez pour choisir une image</span>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1820] rounded-2xl shadow-2xl max-w-5xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-[#3a3840] flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#EBDFF0]">
                Bibliothèque d'images
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#8b8693] hover:text-[#EBDFF0] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#df93ff]"></div>
                  <p className="mt-4 text-[#8b8693]">Chargement...</p>
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#8b8693]">Aucune image disponible</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      onClick={() => handleSelectImage(image.id)}
                      className={`
                        relative rounded-lg overflow-hidden cursor-pointer
                        border-2 transition-all hover:scale-105
                        ${selectedImageId === image.id
                          ? 'border-[#df93ff] ring-2 ring-[#df93ff]/50'
                          : 'border-[#3a3840] hover:border-[#df93ff]'
                        }
                      `}
                    >
                      <img
                        src={`${API_BASE_URL}/image/${image.id}/thumbnail`}
                        alt={image.filename}
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.src.endsWith(image.id)) {
                            target.src = `${API_BASE_URL}/image/${image.id}`;
                          }
                        }}
                      />
                      {selectedImageId === image.id && (
                        <div className="absolute top-2 right-2 bg-[#df93ff] text-[#1a1820] rounded-full p-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
