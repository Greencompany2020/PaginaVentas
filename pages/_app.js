import { InitialContextProvider } from '../context/InitialContext';
import ProviderUse from '../context/UserContext';
import '../styles/globals.css'


function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || (page => page);
  
  return(
      <ProviderUse>
        <InitialContextProvider>
          { getLayout(<Component {...pageProps} />)}
        </InitialContextProvider>
      </ProviderUse>
  )
}

export default MyApp
