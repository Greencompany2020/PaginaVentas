import '../styles/globals.css'
import ProviderAuth from '../context/AuthContext';
import NotificationProvide from '../components/notifications/NotificationsProvider';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || (page => page);
  
  return(
    <ProviderAuth>
      <NotificationProvide>
          { getLayout(<Component {...pageProps} />)}
      </NotificationProvide>
    </ProviderAuth>
  )
}
export default MyApp
