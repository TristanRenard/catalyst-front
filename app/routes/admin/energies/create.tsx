import CreateEnergyForm from "~/components/CreateEnergyForm";
import { useNavigate } from "react-router";

const CreateEnergyPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    console.log("Données du formulaire:", data);
    // TODO: Appeler l'API pour créer l'énergie
    // navigate("/admin/energies");
  };

  const handleCancel = () => {
    navigate("/admin/energies");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Créer une nouvelle énergie
      </h2>
      <CreateEnergyForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default CreateEnergyPage