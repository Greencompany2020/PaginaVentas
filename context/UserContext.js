import { useState, createContext, useContext, useCallback } from "react";

const UserContextState = createContext({});

const useUserContextState = () => {
  const context = useContext(UserContextState);

  if (context === undefined) {
    throw new Error("useInitialContextState fue usado fuera de su Provider");
  }

  return context;
}

const UserContextProvider = ({ children }) => {
  const [userLevel, setUserLevel] = useState(6);

  const updateUserLevel = useCallback((newUserLevel) => {
    setUserLevel(newUserLevel)
  }, []);

  return (
    <UserContextState.Provider value={{ userLevel, updateUserLevel }}>
      {children}
    </UserContextState.Provider>
  )
}

export {UserContextProvider, useUserContextState};
