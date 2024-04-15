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
  async updateGlobalParameters (body) {
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
}

export const UserServiceInstance = new UserService()
