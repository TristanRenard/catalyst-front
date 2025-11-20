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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleStartGame = () => {
    if (user) {
      navigate("/lobby")
    } else {
      navigate("/auth/login")
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#1a1820] via-[#2a2435] to-[#1a1820]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-[#df93ff]/20 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#fe5c5c]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#df93ff]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="absolute top-10 left-10 w-16 h-24 bg-linear-to-br from-[#df93ff]/30 to-[#fe5c5c]/30 rounded-lg backdrop-blur-sm border border-white/10 animate-float" />
        <div className="absolute top-1/3 right-20 w-16 h-24 bg-linear-to-br from-[#fe5c5c]/30 to-[#df93ff]/30 rounded-lg backdrop-blur-sm border border-white/10 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-1/4 w-16 h-24 bg-linear-to-br from-[#df93ff]/30 to-[#fe5c5c]/30 rounded-lg backdrop-blur-sm border border-white/10 animate-float" style={{ animationDelay: '4s' }} />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(223,147,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(223,147,255,0.03)_1px,transparent_1px)] bg-size-[50px_50px]" />
      </div>

      <header className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center gap-4">
          <img
            src="/images/logo.png"
            alt="Catalyst Logo"
            className="w-12 h-12 object-contain drop-shadow-[0_0_15px_rgba(223,147,255,0.5)] hover:drop-shadow-[0_0_25px_rgba(223,147,255,0.8)] transition-all duration-300"
          />
          <span className="text-2xl font-bold text-[#EBDFF0] tracking-tight">Catalyst</span>
        </div>

        <nav className="flex items-center gap-6">
          {user ? (
            <>
              <div className="flex items-center gap-3 bg-[#2a2830]/50 backdrop-blur-md px-4 py-2 rounded-full border border-[#3a3840]">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#df93ff] to-[#fe5c5c] flex items-center justify-center text-white font-bold text-sm">
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-[#EBDFF0] font-medium">{user.username}</span>
              </div>
              <Link
                to="/admin"
                className="px-5 py-2 bg-[#df93ff]/10 hover:bg-[#df93ff]/20 text-[#df93ff] font-semibold rounded-full border border-[#df93ff]/30 hover:border-[#df93ff]/60 transition-all duration-300"
              >
                Admin
              </Link>
            </>
          ) : (
            <Link
              to="/auth/login"
              className="px-6 py-2.5 bg-linear-to-r from-[#df93ff] to-[#fe5c5c] text-white font-semibold rounded-full hover:shadow-[0_0_30px_rgba(223,147,255,0.5)] transition-all duration-300 hover:scale-105"
            >
              Connexion
            </Link>
          )}
        </nav>
      </header>

      <section className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <div className="text-center space-y-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center gap-8 animate-fade-in">
            <img
              src="/images/Untitled_Artwork 3.png"
              alt="Catalyst Main Logo"
              className="w-48 h-48 object-contain drop-shadow-[0_0_40px_rgba(223,147,255,0.6)] hover:drop-shadow-[0_0_60px_rgba(223,147,255,0.9)] transition-all duration-500 hover:scale-110 animate-pulse-subtle"
            />

            <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#df93ff] via-[#fe5c5c] to-[#df93ff] tracking-tight animate-gradient bg-size-[200%_auto]">
              CATALYST
            </h1>
          </div>

          <p className="text-2xl md:text-3xl text-[#EBDFF0] font-light tracking-wide opacity-90 animate-fade-in-delay">
            Le jeu de cartes où l'énergie est votre arme
          </p>

          <p className="text-lg text-[#EBDFF0]/70 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay-2">
            Maîtrisez les énergies, déployez des stratégies audacieuses et terrassez vos adversaires
            dans des duels tactiques intenses. Chaque carte compte, chaque choix est décisif.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 animate-fade-in-delay-3">
            <button
              onClick={handleStartGame}
              disabled={isLoading}
              className="group relative px-12 py-5 bg-linear-to-r from-[#df93ff] to-[#fe5c5c] text-white text-xl font-bold rounded-2xl shadow-[0_0_40px_rgba(223,147,255,0.3)] hover:shadow-[0_0_60px_rgba(223,147,255,0.6)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                {isLoading ? 'Chargement...' : user ? 'Jouer Maintenant' : 'Commencer'}
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-[#fe5c5c] to-[#df93ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <Link
              to="/lobby"
              className="px-10 py-5 bg-[#2a2830]/80 backdrop-blur-md text-[#EBDFF0] text-xl font-semibold rounded-2xl border-2 border-[#df93ff]/50 hover:border-[#df93ff] hover:bg-[#2a2830] transition-all duration-300 hover:scale-105"
            >
              Mode Multijoueur
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 animate-fade-in-delay-4">
            <div className="bg-[#2a2830]/50 backdrop-blur-md rounded-2xl p-6 border border-[#3a3840] hover:border-[#df93ff]/50 transition-all duration-300 hover:scale-105 group">
              <div className="w-14 h-14 bg-linear-to-br from-[#df93ff] to-[#fe5c5c] rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#EBDFF0] mb-2">Énergies Dynamiques</h3>
              <p className="text-[#EBDFF0]/70">Collectez et combinez différentes énergies pour déchaîner des combos dévastateurs</p>
            </div>

            <div className="bg-[#2a2830]/50 backdrop-blur-md rounded-2xl p-6 border border-[#3a3840] hover:border-[#df93ff]/50 transition-all duration-300 hover:scale-105 group">
              <div className="w-14 h-14 bg-linear-to-br from-[#fe5c5c] to-[#df93ff] rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#EBDFF0] mb-2">Stratégie Pure</h3>
              <p className="text-[#EBDFF0]/70">Anticipez les coups de votre adversaire et élaborez des tactiques victorieuses</p>
            </div>

            <div className="bg-[#2a2830]/50 backdrop-blur-md rounded-2xl p-6 border border-[#3a3840] hover:border-[#df93ff]/50 transition-all duration-300 hover:scale-105 group">
              <div className="w-14 h-14 bg-linear-to-br from-[#df93ff] to-[#fe5c5c] rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#EBDFF0] mb-2">Multijoueur en Temps Réel</h3>
              <p className="text-[#EBDFF0]/70">Affrontez des joueurs du monde entier dans des matchs intenses en temps réel</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[#3a3840] bg-[#1a1820]/50 backdrop-blur-md mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="Catalyst" className="w-8 h-8 object-contain opacity-70" />
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

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 4s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s both;
        }
        
        .animate-fade-in-delay-3 {
          animation: fade-in 0.8s ease-out 0.6s both;
        }
        
        .animate-fade-in-delay-4 {
          animation: fade-in 0.8s ease-out 0.8s both;
        }
      `}</style>
    </main>
  )
}

export default Home
