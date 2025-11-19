import { Link, Outlet, useLocation } from "react-router";
import { useState, useEffect } from "react";
import AdminTokenModal from "~/components/AdminTokenModal";
import { useAdminToken } from "~/hooks/useAdminToken";

const AdminLayout = () => {
  const location = useLocation();
  const adminToken = useAdminToken();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!adminToken) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [adminToken]);

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: "🏠" },
    { path: "/admin/energies/create", label: "Créer une énergie", icon: "⚡" },
    { path: "/admin/energies", label: "Gérer les énergies", icon: "🔋" },
    { path: "/admin/cards/create", label: "Créer une carte", icon: "➕" },
    { path: "/admin/cards", label: "Gérer les cartes", icon: "🃏" },
    { path: "/admin/games/history", label: "Parties", icon: "🎮" },
    { path: "/admin/users", label: "Utilisateurs", icon: "👥" },
  ];

  return (
    <>
      <AdminTokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">
                ⚡ Catalyst Admin
              </h1>
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
              >
                ← Retour au jeu
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          <div className="flex gap-6">
            <aside className="w-64 shrink-0">
              <nav className="bg-white rounded-lg shadow p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive(item.path)
                            ? "bg-blue-500 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <main className="flex-1">
              <div className="bg-white rounded-lg shadow p-6">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
