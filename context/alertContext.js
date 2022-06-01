import { createContext, useContext } from "react";
import  useProvideAlert from "../hooks/useAlert";

const AlertContext = createContext();
const ProviderAlert = ({children}) => {
    const alertHook =  useProvideAlert();
    return <AlertContext.Provider value={alertHook}>{children}</AlertContext.Provider>
}

export const useAlert = () => {
    return useContext(AlertContext)
}

export default ProviderAlert;