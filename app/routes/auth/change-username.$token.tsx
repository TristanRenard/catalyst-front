import { redirect, type LoaderFunctionArgs } from "@remix-run/node"
import { useState } from "react"
import { Link, useLoaderData, useNavigate } from "react-router"
import { publicAPI } from "~/utils/publicAPI"

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { token } = params
  if (!token) {
    return redirect("/?error=missing-token")
  }
  return { token }
}

export const meta = () => {
  return [
    { title: "Change username - Catalyst" },
    { name: "description", content: "Change your username" },
  ]
}

const ChangeUsernameRoute = () => {
  const { token } = useLoaderData<typeof loader>()
  console.log(token)
  const [username, setUsername] = useState<string>("")
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await publicAPI.post("/verify", {
      verificationToken: token,
      username
    })
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
          <h1 className="text-3xl font-bold text-center mb-8 text-[#EBDFF0]">
            Change Username
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2 text-[#EBDFF0]"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#EBDFF0] transition-colors bg-[#2a2830] border-[#3a3840] text-[#EBDFF0]"
                placeholder="yourusername"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#EBDFF0] font-bold rounded-lg hover:bg-[#df93ff] transition-colors duration-200 shadow-md hover:shadow-lg text-[#2a2830]"
            >
              Set Username
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-sm hover:opacity-80 transition-opacity text-[#EBDFF0]"
            >
              ← Go back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ChangeUsernameRoute