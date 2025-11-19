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
    return location.pathname === path;
  };

  const navItems = [
    { path: "/admin", label: "Tableau de bord", icon: "🏠" },
    { path: "/admin/energies/create", label: "Créer une énergie", icon: "⚡" },
    { path: "/admin/energies", label: "Gérer les énergies", icon: "🔋" },
    { path: "/admin/cards/create", label: "Créer une carte", icon: "➕" },
    { path: "/admin/cards", label: "Gérer les cartes", icon: "🃏" },
    { path: "/admin/games/history", label: "Parties", icon: "🎮" },
    { path: "/admin/users", label: "Utilisateurs", icon: "👥" },
    { path: "/admin/leaderboard", label: "Classement", icon: "🏆" },
    { path: "/admin/library", label: "Bibliothèque", icon: "📚" },
  ];

  return (
    <>
      <AdminTokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="min-h-screen bg-[#232029] relative">
        <header className="bg-[#1a1820] border-b border-gray-800">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src="/images/logo.png"
                  alt="Catalyst Logo"
                  className="h-12 w-auto"
                />
                <h1 className="text-2xl font-bold text-[#EBDFF0]">
                  Admin
                </h1>
              </div>
              <Link
                to="/"
                className="text-[#EBDFF0] hover:opacity-80 transition-opacity flex items-center gap-2"
              >
                ← Retour au jeu
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          <div className="flex gap-6">
            <aside className="w-64 shrink-0">
              <nav className="bg-[#1a1820] rounded-2xl shadow-xl p-4 border border-gray-800">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive(item.path)
                            ? "bg-[#df93ff] text-[#1a1820] font-semibold"
                            : "bg-[#2a2830] text-[#EBDFF0] hover:opacity-80"
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
              <div className="bg-[#1a1820] rounded-2xl shadow-xl p-6 border border-gray-800">
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
