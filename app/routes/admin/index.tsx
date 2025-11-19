export const meta = () => {
  return [{ title: "Admin - Catalyst" }];
};

const AdminPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#EBDFF0] mb-8">
        Tableau de bord
      </h1>
      <p className="text-[#EBDFF0]">
        Bienvenue dans l'interface d'administration de Catalyst.
      </p>
    </div>
  );
};

export default AdminPage;
