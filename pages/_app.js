import Head from 'next/head';
import '../styles/globals.css'
import NotificationProvide from '../components/notifications/NotificationsProvider';
import {Provider} from 'react-redux'
import store from '../redux/store';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || (page => page);

  return (
    <Provider store={store}>
      <NotificationProvide>
        <Head>
          <title>Pagina de ventas</title>
        </Head>
        {getLayout(<Component {...pageProps} />)}
      </NotificationProvide>
    </Provider>
  )
}

export default MyApp
