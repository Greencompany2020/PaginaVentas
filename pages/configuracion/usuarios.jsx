import React, { useEffect, useState, useRef } from 'react'
import configuratorService from '../../services/configuratorService'
import { useNotification } from 'components/notifications/NotificationsProvider'
import Paginate from '../../components/paginate'
import UserTable from '../../components/configuration/users/UserTable'
import { FormModal } from '../../components/modals'
import UserForm from '../../components/configuration/users/UserForm'
import { getBaseLayout } from 'components/layout/BaseLayout'
import useToggle from '../../hooks/useToggle'
import UserAccessTable from '../../components/configuration/users/UserAccessTable'
import { ConfirmModal } from '../../components/modals/'
import witAuth from '../../components/withAuth'
import UserInfo from 'components/configuration/users/UserInfo'
import TabButton from 'components/configuration/TabButton'
import Drawer from 'components/commons/Drawer'
import { UserServiceInstance } from 'services/UserService'

// * Copiamos y pegamos esta definición, ya que entra con la de Location de NodeJS
/**
 * @typedef {Object} Location
 * @property {number} Codigo
 * @property {string} Localidad
 * @property {string} Inactiva
 */
// * Copiamos y pegamos esta definición, ya que entra con la de Location de Commitlint
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
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Users = (props) => {
	const service = configuratorService()
	const sendNotification = useNotification()
	const [users, setUsers] = useState(/** @type {Array<User>} */[])
	const [groups, setGroups] = useState(/** @type {Array<UserGroup>} */[])
	const [selectedUser, setSelectedUser] = useState(/** @type {UserDetail} */ {})
	const [userDetails, setUserDetail] = useState(/** @type {UserDetail} */ {})
	const [showModal, setShowModal] = useToggle(false)
	const [showRetrieve, setShowRetrieve] = useToggle(false)
	const confirmModalRef = useRef(null)
	const [digitalGroups, setDigitalGroups] = useState([])
	const [locations, setLocations] = useState(/** @type {Array<Location>} */ [])
	const [shops, setShops] = useState(/** @type {Array<Store>} */ [])
	const [userShops, setUserShops] = useState(/** @type {Array<Store>} */ [])
	const [sapUsers, setSapUsers] = useState(/** @type {Array<SAPUser>} */ [])
  const [reportsCatalog, setReportsCatalog] = useState(/** @type {Array<ReportsCatalog>}  */[])

	const handleSelect = async (item) => {
		setSelectedUser(item)
		try {
			const response = await service.getUserDetail(item.Id)
      console.log(response)
			setUserDetail(response)
			const responseShops = await service.getUserShops(item.Id)
			setUserShops(responseShops.tiendas)
		} catch (error) {
			sendNotification({
				type: 'ERROR',
				message: error.response.data.message || error.message
			})
		}
	}

	const handleAddButton = () => {
		setSelectedUser(/** @type {UserDetail} */ {})
		setUserDetail(/** @type {UserDetail} */ {})
		setShowModal()
	}

	const addNewUser = async (values) => {
		try {
			const body = { ...values, idProyect: 1 }
			await service.createUser(body)
			const response = await service.getUsers()
			setUsers(response)
		} catch (error) {
			sendNotification({
				type: 'ERROR',
				message: error.response.data.message || error.message
			})
		}
	}

	const updateUser = async (id, values) => {
		try {
			await service.updateUser(id, values)
			const response = await service.getUsers()
			setUsers(response)
		} catch (error) {
			sendNotification({
				type: 'ERROR',
				message: error.response.data.message || error.message
			})
		}
	}

	const deleteUser = async (id) => {
		const confirm = await confirmModalRef.current.show()
		if (confirm) {
			try {
				await service.deleteUser(id)
				const response = await service.getUsers()
				setUsers(response)
				setUserDetail(undefined)
				setSelectedUser(undefined)
			} catch (error) {
				sendNotification({
					type: 'ERROR',
					message: error.response.data.message || error.message
				})
			}
		}
	}

	const assignAccessToUser = async (item) => {
		if (selectedUser && item) {
			try {
				const idUser = selectedUser.Id
				const enabled = item.acceso ? 'N' : 'Y'
				const idDashboard = item.idDashboard
				const body = { idDashboard, idUser, enabled }
				await service.assignAccess(body)
				const response = await service.getUserDetail(selectedUser.Id)
				setUserDetail(response)
			} catch (error) {
				sendNotification({
					type: 'ERROR',
					message: error.response.data.message || error.message
				})
			}
		}
	}

	const adduserToDigitalGroup = async (body) => {
		try {
			await service.setUserToGrupoDigitalizacion(body)
			const response = await service.getUsers()
			setUsers(response)
		} catch (error) {
			sendNotification({
				type: 'ERROR',
				message: error.response.data.message || error.message
			})
		}
	}

	/**
	 *
	 * @param {number} id
	 * @param {SetUserShopBody} body
	 * @returns {Promise<void>}
	 */
	const setShopsToUser = async (id, body) => {
		try {
			console.log(id)
			await service.setUserLocalityShop(id, body)
		} catch (error) {
			sendNotification({
				type: 'ERROR',
				message: error.response.data.message || error.message
			})
		}
	}

	useEffect(() => {
		;(async () => {
			try {
				const userResponse = await service.getUsers()
				const groupResponse = await service.getGroups()
				const digitalGroupsResponse = await service.getGruposDigitalizacion()
				const { Localidades, Tiendas } = await service.getLocalities()
				const sapUserResponse = await service.getSAPUsers()
        const reportsCatalog = await UserServiceInstance.getCatalogReport({ Tipo: 'Reposicion' })
				setUsers(userResponse)
				setGroups(groupResponse)
				setDigitalGroups(digitalGroupsResponse)
				setLocations(Localidades)
				setShops(Tiendas)
				setSapUsers(sapUserResponse)
        setReportsCatalog(reportsCatalog)
			} catch (error) {
				sendNotification({
					type: 'ERROR',
					message: error.response.data.message || error.message
				})
			}
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<div className="flex flex-col md:flex-row justify-between h-fit p-4  bg-slate-50">
				<span className=" text-2xl font-semibold">Página de ventas</span>
				<span className=" text-3xl font-semibold">Configuración de Usuarios</span>
			</div>

			<div className="p-4">
				<TabButton />
			</div>

			<section>
				<div className="p-4 md:p-8">
					<UserInfo item={selectedUser} />
				</div>
				<div className="p-4 md:p-8 space-y-4">
					<div className="flex justify-start">
						<button className="primary-btn w-20" onClick={handleAddButton}>
							Agregar
						</button>
					</div>
					<Paginate
						data={users}
						showItems={5}
						options={{
							labelSelector: 'Mostrar',
							optionRange: [20, 50, 100],
							searchBy: ['Nombre', 'UserCode', 'NoEmpleado', 'Rol', 'NombreGrupo']
						}}
					>
						<UserTable
							handleSelect={handleSelect}
							handleShowModal={setShowModal}
							handleShowAccess={setShowRetrieve}
							deleteUser={deleteUser}
						/>
					</Paginate>
				</div>
			</section>

			{/* MODALS */}

			<Drawer
				expand={showModal}
				handleExpand={setShowModal}
				title={selectedUser?.Nombre ? `${selectedUser.Nombre} ${selectedUser.Apellidos}` : 'Agregar usuario'}
			>
				<UserForm
					item={userDetails?.usuario}
					groups={groups}
					addNewUser={addNewUser}
					updateUser={updateUser}
					handleToggle={setShowModal}
					digitalGroups={digitalGroups}
					addUserToGroup={adduserToDigitalGroup}
					locatities={locations}
					sapUsers={sapUsers}
					shops={shops}
					setShopsToUser={setShopsToUser}
					userShops={userShops}
          reportsCatalog={reportsCatalog}
				/>
			</Drawer>

			<FormModal key={2} active={showRetrieve} handleToggle={setShowRetrieve} name="Asignar acceso">
				<div className=" p-8  h-[500px] w-[400px] md:h-[570px] md:w-[500px] lg:w-[1000px] overflow-y-auto">
					<Paginate
						data={userDetails?.accesos}
						showItems={5}
						options={{
							labelSelector: 'Mostrar',
							optionRange: [20, 50, 100],
							searchBy: ['menu', 'reporte', 'nombreReporte']
						}}
					>
						<UserAccessTable assignAccessToUser={assignAccessToUser} />
					</Paginate>
				</div>
			</FormModal>
			<ConfirmModal
				ref={confirmModalRef}
				title="Eliminar usuario"
				message={`Eliminar al usuario usuario ${selectedUser?.Nombre}`}
			/>
		</>
	)
}

const WithAuthUsers = witAuth(Users)
WithAuthUsers.getLayout = getBaseLayout
export default WithAuthUsers
