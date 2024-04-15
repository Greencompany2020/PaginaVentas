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
}

export const UserServiceInstance = new UserService()
