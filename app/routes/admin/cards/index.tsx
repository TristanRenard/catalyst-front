import axios from "axios";
import { useEffect, useState } from "react";
import { useAdminToken } from "~/hooks/useAdminToken";

const CardsPage = () => {
  const [cards, setCards] = useState<Array<any>>([]);
  const adminToken = useAdminToken();

  console.log("Cards data:", cards);

  useEffect(() => {
    if (!adminToken) return;

    (async () => {
      try {
        const { status, statusText, data } = await axios.get("/api/energie", {
          headers: {
            "X-API-Secret": adminToken,
          },
        });
        if (status === 200) {
          setCards(data);
        } else {
          console.error("Failed to fetch cards:", statusText);
        }
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    })();
  }, [adminToken]);

  return <div>Cards Management Page</div>;
};

export default CardsPage;
