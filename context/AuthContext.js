import {useContext, createContext} from "react";
import useProvideAuth from "../hooks/useAuth";

const AuthContext = createContext();
const ProviderAuth = ({children}) => {
    const auth = useProvideAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext);
}

export default ProviderAuth;