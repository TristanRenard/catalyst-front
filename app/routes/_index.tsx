import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/home";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="absolute top-4 right-4">
        <Link to="/login">
          <button className="px-6 py-2 bg-[#fe5c5c] text-white font-semibold rounded-lg hover:bg-[#ff7676] transition-colors duration-200 shadow-md hover:shadow-lg">
            Login
          </button>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-32 bg-pink-200 border-4 border-pink-400 rounded-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-white rotate-45"></div>
            </div>
          </div>
          <h1
            className="text-[95px] font-bold text-[#fe5c5c]"
            style={{
              fontFamily: '"Poppins", "Montserrat", system-ui, sans-serif',
            }}
          >
            Catalyst
          </h1>
        </div>

        <h2 className="leading-6 text-gray-700 dark:text-gray-200 text-center text-3xl">
          Welcome to Catalyst !
        </h2>
        <button
          className="p-2 bg-blue-500 rounded-2xl text-white w-32"
          onClick={() => navigate("/game")}
        >
          Jouer
        </button>
      </div>
    </main>
  );
}

export default Home;