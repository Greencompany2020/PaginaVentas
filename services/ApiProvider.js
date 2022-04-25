import axios from "axios";
import jsCookie from "js-cookie";
import * as jose from 'jose';
import dayjs from "dayjs";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1` || null;
const token = jsCookie.get('accessToken'); 

const ApiProvider = axios.create({
  baseURL,
  withCredentials: true,
  headers:{
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});



//Este interceptor actualiza el token
ApiProvider.interceptors.request.use(async req => {
  
  if(token){
    const userToken = jose.decodeJwt(token);
    const isExpired = dayjs.unix(userToken.exp).diff(dayjs()) < 1;

    if(!isExpired) return req;

    try{
      const {data} = await axios.get(`${baseURL}/auth/refresh`,{withCredentials: true});
      jsCookie.set('accessToken', data.accessToken,{expires: 1});
    }catch(err){
      console.log(err);
      jsCookie.remove('accessToken')
      window.location.href = '/';
    }
  }

 return req;
})


export default ApiProvider;
