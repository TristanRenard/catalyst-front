import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { publicAPI } from "~/utils/publicAPI"

export const meta = () => {
  return [
    { title: "Bibliothèque - Catalyst" },
    { name: "description", content: "Gestion de la bibliothèque d'images" },
  ]
}

interface ImageItem {
  id: string
  url: string
  filename: string
  createdAt: string
}

const LibraryPage = () => {
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      setLoading(true)
      const apiSecret = localStorage.getItem('adminToken')
      const response = await publicAPI.get<ImageItem[] | { images: ImageItem[] }>(`/image`, {
        headers: {
          'X-API-Secret': apiSecret || '',
        },
      })
      const data = response.data
      setImages(Array.isArray(data) ? data : data.images || [])
      setError(null)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erreur lors du chargement des images")
      } else {
        setError("Une erreur inconnue est survenue")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        setError("Veuillez sélectionner uniquement des images")
        continue
      }
      await uploadImage(file)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const uploadImage = async (file: File) => {
    try {
      setUploading(true)
      setError(null)

      const formData = new FormData()
      formData.append('file', file)

      const apiSecret = localStorage.getItem('adminToken')
      await publicAPI.post(`/image/upload`, formData, {
        headers: {
          'X-API-Secret': apiSecret || '',
          'Content-Type': 'multipart/form-data',
        },
      })

      // Rafraîchir la liste
      fetchImages()
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erreur lors de l'upload de l'image")
      } else {
        setError("Une erreur inconnue est survenue")
      }
    } finally {
      setUploading(false)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files

    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        await uploadImage(file)
      }
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const deleteImage = async (imageId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) return

    try {
      const apiSecret = localStorage.getItem('adminToken')
      await publicAPI.delete(`/image/${imageId}`, {
        headers: {
          'X-API-Secret': apiSecret || '',
        },
      })
      fetchImages()
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erreur lors de la suppression")
      } else {
        setError("Une erreur inconnue est survenue")
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#EBDFF0]">
          Bibliothèque d'images
        </h1>
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
            ? 'border-[#df93ff] bg-[#2a2830]'
            : 'border-[#3a3840] hover:border-[#df93ff] hover:bg-[#2a2830]'
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#df93ff]"></div>
            <p className="mt-4 text-[#EBDFF0] opacity-70">
              Upload en cours...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-[#EBDFF0] opacity-40"
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
            <p className="mt-4 text-lg text-[#EBDFF0]">
              Cliquez ou glissez des images ici
            </p>
            <p className="mt-2 text-sm text-[#EBDFF0] opacity-70">
              PNG, JPG, GIF - Plusieurs fichiers supportés
            </p>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#df93ff]"></div>
          <p className="mt-4 text-[#EBDFF0] opacity-70">Chargement...</p>
        </div>
      )}

      {/* Images Grid */}
      {!loading && (
        <>
          {images.length === 0 ? (
            <div className="bg-[#2a2830] rounded-2xl border border-[#3a3840] p-12 text-center">
              <p className="text-[#EBDFF0] opacity-70">
                Aucune image dans la bibliothèque
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="bg-[#2a2830] rounded-xl border border-[#3a3840] overflow-hidden group relative hover:border-[#df93ff] transition-colors aspect-square"
                >
                  <img
                    src={`/api/image/${image.id}/thumbnail`}
                    alt={image.filename}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to original size if thumbnail fails
                      const target = e.target as HTMLImageElement
                      if (!target.src.endsWith(image.id)) {
                        target.src = `/api/image/${image.id}`
                      }
                    }}
                  />
                  {/* Delete button on hover */}
                  <button
                    onClick={() => deleteImage(image.id)}
                    className="absolute top-2 right-2 bg-red-900/80 hover:bg-red-900 text-red-200 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
              <p className="text-sm text-[#EBDFF0] opacity-70">
                Total : <span className="font-semibold text-[#df93ff]">{images.length}</span> image(s)
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default LibraryPage
