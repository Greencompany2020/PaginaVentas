import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import authService from "../services/authService";
import {useSelector, useDispatch} from 'react-redux';
import setInitialData from "../redux/actions/setInitialData";
import {urlExceptions} from '../utils/constants';
import { useNotification } from "./notifications/NotificationsProvider";
import Loader from '../components/Loader';

export default function withAuth(Component){

  function parseParams(params){
    const newParams = {};
    if(params){
      for(let item in params){
        let value = null;
        switch( typeof params[item]){

          case 'string':
            if(params[item] == 'Y' || params[item] == 'N'){
              value = (params[item] == 'Y') ? 1 : 0;
            }
            else {
              value = null;
            }
          break;

          case 'number':
            value = params[item] || null;
          break;
        }
         Object.assign(newParams, {[item]: value});
      }
    }

    console.log(newParams);
    return newParams;
  }


  function AuthComponent({pathname, token}){
    const router = useRouter();
    const service = authService();
    const {isAuth} = useSelector(state => state);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [config, setConfig] = useState({});
    const sendNotification = useNotification();

    const initialData = useCallback(async () => {
      if(token && !isAuth){
        try {
          const response = await service.getUserData();
          dispatch(setInitialData(response));
        } catch (error) {
          sendNotification({
            type: 'ERROR',
            message: 'Error al consultar los datos del usuario'
          });
        }
      }
    }, [])


    const evaluatePathname = useCallback(async () => {
      const pathException = urlExceptions.find(url => url.pathname == pathname);
      if(!pathException){
        try {
          const {access, config} = await service.getUserAuthorization(pathname);
          if(!access) router.replace('/unauthorized');
          setConfig(parseParams(config));
        } catch (error) {
          sendNotification({
            type: 'ERROR',
            message: 'Error al consultar acceso de usuario'
          });
        }
        
      }
    }, [pathname]);


    useEffect(() => {
      (async () => {
        await initialData();
        await evaluatePathname();
        setIsLoading(false);
      })()
    }, [])


    return isLoading ?
    <Loader/> : 
    <Component config={config}/>
  }

  AuthComponent.getInitialProps = async ({req, res, pathname}) => {
    let token = null;
    if(req && res){

      const {accessToken} = req.cookies;
      token = accessToken;
      if(!accessToken && pathname !== '/'){
        res.writeHead(302,{
          location:'/'
        });
        res.end();
      }
      
      else if(accessToken && pathname == '/'){
        res.writeHead(302,{
          location:'/dashboard'
        });
        res.end();
      }
    }

    return{pathname, token}
  }

  return AuthComponent;
}