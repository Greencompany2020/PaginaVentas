import { InitialContextProvider } from '../context/InitialContext';
import { UserContextProvider } from '../context/UserContext';
import ProviderAuth from '../context/AuthContext';
import ProviderUse from '../context/UserContext';
import '../styles/globals.css'


function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || (page => page);
  
  return(
    <ProviderAuth>
      <ProviderUse>
        <InitialContextProvider>
          { getLayout(<Component {...pageProps} />)}
        </InitialContextProvider>
      </ProviderUse>
    </ProviderAuth>
  )
}

export default MyApp
