import { useEffect, useRef, useState } from "react"
import { Link, Outlet, useLocation } from "react-router"
import AdminTokenModal from "~/components/AdminTokenModal"
import { useAdminToken } from "~/hooks/useAdminToken"
import { publicAPI } from "~/utils/publicAPI"

const AdminLayout = () => {
  const location = useLocation()
  const adminToken = useAdminToken()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [wsActive, setWsActive] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!adminToken) {
      setIsModalOpen(true)
    } else {
      setIsModalOpen(false)
    }
  }, [adminToken])

  // WebSocket health check
  useEffect(() => {
    const checkWebSocketHealth = async () => {
      try {
        // Get session token from /@me endpoint
        const response = await publicAPI.get<{ user: any; sessionToken?: string }>("/@me")

        if (!response.data.user || !response.data.sessionToken) {
          setWsActive(false)
          return
        }

        const sessionToken = response.data.sessionToken

        // Create WebSocket connection with Authorization token in URL
        const ws = new WebSocket(`ws://localhost:5173/ws?token=${sessionToken}`)

        ws.onopen = () => {
          // Send ping to verify connection
          ws.send(JSON.stringify({ type: "ping" }))
        }

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            if (data.type === "pong") {
              setWsActive(true)
              // Close connection after receiving pong
              setTimeout(() => {
                if (ws.readyState === WebSocket.OPEN) {
                  ws.close()
                }
              }, 100)
            } else if (data.type === "error") {
              setWsActive(false)
              ws.close()
            }
          } catch (err) {
            // Ignore parsing errors
          }
        }

        ws.onerror = () => {
          setWsActive(false)
        }

        ws.onclose = () => {
          // Don't set to false if we successfully got a pong
          // setWsActive(false)
        }

        wsRef.current = ws

        // Timeout to close connection if no response after 10 seconds
        setTimeout(() => {
          if (ws.readyState === WebSocket.OPEN) {
            setWsActive(false)
            ws.close()
          }
        }, 10000)
      } catch (err) {
        console.error("WebSocket health check error:", err)
        setWsActive(false)
      }
    }

    // Initial check
    checkWebSocketHealth()

    // Check every 30 seconds
    pingIntervalRef.current = setInterval(checkWebSocketHealth, 30000)

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current)
      }
    }
  }, [])

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navItems = [
    { path: "/admin", label: "Tableau de bord", icon: "🏠", exact: true },
    { path: "/admin/energies/create", label: "Créer une énergie", icon: "⚡" },
    { path: "/admin/energies", label: "Gérer les énergies", icon: "🔋" },
    { path: "/admin/effects/create", label: "Créer un effet", icon: "✨" },
    { path: "/admin/effects", label: "Gérer les effets", icon: "💫" },
    { path: "/admin/cards/create", label: "Créer une carte", icon: "➕" },
    { path: "/admin/cards", label: "Gérer les cartes", icon: "🃏" },
    { path: "/admin/games/history", label: "Parties", icon: "🎮" },
    { path: "/admin/users", label: "Utilisateurs", icon: "👥" },
    { path: "/admin/leaderboard", label: "Classement", icon: "🏆" },
    { path: "/admin/library", label: "Bibliothèque", icon: "📚" },
    { path: "/admin/debug", label: "Debug WebSocket", icon: "🐛" },
  ]

  return (
    <>
      <AdminTokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="min-h-screen bg-linear-to-br from-[#1a1820] via-[#232029] to-[#2a2830] relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #df93ff 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <header className="relative bg-[#1a1820]/80 backdrop-blur-xl border-b border-[#df93ff]/20 shadow-lg">
          <div className="container mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#df93ff] blur-xl opacity-50 rounded-full"></div>
                  <img
                    src="/images/logo.png"
                    alt="Catalyst Logo"
                    className="h-14 w-auto relative z-10 drop-shadow-2xl"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-linear-to-r from-[#df93ff] to-[#EBDFF0] bg-clip-text text-transparent">
                    Admin Panel
                  </h1>
                  <p className="text-xs text-[#8b8693] mt-0.5">Gestion de Catalyst</p>
                </div>
              </div>
              <Link
                to="/"
                className="group flex items-center gap-2 px-5 py-2.5 bg-[#2a2830] hover:bg-[#df93ff]/10 border border-[#3a3840] hover:border-[#df93ff] text-[#EBDFF0] rounded-xl transition-all duration-300 font-medium shadow-lg"
              >
                <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
                <span>Retour au jeu</span>
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8 relative">
          <div className="flex gap-6">
            <aside className="w-72 shrink-0">
              <nav className="sticky top-8 bg-[#1a1820]/60 backdrop-blur-xl rounded-2xl shadow-2xl p-3 border border-[#3a3840]/50">
                <div className="mb-4 px-3 pt-2">
                  <h2 className="text-xs font-semibold text-[#8b8693] uppercase tracking-wider">Navigation</h2>
                </div>
                <ul className="space-y-1.5">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive(item.path)
                          ? "bg-linear-to-r from-[#df93ff] to-[#c77de8] text-[#1a1820] font-semibold shadow-lg shadow-[#df93ff]/30 scale-[1.02]"
                          : "text-[#EBDFF0] hover:bg-[#2a2830]/80 hover:translate-x-1"
                          }`}
                      >
                        <span className={`text-2xl transition-transform duration-300 ${isActive(item.path) ? "scale-110" : "group-hover:scale-110"
                          }`}>{item.icon}</span>
                        <span className="font-medium text-sm">{item.label}</span>
                        {isActive(item.path) && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1a1820] animate-pulse"></div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Decorative Element */}
                <div className="mt-6 px-3 pt-4 border-t border-[#3a3840]/50">
                  <div className="flex items-center gap-2 text-xs text-[#8b8693]">
                    <div className={`w-2 h-2 rounded-full ${wsActive ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                    <span>{wsActive ? 'WebSocket actif' : 'WebSocket inactif'}</span>
                  </div>
                </div>
              </nav>
            </aside>

            <main className="flex-1 min-w-0">
              <div className="bg-[#1a1820]/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-[#3a3840]/50 hover:border-[#df93ff]/30 transition-colors duration-300">
                <Outlet />
              </div>
            </main>
          </div>
        </div>

        {/* Floating Orbs for Visual Interest */}
      </div>
    </>
  )
}

export default AdminLayout
