import { useState, createContext, useContext, useCallback } from "react";
import useProvideUser from "../hooks/useUser";

const UserContext = createContext();

const ProviderUser = ({children}) => {
  const userHook = useProvideUser();
  return <UserContext.Provider value={userHook}>{children}</UserContext.Provider>
}

export const useUser = () => {
  return useContext(UserContext);
}


export default ProviderUser;

/*
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

const userConfContexProvider = () => {
  const [userConf, setUserConf] = useState({});
}

export {UserContextProvider, useUserContextState};
*/