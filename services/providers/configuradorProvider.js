import axios from "axios";
import Cookies from "js-cookie";
import createAuthRefreshInterceptor from 'axios-auth-refresh';

const BASE_URL_CONFIGURADOR = `${process.env.API_CONFIGURADOR_URL}/api/v1/configurador`;

const configuradorProvider = axios.create({
    baseURL: BASE_URL_CONFIGURADOR,
    withCredentials: true,
});

configuradorProvider.interceptors.request.use((request) =>{
    request.headers['Authorization'] = `Bearer ${Cookies.get('accessToken') || ''} `
    return request;
})

const refreshToken = (req) => 
axios.get(`${BASE_URL_CONFIGURADOR}/auth/refresh`,{withCredentials: true})
.then(response => {
    Cookies.set('accessToken', response.data.accessToken);
    req.response.config.headers['Authorization'] = 'Bearer' + response.data.accessToken;
    return Promise.resolve();
})
.catch(error =>{
    Cookies.remove('accessToken');
    Cookies.remove('jwt');
    alert('sesion expirada');
    window.location.href = '/'
    return Promise.reject()
})

createAuthRefreshInterceptor(configuradorProvider, refreshToken);

export default configuradorProvider;

