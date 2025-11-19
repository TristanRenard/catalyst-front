import { useEffect, useState } from "react";
import { privateAPI } from "~/utils/privateAPI";

interface User {
  id: string;
  username: string | null;
  email: string | null;
  verificationToken: string | null;
  verificationTokenExpiresAt: Date | null;
  verifiedAt: Date | null;
  createdAt: Date;
  ratio: number;
}

export const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const apiSecret = localStorage.getItem("adminToken");
      const response = await privateAPI.get(`/users`, {
        headers: {
          "X-API-Secret": apiSecret || "",
        },
      });
      const data = response.data;
      setUsers(Array.isArray(data) ? data : data.users || []);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erreur lors du chargement des utilisateurs");
      } else {
        setError("Une erreur inconnue est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#EBDFF0] uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#EBDFF0] uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#EBDFF0] uppercase tracking-wider">
                    Vérifié
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#EBDFF0] uppercase tracking-wider">
                    Ratio
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#EBDFF0] uppercase tracking-wider">
                    Créé le
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3a3840]">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-[#EBDFF0] opacity-70"
                    >
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-[#3a3840] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-[#EBDFF0]">
                          {user.username || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-[#EBDFF0] opacity-70">
                          {user.email || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.verifiedAt ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                            ✓ Vérifié
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
                            En attente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-[#EBDFF0] opacity-70">
                          {user.ratio.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-[#EBDFF0] opacity-70">
                          {formatDate(user.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {users.length > 0 && (
            <div className="bg-[#232029] px-6 py-4 border-t border-[#3a3840]">
              <p className="text-sm text-[#EBDFF0] opacity-70">
                Total : <span className="font-semibold">{users.length}</span>{" "}
                utilisateur(s)
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};
