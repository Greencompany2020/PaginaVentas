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
