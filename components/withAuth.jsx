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
    const {auth, setAuth} = useAuth();
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState({});
   
    /**
     * callback que redirige la pagina
     * @param {*} page
     * @param {*} opt
     */
    const redirecTo = (page, opt = "push") => {
      switch (opt) {
        case "replace":
          router.replace(page);
          break;
        case "push":
          router.push(page);
          break;
        default:
          router.push(page);
          break;
      }
    };

    /**
     * Evalua si el usuario tiene tiene un token de acceso
     * Si lo tiene y esa expirado tratara de refrescarlo
     * @returns boolean
     */
    const userHastoken = () => {
      const token = cookie.get("accessToken");
      if(!token) return false;
      if(!auth) setAuth(true);
      return true;
    };

    /**
     * Evalua si el usuario tiene permisos para ingresar al point
     * @returns data
     */
    const getAuthToPath = async () => {
      try {
        const data = service.getUserAuthorization(router.asPath);
        return data; 
      } catch (error) {
        return false;
      }
    };

    const getConfiguration = (userParams) =>{
      const configuration = {}
      if(userParams){
        for(const item in userParams){
          let value = null;
          if(isNaN(userParams[item])){
            value = (userParams[item] == 'Y') ? 1 : 0;
          }else{
            value = userParams[item] || 0;
          }
          Object.assign(configuration, {[item]:value});
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
      const attemptException = urlExceptions.find(
        (paths) => paths.pathname == router.asPath
      );
      const userToken = userHastoken();
      if (attemptException) {
        if (attemptException.tokenRequired && !userToken)
          redirecTo("/", "push");
        if (attemptException.pathname == "/" && userToken)
          redirecTo("/dashboard", "push");
        setLoading(false);
      } else {
        if (!userToken) redirecTo("/", "push");
        const userAccess = await getAuthToPath();
        if (!userAccess.access) return redirecTo("/unauthorized", "replace");
        setLoading(false);
        setConfig(getConfiguration(userAccess.config));
      }
    };

    useEffect(() => {
      pathEvaluate();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return loading ? <LoaderComponent /> : <Component config={config}/>;
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

