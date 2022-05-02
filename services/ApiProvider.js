import axios from "axios";
import jsCookie from "js-cookie";
import * as jose from 'jose';
import dayjs from "dayjs";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1` || null;

const ApiProvider = axios.create({
  baseURL,
  withCredentials: true,
});


//Este interceptor actualiza el token
ApiProvider.interceptors.request.use(async req => {
  const token = jsCookie.get('accessToken'); 
  if(token){
    const userToken = jose.decodeJwt(token);
    const isExpired = dayjs.unix(userToken.exp).diff(dayjs()) < 1;

    if(isExpired){
      try{
        const {data} = await axios.get(`${baseURL}/auth/refresh`,{withCredentials: true});
        const newToken = data.accessToken;
        jsCookie.set('accessToken',  newToken,{expires: 1});
        req.headers.Authorization = `Bearer ${ newToken}`
      }catch(err){
        jsCookie.remove('accessToken')
        window.location.href = '/';
        console.log(err);
      }
    }else{
      req.headers.Authorization =  req.headers.Authorization = `Bearer ${ token}`
    }
  }

 return req;
})


export default ApiProvider;
