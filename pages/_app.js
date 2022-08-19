import Head from 'next/head';
import '../styles/globals.css'
import ProviderAuth from '../context/AuthContext';
import NotificationProvide from '../components/notifications/NotificationsProvider';
import {Provider} from 'react-redux'
import store from '../redux/store';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || (page => page);
  
  return(
    <Provider store={store}>
      <NotificationProvide>
        <ProviderAuth>
          <Head>
            <title>Pagina de ventas</title>
          </Head>    
          { getLayout(<Component {...pageProps} />)}
        </ProviderAuth>
      </NotificationProvide>
    </Provider>
  )
}

export default MyApp
