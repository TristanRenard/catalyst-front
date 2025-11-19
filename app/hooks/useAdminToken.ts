import { useEffect, useState } from "react";

export const useAdminToken = (): string | null => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    setToken(storedToken);

    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("adminToken");
      setToken(updatedToken);
    };

    window.addEventListener("storage", handleStorageChange);
    
    window.addEventListener("adminTokenChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("adminTokenChange", handleStorageChange);
    };
  }, []);

  return token;
};