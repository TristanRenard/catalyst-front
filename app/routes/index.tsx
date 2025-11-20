import { useEffect, useState } from "react"
import { Link, useNavigate, type MetaArgs } from "react-router"
import { publicAPI } from "~/utils/publicAPI"

export const meta = ({ }: MetaArgs) => {
  return [
    { title: "Catalyst - Jeu de Cartes Stratégique" },
    { name: "description", content: "Plongez dans l'univers de Catalyst, un jeu de cartes stratégique où chaque décision compte." },
  ]
}

const Home = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    publicAPI.get("/@me", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user)
        console.log("Logged in user:", response.data.user)
      })
      .catch((error) => {
        console.log("Not logged in", error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const handleStartGame = () => {
    if (user) {
      navigate("/lobby")
    } else {
      navigate("/auth/login")
    }
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#232029' }}>
      <header className="border-b border-gray-800 bg-[#1a1820]">
        <div className="flex justify-between items-center p-6 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-4">
            <span className="text-2xl font-bold text-[#EBDFF0]">Catalyst</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              to="/rules"
              className="hidden md:block px-4 py-2 text-[#EBDFF0] hover:text-[#df93ff] transition-colors"
            >
              Règles
            </Link>
            {user ? (
              <>
                <div className="flex items-center gap-3 bg-[#2a2830] px-4 py-2 rounded-lg border border-gray-800">
                  <div className="w-8 h-8 rounded-full bg-[#df93ff] flex items-center justify-center text-white font-bold text-sm">
                    {user.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-[#EBDFF0] font-medium">{user.username}</span>
                </div>
                <Link
                  to="/admin"
                  className="px-5 py-2 bg-[#2a2830] hover:bg-[#3a3840] text-[#df93ff] font-semibold rounded-lg border border-gray-800 transition-colors"
                >
                  Admin
                </Link>
              </>
            ) : (
              <Link
                to="/auth/login"
                className="px-6 py-2.5 bg-[#EBDFF0] text-[#2a2830] font-semibold rounded-lg hover:bg-[#df93ff] transition-colors"
              >
                Connexion
              </Link>
            )}
          </nav>
        </div>
      </header>

      <section className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-12">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <img
              src="/images/logo.png"
              alt="Catalyst Logo"
              className="mx-auto w-64 h-auto mb-8"
            />
          </div>

          <div className="bg-[#1a1820] rounded-2xl shadow-xl p-8 border border-gray-800">
            <p className="text-xl text-center text-[#EBDFF0] mb-6">
              Le jeu de cartes où <span className="font-bold text-[#df93ff]">l'énergie</span> est votre arme
            </p>

            <p className="text-center text-[#EBDFF0]/70 mb-8">
              Un jeu de stratégie pour 2 joueurs où chaque décision compte.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={handleStartGame}
                disabled={isLoading}
                className="w-full sm:w-auto px-12 py-3 bg-[#EBDFF0] text-[#2a2830] text-lg font-bold rounded-lg hover:bg-[#df93ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Chargement...' : user ? 'Jouer Maintenant' : 'Commencer'}
              </button>

              <Link
                to="/lobby"
                className="w-full sm:w-auto px-12 py-3 text-center bg-[#2a2830] text-[#EBDFF0] text-lg font-semibold rounded-lg border-2 border-gray-800 hover:border-[#df93ff] transition-colors"
              >
                Mode Multijoueur
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-800">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-[#df93ff] rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#EBDFF0] mb-1">Énergies Dynamiques</h3>
                <p className="text-[#EBDFF0]/70 text-sm">Collectez et combinez</p>
              </div>

              <div className="text-center p-4">
                <div className="w-12 h-12 bg-[#df93ff] rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#EBDFF0] mb-1">Stratégie Pure</h3>
                <p className="text-[#EBDFF0]/70 text-sm">Anticipez vos adversaires</p>
              </div>

              <div className="text-center p-4">
                <div className="w-12 h-12 bg-[#df93ff] rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#EBDFF0] mb-1">Multijoueur</h3>
                <p className="text-[#EBDFF0]/70 text-sm">Temps réel</p>
              </div>
            </div>

            <div className="text-center mt-6">
              <Link
                to="/rules"
                className="text-[#df93ff] hover:text-[#EBDFF0] font-semibold transition-colors text-sm"
              >
                Voir les règles complètes →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-800 bg-[#1a1820] mt-8">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="Catalyst" className="w-8 h-8 object-contain" />
              <span className="text-[#EBDFF0]/70 text-sm">© 2025 Catalyst. Tous droits réservés.</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="/admin" className="text-[#EBDFF0]/70 hover:text-[#df93ff] transition-colors">
                Administration
              </Link>
              <Link to="/rules" className="text-[#EBDFF0]/70 hover:text-[#df93ff] transition-colors">
                Règles du jeu
              </Link>
              <Link to="/admin/leaderboard" className="text-[#EBDFF0]/70 hover:text-[#df93ff] transition-colors">
                Classement
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default Home
