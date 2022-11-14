import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AktywacjaUzytkownika() {
  const router = useRouter();

  useEffect(() => {
    async function publishClient() {
      const token = router.query.token;
      const apiEndpointUrl = "/api/session";

      if (token) {
        try {
          await axios.patch(apiEndpointUrl, { token });
        } catch (error) {
          console.error(error);
        }
      }
    }
    publishClient();
  }, [router]);

  return <h1>Zalogowałeś się</h1>;
}
