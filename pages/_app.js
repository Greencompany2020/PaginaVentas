import { InitialContextProvider } from '../context/InitialContext'
import { UserContextProvider } from '../context/UserContext'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || (page => page)
  return getLayout(
    <UserContextProvider>
      <InitialContextProvider>
        <Component {...pageProps} />
      </InitialContextProvider>
    </UserContextProvider>
  )
}

export default MyApp
