import { useRouter } from "next/router";
import cookie from "js-cookie";
import { useEffect, useState } from "react";
import LoaderComponent from "./Loader";
import {useAuth} from '../context/AuthContext';
import authService from "../services/authService";
import { urlExceptions } from "../utils/constants";


const witAuth = (Component) => {

  const AuthorizationComponent = () => {
    const router = useRouter();
    const service = authService();
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState({});
    const {setAuth} = useAuth();

    const getConfiguration = (userParams) => {
      const configuration = {}
      if (userParams) {
        for (const item in userParams) {
          let value = null;
          switch (typeof (userParams[item])) {
            case 'string':
              if (userParams[item] == 'Y' || userParams[item] == 'N') {
                value = (userParams[item] == 'Y') ? 1 : 0;
              } else {
                value = userParams[item] || null
              }
              break;

            case 'number':
              value = userParams[item] || null;
              break;
          }
          Object.assign(configuration, { [item]: value });
        }
      }
      return configuration;
    }
    /**
     * si el usuario no esta autorizado remplaza la direccion
     * si el usuario no tiene token lo redirecciona al login
     * si el usuario tiene token y quiere ingresar al login lo redirige al dashboard
     * @returns
     */
    const pathEvaluate = async () => {
  
        try {
          const token = cookie.get('accessToken');
          const {asPath} = router;
          const exceptions = urlExceptions.find(path => path.pathname == asPath);

          if(!exceptions && token){
            const response = await service.getUserAuthorization(asPath);
            if(!response.access) router.replace('/unauthorized');
            setConfig(getConfiguration(response.config));
          }
          else if(exceptions.tokenRequired && !token){
            router.push('/')
          }
          setAuth(true);
          setLoading(false)
        } catch (error) {
          router.push('/')
        }
      }

    useEffect(() => {
      pathEvaluate();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return loading ? <LoaderComponent /> : <Component config={config} />;
  };

   /**
   * Este procedimiento solo se ejecuta desde el servidor
   * @param {*} req
   * @param {*} res
   * @returns
   */

    AuthorizationComponent.getInitialProps = async ({ req, res }) => {
      if (req && res) {
        const { url } = req;
        const { accessToken } = req.cookies;

        if (url !== "/" && !accessToken) {
          res.writeHead(302, {
            location: "/",
          });
          res.end();
        } else if (url == "/" && accessToken) {
          res.writeHead(302, {
            location: "/dashboard",
          });
          res.end();
        }
      }
      /**
       * ¯\_(ツ)_/¯
       */
      return { nothingToseeHere: "yay" };
};

  return AuthorizationComponent;
};

export default witAuth;

