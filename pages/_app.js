import { InitialContextProvider } from '../context/InitialContext';
import { UserContextProvider } from '../context/UserContext';
import ProviderAuth from '../context/AuthContext';
import '../styles/globals.css'
import Router from 'next/router';

Router.events.on('routeChangeStart',() => {
  return (
    <div>Hola</div>
  )
})

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || (page => page)
  return getLayout(
    <ProviderAuth>
      <UserContextProvider>
        <InitialContextProvider>
          <Component {...pageProps} />
        </InitialContextProvider>
      </UserContextProvider>
    </ProviderAuth>
  )
}

export default MyApp
