import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAdminToken } from "~/hooks/useAdminToken";
import type { Energy } from "~/types/energy";
import { publicAPI } from "~/utils/publicAPI";

export const meta = () => {
  return [{ title: "Énergies - Catalyst" }];
};

const EnergiesPage = () => {
  const [energies, setEnergies] = useState<Energy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const adminToken = useAdminToken();

  useEffect(() => {
    if (!adminToken) return;
    
    fetchEnergies();
  }, [adminToken]);

  const fetchEnergies = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await publicAPI.get("/api/energie", {
        headers: {
          "X-API-Secret": adminToken || "",
        },
      });
      setEnergies(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erreur lors du chargement des énergies");
      } else {
        setError("Une erreur inconnue est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#EBDFF0]">
          Gestion des Énergies
        </h1>
        <Link
          to="/admin/energies/create"
          className="bg-[#df93ff] hover:bg-[#c77de8] text-[#1a1820] font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          + Créer une énergie
        </Link>
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

      {!loading && !error && energies.length === 0 && (
        <div className="bg-[#2a2830] rounded-2xl border border-[#3a3840] p-8 text-center">
          <p className="text-[#EBDFF0] opacity-70">Aucune énergie disponible.</p>
          <Link
            to="/admin/energies/create"
            className="inline-block mt-4 text-[#df93ff] hover:text-[#c77de8] transition-colors"
          >
            Créer votre première énergie →
          </Link>
        </div>
      )}

      {!loading && !error && energies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {energies.map((energy) => (
            <div
              key={energy.id}
              className="bg-[#2a2830] rounded-2xl border border-[#3a3840] overflow-hidden hover:border-[#df93ff] transition-colors"
            >
              <div className="aspect-3/4 relative bg-[#232029]">
                {energy.frontImageUrl ? (
                  <img
                    src={energy.frontImageUrl}
                    alt={energy.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#EBDFF0] opacity-30">
                    Pas d'image
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-[#EBDFF0]">
                    {energy.name}
                  </h3>
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white"
                    style={{ backgroundColor: energy.color }}
                    title={energy.color}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#EBDFF0] opacity-70">Quota:</span>
                  <span className="text-[#df93ff] font-semibold">
                    {energy.quota}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnergiesPage;
