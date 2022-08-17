import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { urlExceptions } from "../utils/constants";
import authService from "../services/authService";
import jsCookie from 'js-cookie';
import { useSelector } from "react-redux";
import Loader from './Loader'

const witAuth = (Component) => {

  const AuthorizationComponent = (props) => {
    const service = authService();
    const router = useRouter();
    const {asPath} = router;
    const token = jsCookie.get('accessToken');
    const [config, setConfig] = useState({});
    const [loading, setLoading] = useState(true);
    const {isAuth, system:{isFetching}} = useSelector(state => state);

    const parseParams = (userParams) => {
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
    
    useEffect(()=>{
      (async()=> {
        if(!isFetching && isAuth){
          try {
            const pathExeption = urlExceptions.find(url => url.pathname == asPath);
            if(!pathExeption && token){
              setLoading(true);
              const {access, config} = await service.getUserAuthorization(asPath);
              setConfig(parseParams(config));
              setLoading(false);
              if(!access) router.replace('/unauthorized')
            }
            else if(pathExeption.tokenRequired && !token){
              router.push('/')
            } 
          } catch (error) {
            console.error(error);
          }
        }
      })()
    },[isAuth])

    return loading ? <Loader/> : <Component config={config}/>
  };

  

   /**
   * Este procedimiento solo se ejecuta desde el servidor
   * @param {*} req
   * @param {*} res
   * @returns
   */

   
  AuthorizationComponent.getInitialProps = async ({ req, res }) => {
    let token = null;
    let path = null
    if (req && res) {
      const { url } = req;
      const { accessToken } = req.cookies;
      token = accessToken;
      path = url
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
  
    return {token, path};
  };

  return AuthorizationComponent;
};

export default witAuth;

