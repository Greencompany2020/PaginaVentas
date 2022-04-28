import { InitialContextProvider } from '../context/InitialContext';
import { UserContextProvider } from '../context/UserContext';
import ProviderAuth from '../context/AuthContext';
import '../styles/globals.css'


function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || (page => page);
  
  return(
    <ProviderAuth>
      <UserContextProvider>
        <InitialContextProvider>
          { getLayout(<Component {...pageProps} />)}
        </InitialContextProvider>
      </UserContextProvider>
    </ProviderAuth>
  )
}

export default MyApp
