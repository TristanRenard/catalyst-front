import { LeaderboardTable } from "~/components/LeaderboardTable";

export const meta = () => {
  return [{ title: "Classement - Catalyst" }];
};

const LeaderboardAdminPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#EBDFF0] mb-2 flex items-center gap-3">
          <span className="text-4xl">🏆</span>
          Classement des Joueurs
        </h1>
        <p className="text-[#EBDFF0] opacity-70">
          Découvrez les meilleurs joueurs classés par ratio de victoires
        </p>
      </div>
      <LeaderboardTable />
    </div>
  );
};

export default LeaderboardAdminPage;
