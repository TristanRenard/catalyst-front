import { Link } from "react-router";
import { UserTable } from "~/components/UserTable";

export const meta = () => {
  return [{ title: "Users - Catalyst" }];
};

const UserPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#EBDFF0] mb-8">
        Gestion des Utilisateurs
      </h1>
      <UserTable />
    </div>
  );
};

export default UserPage;
