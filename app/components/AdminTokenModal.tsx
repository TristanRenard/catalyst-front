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
      <div className="bg-[#1a1820] rounded-2xl shadow-xl p-6 w-full max-w-md border border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-[#EBDFF0]">
          🔐 Authentification Admin
        </h2>
        <p className="text-[#EBDFF0] opacity-80 mb-6">
          Veuillez entrer votre token d'administration pour accéder à cette page.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="token" className="block text-sm font-medium text-[#EBDFF0] mb-2">
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
              className="w-full px-4 py-2 bg-[#2a2830] border-2 border-[#3a3840] text-[#EBDFF0] rounded-lg focus:outline-none focus:border-[#df93ff] transition-colors"
              placeholder="Entrez votre token..."
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-[#EBDFF0] bg-[#2a2830] rounded-lg hover:bg-[#3a3840] transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#df93ff] text-[#1a1820] font-semibold rounded-lg hover:bg-[#EBDFF0] transition-colors"
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
