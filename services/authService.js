import reporteProvider from "./providers/reporteProvider";
import configuradorProvider from "./providers/configuradorProvider";

/**
 * Localidades asignadas al usuario
 * @typedef {Object} Locations
 * @property {number} Codigo
 * @property {string} Nombre
 */

/**
 * Almacén de tienda
 * @typedef {Object} StoreWarehouse
 * @property {string} nombre
 * @property {string} codigo
 * @property {string} tipo
 * @property {string} tipoMaximizador
 * @property {boolean} selected Si se ha asignado al usuario. Por default en
 * false. Usado para elementos visuales
 */

/**
 * Tiendas asignadas al usuario
 * @typedef {Object} Store
 * @property {string} plaza
 * @property {number} codigoLocalidad
 * @property {string} region
 * @property {string} nombreRegion
 * @property {Array<StoreWarehouse>} almacenes
 */

/**
 * Datos de Usuario
 * @typedef {Object} UserData
 * @property {number} Id
 * @property {string} UserCode
 * @property {number} NoEmpleado
 * @property {number} Level
 * @property {number} Clase
 * @property {string} Nombre
 * @property {string} Apellidos
 * @property {string} ImgPerfil
 * @property {number} idGrupo
 * @property {string} UserSAP
 * @property {string} NombreGrupo
 * @property {string} Email
 * @property {string} PasswordSAP
 * @property {string | null} DefaultReposicion
 * @property {Array<Locations>} Localidades
 * @property {Array<Store>} Tiendas
 */

/**
 * @typedef {Object} GlobalParameters
 * @property {number} idAcceso
 * @property {string} point Ruta de reportes de
 * ventas seleccionada principal.
 * @property {string | null} confirmGlobalShippingList
 * @property {string | null} confirmGlobalPackingList
 * @property {string | null} tipoTraspasos Tipo de usuario para traspasos. Valores: tienda - bodega
 */

/**
 * Perfil de Usuario
 * @typedef {Object} UserProfile
 * @property {UserData} user
 */


/**
 *
 * @returns {
 * {logout: (() => Promise<any|undefined>),
 * getUserAuthorization: ((function(*): Promise<any|undefined>)|*),
 * getUserData: (function(): Promise<[UserProfile, any, any, GlobalParameters]>),
 * login: ((function(*): Promise<any|undefined>)|*)}
 * }
 */
export default function authService(){
    const login = async (body) => {
        try {
            const {data} = await configuradorProvider.post('/auth/login', body);
            return data;
        } catch (error) {
            throw error;
        }
    }

    const logout = async () => {
        try {
            const {data} = await configuradorProvider.get('/auth/logout');
            return data;
        } catch (error) {
            throw error;
        }
    }

    const getUserAuthorization = async (point) => {
        const body = {point};
        try{
            const {data} = await configuradorProvider.post('/user/dashboards/acceso', body);
            return data;
        }catch(err){
           throw err;
        }
    }

  /**
   * Obtiene los datos para el perfil del usuario.
   * @returns {Promise<[UserProfile, any, any, GlobalParameters]>}
   */
  const getUserData = async () => {

        return Promise.all([
            configuradorProvider.get('/user/perfil'),
            reporteProvider.get('/tiendasplazas/plazas'),
            reporteProvider.get('/tiendasplazas/tiendas'),
            configuradorProvider.get(`user/dashboards/parameters/globals/1`),
        ])
        .then(response => (response.map(res => res.data)))
        .catch(error => {throw error});

    }


    return{
        login,
        logout,
        getUserAuthorization,
        getUserData,
    }
}
