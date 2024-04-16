import configuradorProvider from 'services/providers/configuradorProvider'

/**
 * @typedef {Object.<string | number>} ReportsCatalog
 * @property {number} Id
 * @property {string} Tipo
 * @property {string} Nombre
 * @property {string} UrlBase
 * @property {string} Version
 */


class UserService {

  /**
   * Obtiene los catálogos de reportes (PDF)
   * @param {{Tipo: string}} params
   * @returns {Promise<Array<ReportsCatalog>>}
   */
  async getCatalogReport(params) {
    try {
      const { data } = await configuradorProvider.post('/reportes/catalogo', params)
      return data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  /**
   * @param {UpdateGlobalParameters} body
   * @returns {Promise<UserGlobalParameters>}
   */
  async updateGlobalParameters(body) {
    try {
      await configuradorProvider.post('user/dashboards/parameters/globals', body)
      const { data } = await configuradorProvider.get(`user/dashboards/parameters/globals/1`)
      return data
    } catch (error) {
      throw error
    }
  }

  /**
   * Obtiene los parámetros globales del usuario
   * @returns {Promise<GlobalParameters>}
   */
  async getGlobalParameters () {
    try {
      const { data } = await configuradorProvider.get(`user/dashboards/parameters/globals/1`)
      return data
    } catch (error) {
      throw error
    }
  }

  /**
   * @param {{ idUser: number, defaultReposicion: number }} params
   * @returns {Promise<void>}
   */
  async updateDefaultReposicion(params) {
    try {
      const {idUser, defaultReposicion } = params
      await configuradorProvider.put(`/usuarios/default-reposicion/${idUser}`, {
        defaultReposicion
      })
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  /**
   * @returns {Promise<UserProfile>}
   */
  async getUser() {
    try {
      const { data: user } = await configuradorProvider.get('/user/perfil')
      return user
    } catch (error) {
      throw error
    }
  }

  /**
   *
   * @param body Archivo de imagen
   * @param {(progressEvent: ProgressEvent) => void} progressHandle
   * @returns {Promise<UserData>}
   */
  async updateUserAvatar(body, progressHandle)  {
    const config = {
      onUploadProgress: progressHandle
    }

    try {
      await configuradorProvider.post('user/perfil/image', body, config)
      const {  /** @type {UserProfile} */ data } = await configuradorProvider.get('/user/perfil')
      return data.user
    } catch (error) {
      throw error
    }
  }

  /**
   * Inicia el proceso de cambio de contraseña
   * @param {{ email: string }} body
   * @returns {Promise<AxiosResponse<any>>}
   */
  async requestPasswordReset(body) {
    try {
      const response = await configuradorProvider.post('/user/reset-password', body)
      return response
    } catch (error) {
      throw error
    }
  }

  /**
   * Actualiza a la nueva contraseña
   * @param {{ password: string }}body
   * @param {string} resetToken Token de reinicio.
   * @returns {Promise<AxiosResponse<any>>}
   */
  async resetPassword(body, resetToken) {
    try {
      const response = await configuradorProvider.post('/user/new-password', body, { headers: { Reset: resetToken } })
      return response
    } catch (error) {
      throw error
    }
  }

  /**
   *
   * @param {number} idAccess
   * @param {Record<string, string>} body
   * @returns {Promise<AxiosResponse<any>>}
   */
  async setAccessParameter(idAccess, body) {
    try {
      const response = await configuradorProvider.post(`user/dashboards/parameters/${idAccess}`, body)
      return response
    } catch (error) {
      throw error
    }
  }

  /**
   * @typedef {Object} Paremeters
   * @property {string} conIva
   * @property {string} semanaSanta
   * @property {string} sinAgnoVenta
   * @property {string} conVentasEventos
   * @property {string} conTiendasCerradas
   * @property {string} sinTiendasSuspendidas
   * @property {string} resultadosPesos
   * @property {string} ventasMilesDlls
   * @property {string} porcentajeVentasCompromiso
   * @property {string} noHorasVentasParciales
   * @property {string} acumuladoSemanal
   * @property {string} tipoCambioTiendas
   * @property {string} incluirTotal
   * @property {string} ventasDiaMesActual
   * @property {string} detalladoTienda
   * @property {string} incluirFinSemanaAnterior
   * @property {string} concentrado
   * @property {string} acumulado
   * @property {string} total
   * @property {string} promedio
   * @property {string} conEventos
   * @property {number} mobileReportView
   * @property {number} desktopReportView
   * @property {number} cbAgnosComparar
   * @property {string} agnosComparativos
   * @property {string} cbIncremento
   * @property {string} cbMostrarTiendas
   * @property {string} presupuestoExtraordinario
   * @property {number} idDashboard
   */

  /**
   * Obtiene los parámetros de inputs de un acceso
   * @param {number} idAccess
   * @returns {Promise<Paremeters>}
   */
  async getAccessParameters(idAccess){
    try {
      const { data } = await configuradorProvider.get(`user/dashboards/parameters/${idAccess}`)
      return data
    } catch (error) {
      throw error
    }
  }

  /**
   *
   * @param {number} idAccess
   * @param {string} body
   * @returns {Promise<Array<Dashboard>>}
   */
  async setFavoriteAccess(idAccess, body)  {
    try {
      await configuradorProvider.put(`user/dashboards/selected/${idAccess}`, { enabled: body })
      const { data } = await configuradorProvider.get('/user/perfil')
      return data.dashboards
    } catch (error) {
      throw error
    }
  }
}

export const UserServiceInstance = new UserService()
