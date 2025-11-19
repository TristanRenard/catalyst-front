<<<<<<< HEAD
import type { Route } from "../../+types/root";
export const meta = ({}: Route.MetaArgs) => {    
    return [
        { title: "Admin - Catalyst" },
        { name: "description", content: "Administration" },
    ];
};

const AdminPage = () => {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                        Administration
                    </h1>
                </div>
            </div>
        </main>
    );
};

export default AdminPage;
=======
export const meta = () => {
  return [{ title: "Admin - Catalyst" }];
};

const AdminPage = () => {
  return <div>Admin Page</div>;
};

export default AdminPage;
>>>>>>> d5db8ee (feat: Add admin token modal and related hooks for admin authentication)
