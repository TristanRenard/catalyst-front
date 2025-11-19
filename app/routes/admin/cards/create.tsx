import { useState } from "react";
import CreateEnergySituationCardForm from "~/components/CreateEnergySituationCardForm";
import CreateSituationCardForm from "~/components/CreateSituationCardForm";

export const meta = () => {
  return [{ title: "Create Card - Catalyst" }];
};

type CardType = "energy" | "situation" | null;

const CreateCardPage = () => {
  const [selectedType, setSelectedType] = useState<CardType>(null);

  const handleTypeSelection = (type: CardType) => {
    setSelectedType(type);
  };

  const handleEnergyCardSubmit = (data: any) => {};

  const handleSituationCardSubmit = (data: any) => {};

  const handleCancel = () => {
    setSelectedType(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Créer une Carte</h1>

      {!selectedType ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <button
            onClick={() => handleTypeSelection("energy")}
            className="p-8 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="text-5xl">⚡</div>
              <h2 className="text-2xl font-semibold group-hover:text-blue-600">
                Carte Énergie Situation
              </h2>
              <p className="text-gray-600 text-center">
                Créer une carte énergie pour le jeu
              </p>
            </div>
          </button>

          <button
            onClick={() => handleTypeSelection("situation")}
            className="p-8 border-2 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 group"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="text-5xl">📋</div>
              <h2 className="text-2xl font-semibold group-hover:text-green-600">
                Carte Situation
              </h2>
              <p className="text-gray-600 text-center">
                Créer une carte situation pour le jeu
              </p>
            </div>
          </button>
        </div>
      ) : (
        <div className="max-w-2xl">
          <button
            onClick={() => setSelectedType(null)}
            className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← Retour au choix du type
          </button>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">
              {selectedType === "energy"
                ? "Nouvelle Carte Énergie Situation"
                : "Nouvelle Carte Situation"}
            </h2>
            {selectedType === "energy" ? (
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
