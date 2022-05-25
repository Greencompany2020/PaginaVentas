import { InitialContextProvider } from '../context/InitialContext';
import ProviderUse from '../context/UserContext';
import ModalAlert from '../components/modals/ModalAlert';
import '../styles/globals.css'


function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || (page => page);
  
  return(
      <ProviderUse>
        <ModalAlert>
          <InitialContextProvider>
          { getLayout(<Component {...pageProps} />)}
          </InitialContextProvider>
        </ModalAlert>
      </ProviderUse>
  )
}

export default MyApp
