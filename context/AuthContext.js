import { createContext, useContext} from "react";
import useProviderAuth from "../hooks/useAuth";

const AuthContext = createContext();

const ProviderAuth = ({children}) => {
  const authHook = useProviderAuth();
  return <AuthContext.Provider value={authHook}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext);
}

export default ProviderAuth;
