import { useState } from "react";
import { formatDate } from "~/utils/formatDate";

interface GameHistory {
  id: number;
  winner: string;
  loser: string;
  winnerRatio: number;
  loserRatio: number;
  date: string;
}

const mockGameHistory: GameHistory[] = [
  {
    id: 1,
    winner: "Joueur A",
    loser: "Keenan",
    winnerRatio: 75.5,
    loserRatio: 24.5,
    date: "2025-11-19 14:30",
  },
  {
    id: 2,
    winner: "Joueur C",
    loser: "Joueur A",
    winnerRatio: 68.2,
    loserRatio: 31.8,
    date: "2025-11-19 15:45",
  },
  {
    id: 3,
    winner: "Joueur B",
    loser: "Joueur D",
    winnerRatio: 82.1,
    loserRatio: 17.9,
    date: "2025-11-18 10:20",
  },
  {
    id: 4,
    winner: "Joueur D",
    loser: "Joueur C",
    winnerRatio: 55.3,
    loserRatio: 44.7,
    date: "2025-11-18 16:15",
  },
  {
    id: 5,
    winner: "Joueur A",
    loser: "Joueur D",
    winnerRatio: 91.0,
    loserRatio: 9.0,
    date: "2025-11-17 11:00",
  },
];

export const GameHistoryTable = () => {
  const [games] = useState<GameHistory[]>(mockGameHistory);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Historique des Parties</h2>
        <p className="text-gray-600">Liste de toutes les parties jouées</p>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gagnant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ratio Gagnant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Perdant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ratio Perdant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {games.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Aucune partie enregistrée
                </td>
              </tr>
            ) : (
              games.map((game) => (
                <tr
                  key={game.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {game.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-green-600">
                      {game.winner}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {game.winnerRatio.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-red-600">
                      {game.loser}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {game.loserRatio.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(game.date)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Total: {games.length} partie{games.length > 1 ? "s" : ""}
      </div>
    </div>
  );
};
