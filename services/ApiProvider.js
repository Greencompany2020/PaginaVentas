import axios from "axios";
import jsCookie from "js-cookie";
import jwtDecode from "jwt-decode";
import fromUnixTime from 'date-fns/fromUnixTime';
import differenceInMinutes from "date-fns/differenceInMinutes";

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
    return newToken;
  }catch(err){
    throw err;
  }
}

ApiProvider.interceptors.request.use(
  async request  => {
    const currentToken = jsCookie.get('accessToken');
    if(currentToken){
      const {exp}=  jwtDecode(currentToken);
      const expirationDate = fromUnixTime(exp);
      const timeLeft = differenceInMinutes(expirationDate, new Date());
      const leftTimeToRefresh = process.env.LEFT_TIME_TO_REFRESH || 5;
      let cookieSet = currentToken;
      if(timeLeft <= leftTimeToRefresh){
        try {
          const newToken = await refreshToken();
          jsCookie.set('accessToken', newToken);
          cookieSet = newToken;
        } catch (error) {
          jsCookie.remove('accessToken');
          jsCookie.remove('jwt');
          alert('sesion expirada');
          window.location.href = '/';
        }
      }
      request.headers['Authorization'] = `Bearer ${cookieSet}`;
    }
    return request;
  },
  error => {
    throw error;
  }
)

export default ApiProvider;
