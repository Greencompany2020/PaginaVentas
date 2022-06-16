import axios from "axios";
import jsCookie from "js-cookie";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1` || null;
const ApiProvider = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${jsCookie.get('accessToken') || ''}`,
    'Content-Type': 'application/json',
  }
});


const refreshToken = async () => {
  try{
    const {data} = await axios.get(`${baseURL}/auth/refresh`,{
      withCredentials: true,
      headers: { 
        Authorization: `Bearer ${jsCookie.get('accessToken') || ''}`,
        'Content-Type': 'application/json',
      }
    });
    const newToken = data.accessToken;
    jsCookie.set('accessToken',  newToken);
    return newToken;
  }catch(err){
     jsCookie.remove('accessToken');
     jsCookie.remove('jwt');
     return false;
  }
}


ApiProvider.interceptors.response.use(
  response => response,
  async (err) => {
    const prevRequest = err?.config;
    if(err?.response?.status === 401 && !prevRequest.__isRetryRequest){
      prevRequest.__isRetryRequest = true;
      const newToken = await refreshToken();
      prevRequest.headers['Authorization'] = `Bearer ${newToken}`;
      return ApiProvider(prevRequest);
    }
  }
)

export default ApiProvider;
