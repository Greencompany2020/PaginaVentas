import ModalAlert from '../components/modals/ModalAlert';
import '../styles/globals.css'
import ProviderAuth from '../context/AuthContext';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || (page => page);
  
  return(
    <ProviderAuth>
      <ModalAlert>
        { getLayout(<Component {...pageProps} />)}
      </ModalAlert>
    </ProviderAuth>
  )
}
export default MyApp
