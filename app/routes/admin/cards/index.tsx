import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { SituationCard, EnergySituationCard } from "~/types/cards";
import { useAdminToken } from "~/hooks/useAdminToken";
import { publicAPI } from "~/utils/publicAPI";

export const meta = () => {
  return [{ title: "Cartes - Catalyst" }];
};

const CardsPage = () => {
  const [situationCards, setSituationCards] = useState<SituationCard[]>([]);
  const [energySituationCards, setEnergySituationCards] = useState<
    EnergySituationCard[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"situation" | "energy">(
    "situation"
  );
  const adminToken = useAdminToken();

  useEffect(() => {
    if (!adminToken) return;

    fetchCards();
  }, [adminToken]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);

      const [situationResponse, energyResponse] = await Promise.all([
        publicAPI.get("/api/situation-card", {
          headers: { "X-API-Secret": adminToken || "" },
        }),
        publicAPI.get("/api/situation-card-energie", {
          headers: { "X-API-Secret": adminToken || "" },
        }),
      ]);

      setSituationCards(
        Array.isArray(situationResponse.data) ? situationResponse.data : []
      );
      setEnergySituationCards(
        Array.isArray(energyResponse.data) ? energyResponse.data : []
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erreur lors du chargement des cartes");
      } else {
        setError("Une erreur inconnue est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  const currentCards =
    activeTab === "situation" ? situationCards : energySituationCards;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#EBDFF0]">
          Gestion des Cartes
        </h1>
        <Link
          to="/admin/cards/create"
          className="bg-[#df93ff] hover:bg-[#c77de8] text-[#1a1820] font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          + Créer une carte
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("situation")}
          className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
            activeTab === "situation"
              ? "bg-[#df93ff] text-[#1a1820]"
              : "bg-[#2a2830] text-[#EBDFF0] hover:bg-[#3a3840]"
          }`}
        >
          Cartes Situation ({situationCards.length})
        </button>
        <button
          onClick={() => setActiveTab("energy")}
          className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
            activeTab === "energy"
              ? "bg-[#df93ff] text-[#1a1820]"
              : "bg-[#2a2830] text-[#EBDFF0] hover:bg-[#3a3840]"
          }`}
        >
          Cartes Énergie Situation ({energySituationCards.length})
        </button>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#df93ff]"></div>
          <p className="mt-4 text-[#EBDFF0] opacity-70">Chargement...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {!loading && !error && currentCards.length === 0 && (
        <div className="bg-[#2a2830] rounded-2xl border border-[#3a3840] p-8 text-center">
          <p className="text-[#EBDFF0] opacity-70">
            Aucune carte {activeTab === "situation" ? "situation" : "énergie"}{" "}
            disponible.
          </p>
          <Link
            to="/admin/cards/create"
            className="inline-block mt-4 text-[#df93ff] hover:text-[#c77de8] transition-colors"
          >
            Créer votre première carte →
          </Link>
        </div>
      )}

      {!loading && !error && currentCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "situation"
            ? situationCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-[#2a2830] rounded-2xl border border-[#3a3840] overflow-hidden hover:border-[#df93ff] transition-colors"
                >
                  <div className="aspect-3/4 relative bg-[#232029]">
                    {card.frontImageUrl ? (
                      <img
                        src={card.frontImageUrl}
                        alt={`Carte ${card.id}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#EBDFF0] opacity-30">
                        Pas d'image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#EBDFF0] opacity-70">
                        ID Effet:
                      </span>
                      <span className="text-[#df93ff] font-mono text-xs">
                        {card.effectId}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            : energySituationCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-[#2a2830] rounded-2xl border border-[#3a3840] p-6 hover:border-[#df93ff] transition-colors"
                >
                  <div className="mb-4">
                    <div className="text-xs text-[#EBDFF0] opacity-50 mb-1">
                      Carte Énergie Situation
                    </div>
                    <div className="text-sm text-[#EBDFF0] opacity-70 mb-2">
                      Quota:{" "}
                      <span className="text-[#df93ff] font-semibold">
                        {card.quota}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-[#EBDFF0] opacity-70">
                      Carte situation:{" "}
                      <span className="font-mono text-[#df93ff]">
                        {card.situationCardId}
                      </span>
                    </div>
                    <div className="text-xs text-[#EBDFF0] opacity-70">
                      Énergies:
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {[
                        card.energy1Id,
                        card.energy2Id,
                        card.energy3Id,
                        card.energy4Id,
                        card.energy5Id,
                      ].map((energyId, idx) => (
                        <div
                          key={idx}
                          className="bg-[#232029] rounded px-2 py-1 text-center text-xs font-mono text-[#df93ff]"
                          title={energyId}
                        >
                          {energyId.slice(0, 4)}...
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
        </div>
      )}
    </div>
  );
};

export default CardsPage;
