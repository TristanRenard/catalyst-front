import { useState } from "react";
import { useNavigate } from "react-router";
import CreateEnergySituationCardForm from "~/components/CreateEnergySituationCardForm";
import CreateSituationCardForm from "~/components/CreateSituationCardForm";
import { useAdminToken } from "~/hooks/useAdminToken";
import { publicAPI } from "~/utils/publicAPI";

export const meta = () => {
  return [{ title: "Create Card - Catalyst" }];
};

type CardType = "energy" | "situation" | null;

const CreateCardPage = () => {
  const [selectedType, setSelectedType] = useState<CardType>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const adminToken = useAdminToken();
  const navigate = useNavigate();

  const handleTypeSelection = (type: CardType) => {
    setSelectedType(type);
    setError(null);
    setSuccess(false);
  };

  const handleEnergyCardSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      await publicAPI.post(
        "/api/situation-card-energie",
        {
          situationCardId: data.cardId,
          quota: data.quota,
          energie1Id: data.energy1Id,
          energie2Id: data.energy2Id,
          energie3Id: data.energy3Id,
          energie4Id: data.energy4Id,
          energie5Id: data.energy5Id,
        },
        {
          headers: {
            "X-API-Secret": adminToken || "",
          },
        }
      );

      setSuccess(true);
      setTimeout(() => {
        navigate("/admin/cards");
      }, 1500);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Erreur lors de la création de la carte"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSituationCardSubmit = (data: any) => {};

  const handleCancel = () => {
    setSelectedType(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#EBDFF0] mb-8">
        Créer une Carte
      </h1>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-4">
          Carte créée avec succès ! Redirection...
        </div>
      )}

      {!selectedType ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <button
            onClick={() => handleTypeSelection("energy")}
            className="p-8 border-2 border-[#3a3840] bg-[#2a2830] rounded-lg hover:border-[#df93ff] hover:bg-[#3a3840] transition-all duration-200 group"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="text-5xl">⚡</div>
              <h2 className="text-2xl font-semibold text-[#EBDFF0] group-hover:text-[#df93ff]">
                Carte Énergie Situation
              </h2>
              <p className="text-[#EBDFF0] opacity-80 text-center">
                Créer une carte énergie pour le jeu
              </p>
            </div>
          </button>

          <button
            onClick={() => handleTypeSelection("situation")}
            className="p-8 border-2 border-[#3a3840] bg-[#2a2830] rounded-lg hover:border-[#df93ff] hover:bg-[#3a3840] transition-all duration-200 group"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="text-5xl">📋</div>
              <h2 className="text-2xl font-semibold text-[#EBDFF0] group-hover:text-[#df93ff]">
                Carte Situation
              </h2>
              <p className="text-[#EBDFF0] opacity-80 text-center">
                Créer une carte situation pour le jeu
              </p>
            </div>
          </button>
        </div>
      ) : (
        <div className="max-w-2xl">
          <button
            onClick={() => setSelectedType(null)}
            className="mb-6 text-[#df93ff] hover:text-[#EBDFF0] flex items-center gap-2"
          >
            ← Retour au choix du type
          </button>

          <div className="bg-[#2a2830] p-6 rounded-lg border border-[#3a3840]">
            <h2 className="text-2xl font-semibold text-[#EBDFF0] mb-6">
              {selectedType === "energy"
                ? "Nouvelle Carte Énergie Situation"
                : "Nouvelle Carte Situation"}
            </h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#df93ff]"></div>
                <p className="mt-4 text-[#EBDFF0] opacity-70">
                  Création en cours...
                </p>
              </div>
            ) : selectedType === "energy" ? (
              <CreateEnergySituationCardForm
                onSubmit={handleEnergyCardSubmit}
                onCancel={handleCancel}
              />
            ) : (
              <CreateSituationCardForm
                onSubmit={handleSituationCardSubmit}
                onCancel={handleCancel}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCardPage;
