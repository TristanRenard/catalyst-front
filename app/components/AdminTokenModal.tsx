import { useState } from "react";

interface AdminTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminTokenModal = ({ isOpen, onClose }: AdminTokenModalProps) => {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      setError("Le token est requis");
      return;
    }

    localStorage.setItem("adminToken", token);
    
    window.dispatchEvent(new Event("adminTokenChange"));
    
    setToken("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setToken("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          🔐 Authentification Admin
        </h2>
        <p className="text-gray-600 mb-6">
          Veuillez entrer votre token d'administration pour accéder à cette page.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
              Token Admin
            </label>
            <input
              id="token"
              type="password"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Entrez votre token..."
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Valider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminTokenModal;
