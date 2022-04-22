import axios from "axios";
import jsCookie from "js-cookie";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1` || null;
const token = jsCookie.get('accessToken'); 

const ApiProvider = axios.create({
  baseURL,
  headers:{'Authorization': `Bearer ${token}`}
});



export default ApiProvider;
