import ProviderUse from '../context/UserContext';
import ModalAlert from '../components/modals/ModalAlert';
import '../styles/globals.css'


function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || (page => page);
  
  return(
      <ProviderUse>
        <ModalAlert>
          { getLayout(<Component {...pageProps} />)}
        </ModalAlert>
      </ProviderUse>
  )
}

export default MyApp
