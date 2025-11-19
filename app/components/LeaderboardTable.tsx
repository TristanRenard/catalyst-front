import { useEffect, useState } from "react";
import { privateAPI } from "~/utils/privateAPI";

interface LeaderboardUser {
  id: string;
  username: string | null;
  ratio: number;
  gamesPlayed?: number;
  gamesWon?: number;
}

export const LeaderboardTable = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const apiSecret = localStorage.getItem("adminToken");
      const response = await privateAPI.get(`/users`, {
        headers: {
          "X-API-Secret": apiSecret || "",
        },
      });
      const data = response.data;
      const usersData = Array.isArray(data) ? data : data.users || [];
      
      // Trier par ratio décroissant
      const sortedUsers = usersData
        .filter((user: LeaderboardUser) => user.username) // Uniquement les utilisateurs avec un username
        .sort((a: LeaderboardUser, b: LeaderboardUser) => b.ratio - a.ratio);
      
      setUsers(sortedUsers);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erreur lors du chargement du classement");
      } else {
        setError("Une erreur inconnue est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (position: number) => {
    switch (position) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return null;
    }
  };

  const getPositionBadgeClass = (position: number) => {
    switch (position) {
      case 1:
        return "bg-yellow-500 text-yellow-950";
      case 2:
        return "bg-gray-400 text-gray-950";
      case 3:
        return "bg-orange-600 text-orange-950";
      default:
        return "bg-[#3a3840] text-[#EBDFF0]";
    }
  };

  return (
    <>
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

      {!loading && !error && (
        <div className="bg-[#2a2830] rounded-2xl border border-[#3a3840] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#232029]">
                <tr>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-[#EBDFF0] uppercase tracking-wider w-24">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#EBDFF0] uppercase tracking-wider">
                    Joueur
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-[#EBDFF0] uppercase tracking-wider">
                    Ratio
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3a3840]">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-8 text-center text-[#EBDFF0] opacity-70"
                    >
                      Aucun joueur dans le classement
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => {
                    const position = index + 1;
                    const medal = getMedalEmoji(position);
                    const isTopThree = position <= 3;

                    return (
                      <tr
                        key={user.id}
                        className={`hover:bg-[#3a3840] transition-colors ${
                          isTopThree ? "bg-[#2d2a35]" : ""
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            {medal && (
                              <span className="text-2xl">{medal}</span>
                            )}
                            <span
                              className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getPositionBadgeClass(
                                position
                              )}`}
                            >
                              {position}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-base font-semibold ${
                              isTopThree
                                ? "text-[#df93ff]"
                                : "text-[#EBDFF0]"
                            }`}
                          >
                            {user.username || "Anonyme"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`text-lg font-bold ${
                              isTopThree
                                ? "text-[#df93ff]"
                                : "text-[#EBDFF0]"
                            }`}
                          >
                            {user.ratio.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {users.length > 0 && (
            <div className="bg-[#232029] px-6 py-4 border-t border-[#3a3840]">
              <p className="text-sm text-[#EBDFF0] opacity-70">
                Total : <span className="font-semibold">{users.length}</span>{" "}
                joueur(s) classé(s)
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};
