import { useState } from "react";
import { Link } from "react-router";

export const meta = () => {
  return [
    { title: "Login - Catalyst" },
    { name: "description", content: "Connectez-vous à Catalyst" },
  ];
};

const LoginRoute = () => {
  const [email, setEmail] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email });
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 200"
            width="400"
            height="100"
            role="img"
            aria-labelledby="catalyst-logo"
            className="mx-auto"
          >
            <title id="catalyst-logo">Catalyst</title>
            <defs>
              <style>
                {`.card-double { fill: #f7b8d0; stroke: #d18ca8; stroke-width: 4; }
                                .diamond-outline { fill: none; stroke: #ffffff; stroke-width: 5; }
                                .text-red5 { fill: #fe5c5c; font-family: "Poppins", "Montserrat", system-ui, sans-serif; font-weight: 700; }`}
              </style>
            </defs>
            <g transform="translate(120, 0)">
              <rect
                className="card-double"
                x="30"
                y="40"
                width="80"
                height="120"
                rx="8"
              />
              <polygon
                className="diamond-outline"
                points="70,70 90,100 70,130 50,100"
              />
              <text x="150" y="125" className="text-red5" fontSize="95">
                Catalyst
              </text>
            </g>
          </svg>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
            Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#fe5c5c] dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="votre@email.com"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#fe5c5c] text-white font-bold rounded-lg hover:bg-[#ff7676] transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Se connecter
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginRoute;