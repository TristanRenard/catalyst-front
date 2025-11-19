import CreateEnergyForm from "~/components/CreateEnergyForm";
import { useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";
import { publicAPI } from "~/utils/publicAPI";

const CreateEnergyPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      const apiSecret = localStorage.getItem('adminToken');
      await publicAPI.post('api/energie', {
        name: data.name,
        color: data.color,
        quota: data.quota,
        imageFront: data.frontImageId,
        imageBack: data.backImageId,
      }, {
        headers: {
          'X-API-Secret': apiSecret || '',
        },
      });

      navigate("/admin/energies");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erreur lors de la création de l'énergie");
      } else {
        setError("Une erreur inconnue est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/energies");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#EBDFF0] mb-6">
        Créer une nouvelle énergie
      </h2>
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#df93ff]"></div>
          <p className="mt-4 text-[#8b8693]">Création en cours...</p>
        </div>
      ) : (
        <CreateEnergyForm onSubmit={handleSubmit} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default CreateEnergyPage