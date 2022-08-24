import axios from "axios";
import jsCookie from 'js-cookie';
import jwtDecode from "jwt-decode";
import differenceInMinutes from "date-fns/differenceInMinutes";
import fromUnixTime from 'date-fns/fromUnixTime';

const BASE_URL_CONFIGURADOR = `${process.env.API_CONFIGURADOR_URL}/api/v1/configurador`;
const BASE_URL_REPORTE = `${process.env.API_VENTAS_URL}/api/v1/ventas`;
const leftTime = process.env.LEFT_TIME_TO_REFRESH || 5;

let isRefreshing = false;

function refreshToken() {
    return axios.get(`${BASE_URL_CONFIGURADOR}/auth/refresh`, {
        withCredentials: true,
    })
}

function isTokenValidYet() {
    const currToken = jsCookie.get('accessToken');
    if (currToken) {
        const { exp } = jwtDecode(currToken);
        const expirationTime = fromUnixTime(exp);
        const expirationTimeLeft = differenceInMinutes(expirationTime, new Date());
        return (expirationTimeLeft >= leftTime)
    }
    return true;
}

function expiredSession() {
    jsCookie.remove('accessToken');
    jsCookie.remove('jwt');
    alert("Sesion esxpirada")
    window.location.href = '/'
}


/* PROVEEEDOR DEL CONFIGURADOR */
export const configuradorProvider = axios.create({
    baseURL: BASE_URL_CONFIGURADOR,
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${jsCookie.get('accessToken') || ''}`,
        'Content-Type': 'application/json'
    }
});


configuradorProvider.interceptors.request.use(
    async req => {
        if (!isTokenValidYet() && !isRefreshing) {
            isRefreshing = true;
            refreshToken()
                .then(({ data }) => {
                    jsCookie.remove('accessToken');
                    jsCookie.set('accessToken', data.accessToken)
                    req.headers['Authorization'] = `Bearer ${jsCookie.get('accessToken') || ''}`;
                    isRefreshing = false;   
                })
                .catch(({ response }) => {
                    isRefreshing = false;
                    expiredSession();
                })
        }
        else{
            req.headers['Authorization'] = `Bearer ${jsCookie.get('accessToken') || ''}`   
        }
        return req;
    },
    err => { throw err }
)


/* PROVEEDOR PARA LOS REPORTES */
export const reporteProvider = axios.create({
    baseURL: BASE_URL_REPORTE,
    withCredentials: true,
    headers: {
      
        Authorization: `Bearer ${jsCookie.get('accessToken') || ''}`,
        'Content-Type': 'application/json'
    }
});


reporteProvider.interceptors.request.use(
    async req => {
        if (!isTokenValidYet() && !isRefreshing) {
            isRefreshing = true;
            refreshToken()
                .then(({ data }) => {
                    jsCookie.remove('accessToken');
                    jsCookie.set('accessToken', data.accessToken)
                    req.headers['Authorization'] = `Bearer ${jsCookie.get('accessToken') || ''}`;
                    isRefreshing = false;   
                })
                .catch(({ response }) => {
                    isRefreshing = false;
                    expiredSession();
                })
        }
        else{
            req.headers['Authorization'] = `Bearer ${jsCookie.get('accessToken') || ''}` 
        }
        return req;
    },
    err => { throw err }
)
