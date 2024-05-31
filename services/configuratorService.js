import configuradorProvider from './providers/configuradorProvider'

export default function configuratorService() {
  /**
   * @typedef {Object} User
   * @property {number} Id
   * @property {string} UserCode
   * @property {string} Email
   * @property {number} NoEmpleado
   * @property {number} Level
   * @property {number} Clase
   * @property {string} Nombre
   * @property {string} Apellidos
   * @property {string} UserSAP
   * @property {number} IdGrupo
   * @property {string} NombreGrupo
   * @property {string} Rol
   * @property {number} idProyect
   * @property {string | null} PasswordSAP
   * @property {string | null} DefaultReposicion
   */

  /**
   * Obtiene los usuarios registrados
   * @returns {Promise<Array<User>>}
   */

	const getUsers = async () => {
		try {
			const { data } = await configuradorProvider.get('/usuarios?page=1&size=300')
			return data
		} catch (error) {
			throw error
		}
	}

  /**
   * @typedef {Object} UserGroup
   * @property {number} Id
   * @property {string} Nombre
   * @property {number} IdProyecto
   * @property {string} NombreProyecto
   */

  /**
   * Obtiene la lista de grupos de usuario
   * @returns {Promise<Array<UserGroup>>}
   */
	const getGroups = async () => {
		try {
			const { data } = await configuradorProvider.get('/grupos')
			return data
		} catch (error) {
			throw error
		}
	}

	/**
	 * @typedef {Object} Access
	 * @property {string} point
	 * @property {number} idDashboard
	 * @property {string} menu
	 * @property {string} reporte
	 * @property {string} nombreReporte
	 * @property {boolean} acceso Si tiene permiso. Por default en false,
	 * ya que se mapea contra los valores del usuario.
	 * @property {number} idProyect
	 * @property {string} nombreProyecto
	 */
	/**
	 * Obtiene todos los accesos registrados
	 * @returns {Promise<Array<Access>>}
	 */
	const getAccess = async () => {
		try {
			const { data } = await configuradorProvider.get('/accesos')
			return data
		} catch (error) {
			throw error
		}
	}

	/**
	 * @typedef {Object} UserLocations
	 * @property {number} Codigo
	 * @property {string} Nombre
	 */

	/**
	 * @typedef {Object} UserAccess
	 * @property {boolean} acceso - Tiene permiso al acceso
	 * @property {string} menu
	 * @property {string} reporte
	 * @property {number} idDashboard
	 * @property {number} idAcceso
	 * @property {string} nombreReporte
	 */

	/**
	 * @typedef {Object} UserProfileGlobalParameters
	 * @property {number} favoriteAccess
	 * @property {string} confirmPackingList
	 * @property {string} confirmShippingList
	 * @property {string} tipoTraspasos
	 */

	/**
	 * @typedef {Object} UserProfileWithAccess
	 * @property {number} Id
	 * @property {string} UserCode
	 * @property {number} NoEmpleado
	 * @property {number} Level
	 * @property {number} Clase
	 * @property {string} Nombre
	 * @property {string} Apellidos
	 * @property {string} UserSAP
	 * @property {string} PasswordSAP
	 * @property {number} DefaultReposicion
	 * @property {string} Email
	 * @property {number} IdGrupo
	 * @property {number} IdGrupoDigitalizacion
	 * @property {Array<UserLocations>} Localidades
	 * @property {Array<UserAccess>} Accesos
	 * @property {UserProfileGlobalParameters} Parametros
	 */

  /**
   * @typedef {Omit<UserProfileWithAccess, "Accesos">} UserDetailWithoutAccessList
   */

	/**
	 * @typedef {Object} UserDetail
	 * @property {UserDetailWithoutAccessList} usuario
	 * @property {Array<Access>} accesos
	 */

	/**
	 * Obtiene los datos del usuario junto con los accesos asignados.
	 * @param {number} userId
	 * @returns {Promise<UserDetail>}
	 */
	const getUserDetail = async (userId) => {
		try {
			const { /** @type {UserProfileWithAccess} */ data } = await configuradorProvider.get(`/accesos/perfil/${userId}`)
			const response = await getAccess()
			const { Accesos, ...usuario } = data
			const formatedData = replaceAccess(response, Accesos)

      /** @type {UserDetail} */
			const newData = {
				usuario,
				accesos: formatedData
			}
			return newData
		} catch (error) {
			throw error
		}
	}

	const assignAccess = async (body) => {
		try {
			const response = await configuradorProvider.post('/accesos/assign', body)
			return response
		} catch (error) {
			throw error
		}
	}

	const createUser = async (body) => {
		try {
			const { data } = await configuradorProvider.post('/usuarios/create', body)
			return data
		} catch (error) {
			throw error
		}
	}

	const updateUser = async (id, body) => {
		try {
			const { data } = await configuradorProvider.put(`/usuarios/update/${id}`, body)
			return data
		} catch (error) {
			throw error
		}
	}

	const deleteUser = async (id) => {
		try {
			const { data } = await configuradorProvider.delete(`/usuarios/delete/${id}`)
			return data
		} catch (error) {
			throw error
		}
	}

	const createGroup = async (body) => {
		try {
			const { data } = await configuradorProvider.post('/grupos/create', body)
			return data
		} catch (error) {
			throw error
		}
	}

	const updateGroup = async (id, body) => {
		try {
			const params = { Nombre: body.Nombre }
			const { data } = await configuradorProvider.put(`/grupos/update/${id}`, params)
			return data
		} catch (error) {
			throw error
		}
	}

	const deleteGroup = async (id) => {
		try {
			const { data } = await configuradorProvider.delete(`/grupos/delete/${id}`)
			return data
		} catch (error) {
			throw error
		}
	}

	const createAccess = async (body) => {
		try {
			const { data } = await configuradorProvider.post('/accesos/create', body)
			return data
		} catch (error) {
			throw error
		}
	}

	const updateAccess = async (id, body) => {
		try {
			const { data } = await configuradorProvider.put(`/accesos/update/${id}`, body)
			return data
		} catch (error) {
			throw error
		}
	}

	const deleteAccess = async (id) => {
		try {
			const { data } = await configuradorProvider.delete(`/accesos/delete/${id}`)
			return data
		} catch (error) {
			throw error
		}
	}

	const configureParameters = async (idDashboard, body) => {
		try {
			const response = await configuradorProvider.post(`/dashboards/parameters/${idDashboard}`, body)
			return response
		} catch (error) {
			throw error
		}
	}

	const getParameters = async (idDashboard) => {
		try {
			const { data } = await configuradorProvider.get(`/dashboards/parameters/${idDashboard}`)
			return data
		} catch (error) {
			throw error
		}
	}

	/**
	 * Sobreescribe el permiso del acceso a partir
	 * de la configuración de acceso del usuario
	 * para poder mostrar en la UI cuáles tiene
	 * el usuario asignado.
	 * @param {Array<Access>} current
	 * @param {Array<UserAccess>} next
	 * @returns {Array<Access>}
	 */
	const replaceAccess = (current, next) => {
		const modified = current.map((item) => {
			let modify = {}
			next.forEach((userAccess) => {
				if (item.idDashboard === userAccess.idDashboard) {
					modify = { ...item, acceso: userAccess.acceso }
				}
			})
			if (Object.keys(modify).length > 0) return modify
			return { ...item, acceso: false }
		})
		return modified
	}

	const getGruposDigitalizacion = async () => {
		try {
			const { data } = await configuradorProvider.get('/grupos-digitalizacion')
			return data
		} catch (error) {
			throw error
		}
	}

	const setUserToGrupoDigitalizacion = async (body) => {
		try {
			const response = await configuradorProvider.post('/grupos-digitalizacion/usuario', body)
			return response
		} catch (error) {
			throw error
		}
	}

	const createDigitalizacionGrupo = async (body) => {
		try {
			const response = await configuradorProvider.post('/grupos-digitalizacion', body)
			return response
		} catch (error) {
			throw error
		}
	}

	const updateDigitalizacionGrupo = async (id, body) => {
		try {
			const response = await configuradorProvider.put(`/grupos-digitalizacion/${id}`, body)
			return response
		} catch (error) {
			throw error
		}
	}

	const deleteDigitalizacionGrupo = async (id) => {
		try {
			const response = await configuradorProvider.delete(`/grupos-digitalizacion/${id}`)
			return response
		} catch (error) {
			throw error
		}
	}

  /**
   * @typedef {Object} Location
   * @property {number} Codigo
   * @property {string} Localidad
   * @property {string} Inactiva
   */

  /**
   * Obtiene las tiendas y localidades existentes
   * @returns {Promise<{Localidades: Array<Location>, Tiendas: Array<Store>}>}
   */
	const getLocalities = async () => {
		try {
			const { data } = await configuradorProvider.get('/localidades')
			return data
		} catch (error) {
			throw error
		}
	}

  /**
   * @typedef {Object} SetUserShopBody
   * @property {Array<string>} tiendas Lista de nombre de tiendas a asignar
   * @example
   * {
   *   tiendas: ["TA-M01", "TA-M02"]
   * }
   */

  /**
   * Asigna una lista de tiendas al usuario
   * @param {number} id
   * @param {SetUserShopBody} body
   * @returns {Promise<void>}
   */
	const setUserLocalityShop = async (id, body) => {
		try {
			await configuradorProvider.put(`/user/tiendas/${id}`, { tiendas: body })
		} catch (error) {
			throw error
		}
	}

	/**
	 * Obtiene la lista de tiendas asignadas al usuario
	 * @param {number} id ID de usuario
	 * @returns {Promise<{tiendas: Array<Store>}>}
	 */
	const getUserShops = async (id) => {
		try {
			const { /** @type {{tiendas: Array<Store>}} */ data } = await configuradorProvider(`/user/tiendas/${id}`)
			return data
		} catch (error) {
			throw error
		}
	}

  /**
   * @returns {Promise<Array<SAPUser>>}
   */
	const getSAPUsers = async () => {
		try {
			const { data } = await configuradorProvider.get('/usuarios/sap')
			return data
		} catch (error) {
			throw error
		}
	}

	const getProyects = async () => {
		try {
			const { data } = await configuradorProvider.get('/proyectos')
			return data
		} catch (error) {
			throw error
		}
	}

	const createProyect = async (body) => {
		try {
			const data = await configuradorProvider.post('/proyectos', body)
		} catch (error) {
			throw error
		}
	}

	const updateProyect = async (id, body) => {
		try {
			const data = await configuradorProvider.put(`/proyectos/${id}`, body)
		} catch (error) {
			throw error
		}
	}

	const deleteProyect = async (id) => {
		try {
			const data = await configuradorProvider.delete(`/proyectos/${id}`)
		} catch (error) {
			throw error
		}
	}

	return {
		getUsers,
		getGroups,
		getAccess,
		getUserDetail,
		createUser,
		updateUser,
		deleteUser,
		createGroup,
		updateGroup,
		deleteGroup,
		createAccess,
		updateAccess,
		deleteAccess,
		assignAccess,
		configureParameters,
		getParameters,
		replaceAccess,
		getGruposDigitalizacion,
		setUserToGrupoDigitalizacion,
		createDigitalizacionGrupo,
		updateDigitalizacionGrupo,
		deleteDigitalizacionGrupo,
		getLocalities,
		getSAPUsers,
		getProyects,
		createProyect,
		updateProyect,
		deleteProyect,
		setUserLocalityShop,
		getUserShops
	}
}
