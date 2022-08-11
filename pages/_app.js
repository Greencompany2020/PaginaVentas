import Head from 'next/head';
import '../styles/globals.css'
import ProviderAuth from '../context/AuthContext';
import NotificationProvide from '../components/notifications/NotificationsProvider';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || (page => page);
  
  return(
    <NotificationProvide>
      <ProviderAuth>
        <Head>
          <title>Pagina de ventas</title>
        </Head>    
        { getLayout(<Component {...pageProps} />)}
      </ProviderAuth>
    </NotificationProvide>
  )
}
export default MyApp
