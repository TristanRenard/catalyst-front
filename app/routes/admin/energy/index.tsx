import { Link } from "react-router";
import type { Route } from "../../../+types/root";
import { EnergyTable } from "~/components/EnergyTable";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "Energies - Catalyst" },
    { name: "description", content: "Gestion des energies" },
  ];
};

const EnergyPage = () => {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Gestion des Energies
          </h1>
          <Link
            to="/"
            className="px-4 py-2 bg-[#fe5c5c] text-white font-semibold rounded-lg hover:bg-[#ff7676] transition-colors"
          >
            ← Retour
          </Link>
        </div>
        <EnergyTable />
      </div>
    </main>
  );
};

export default EnergyPage;