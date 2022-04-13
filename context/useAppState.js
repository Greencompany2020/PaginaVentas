import { useEffect } from "react";
import { getPlazas, getTiendas } from "../services/tiendasPlazasService";
import { isError } from "../utils/functions";
import { useInitialContextState } from "./InitialContext";
import { useUserContextState } from "./UserContext"

export const useAppState = () => {
  const { userLevel } = useUserContextState();
  const { tiendas, plazas, updateTiendas, updatePlazas } = useInitialContextState();

  useEffect(() => {
    const fetchTiendasPlazas = async () => {
      const resultTiendas = await getTiendas(userLevel);
      const resultPlazas = await getPlazas(userLevel);

      if (isError(resultTiendas) && isError(resultPlazas)) {
        return;
      }

      updateTiendas(resultTiendas)
      updatePlazas(resultPlazas);

    }

    fetchTiendasPlazas()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {tiendas, plazas}
}
