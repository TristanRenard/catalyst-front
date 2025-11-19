import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { publicAPI } from "~/utils/publicAPI"

export const meta = () => {
  return [
    { title: "Login - Catalyst" },
    { name: "description", content: "Connectez-vous à Catalyst" },
  ]
}

const LoginRoute = () => {
  const [email, setEmail] = useState<string>("")
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await publicAPI.post("api/login", { email })
    if (res.status === 200) {
      navigate("/")
    } else {
      alert("Erreur lors de la connexion. Veuillez réessayer.")
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen px-4" style={{ backgroundColor: '#232029' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/images/logo.png"
            alt="Catalyst Logo"
            className="mx-auto w-96 h-auto"
          />
        </div>

        <div className="bg-[#1a1820] rounded-2xl shadow-xl p-8 border border-gray-800">
          <h1 className="text-3xl font-bold text-center mb-8" style={{ color: '#EBDFF0' }}>
            Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2"
                style={{ color: '#EBDFF0' }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#fe5c5c] transition-colors"
                style={{
                  backgroundColor: '#2a2830',
                  borderColor: '#3a3840',
                  color: '#EBDFF0'
                }}
                placeholder="votre@email.com"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#EBDFF0] font-bold rounded-lg hover:bg-[#df93ff] transition-colors duration-200 shadow-md hover:shadow-lg"
              style={{ color: '#2a2830' }}
            >
              Se connecter
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-sm hover:opacity-80 transition-opacity"
              style={{ color: '#EBDFF0' }}
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default LoginRoute