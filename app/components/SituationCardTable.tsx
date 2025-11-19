import { useEffect, useState } from "react";
import axios from "axios";

interface SituationCard {
  id: string;
  effectId: string | null;
  backImage: string;
  frontImage: string;
}

const API_BASE_URL = 'http://localhost:5173/api';

export const SituationCardTable = () => {
  const [situationCards, setSituationCards] = useState<SituationCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSituationCards();
  }, []);

  const fetchSituationCards = async () => {
    try {
      setLoading(true);
      const apiSecret = localStorage.getItem('X-API-Secret');
      const response = await axios.get<SituationCard[] | { situationCards: SituationCard[] }>(`${API_BASE_URL}/situation-card`, {
        headers: {
          'X-API-Secret': apiSecret || '',
        },
      });
      const data = response.data;
      setSituationCards(Array.isArray(data) ? data : data.situationCards || []);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erreur lors du chargement des cartes situation");
      } else {
        setError("Une erreur inconnue est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#fe5c5c]"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Effect ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Image Dos
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    Image Face
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {situationCards.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      Aucune carte situation trouvée
                    </td>
                  </tr>
                ) : (
                  situationCards.map((card) => (
                    <tr
                      key={card.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[100px] block">
                          {card.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[100px] block">
                          {card.effectId || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[150px] block">
                          {card.backImage}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[150px] block">
                          {card.frontImage}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Stats Footer */}
          {situationCards.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Total : <span className="font-semibold">{situationCards.length}</span> carte(s) situation
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};
