import { useState, createContext, useCallback, useContext } from "react";

const InitialContextState = createContext();

const useInitialContextState = () => {
  const context = useContext(InitialContextState);

  if (context === undefined) {
    throw new Error("useInitialContextState fue usado fuera de su Provider");
  }

  return context;
}

const InitialContextProvider = ({ children }) => {
  const [tiendas, setTiendas] = useState([]);
  const [plazas, setPlazas] = useState([]);

  const updateTiendas = useCallback((newTiendas) => {
    setTiendas(newTiendas)
  }, []);

  const updatePlazas = useCallback((newPlazas) => {
    setPlazas(newPlazas);
  }, []);
  
  return (
    <InitialContextState.Provider value={{ tiendas, plazas, updateTiendas, updatePlazas }}>
      {children}
    </InitialContextState.Provider>
  )
}

export { InitialContextProvider, useInitialContextState }
