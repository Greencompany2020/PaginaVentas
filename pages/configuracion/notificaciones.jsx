import React, { useState, useEffect } from 'react'
import { getBaseLayout } from '../../components/layout/BaseLayout'
import configuratorService from '../../services/configuratorService'
import { useNotification } from '../../components/notifications/NotificationsProvider'
import Paginate from '../../components/paginate'
import NotificationTable from '../../components/configuration/notifications/NotificationTable'
import { FormModal } from '../../components/modals'
import useToggle from '../../hooks/useToggle'
import NotificationForm from '../../components/configuration/notifications/NotificationForm'
import NotificationUsersTable from '../../components/configuration/notifications/NotificationUsersTable'
import withAuth from '../../components/withAuth'
import TabButton from '../../components/configuration/TabButton'

const NotificationsPage = (props) => {
	const [notifications, setNotifications] = useState([])
	const [selectedNotification, setSelectedNotification] = useState(null)
	const service = configuratorService()
	const sendNotification = useNotification()
	const [showModal, setShowModal] = useToggle()
	const [showUsersModal, setShowUsersModal] = useToggle()
	const [notificationUsers, setNotificationUsers] = useState([])

	const handleSelect = (item) => {
		setSelectedNotification(item)
	}

	const handleAddButton = () => {
		setSelectedNotification(null)
		setShowModal()
	}

	const buildUserList = (allUsers, notificationUsers) => {
		const assignedIds = new Set(notificationUsers.filter((u) => u.activo).map((u) => u.id))

		return allUsers.map((user) => ({
			id: user.Id,
			nombre: user.Nombre,
			userCode: user.UserCode,
			noEmpleado: user.NoEmpleado,
			apellidos: user.Apellidos,
			activo: assignedIds.has(user.Id)
		}))
	}

	const handleUsersModal = async (item) => {
		try {
			setSelectedNotification(item)

			const [allUsers, notificationUsers] = await Promise.all([
				service.getUsers(),
				service.getNotificationUsers(item.id)
			])

			setNotificationUsers(buildUserList(allUsers, notificationUsers))
			setShowUsersModal()
		} catch (error) {
			sendNotification({
				type: 'ERROR',
				message: error.response?.data?.message || error.message
			})
		}
	}

	const toggleNotificationToUser = async (userItem) => {
		if (!selectedNotification || !userItem) return
		try {
			const body = {
				userId: userItem.id,
				notificacionId: selectedNotification.id,
				activo: userItem.activo ? 0 : 1
			}
			await service.assignNotification(body)

			const [allUsers, assignedUsers] = await Promise.all([
				service.getUsers(),
				service.getNotificationUsers(selectedNotification.id)
			])

			setNotificationUsers(buildUserList(allUsers, assignedUsers))
		} catch (error) {
			sendNotification({
				type: 'ERROR',
				message: error.response?.data?.message || error.message
			})
		}
	}

	const addNewNotification = async (values) => {
		try {
			await service.createNotification(values)
			const response = await service.getNotifications()
			setNotifications(response)
		} catch (error) {
			sendNotification({
				type: 'ERROR',
				message: error.response?.data?.message || error.message
			})
		}
	}

	const updateNotification = async (id, values) => {
		try {
			await service.updateNotification(id, values)
			const response = await service.getNotifications()
			setNotifications(response)
		} catch (error) {
			sendNotification({
				type: 'ERROR',
				message: error.response?.data?.message || error.message
			})
		}
	}

	const deleteNotification = async (item) => {
		const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar la notificación "${item.nombre}"?`)
		if (!confirmDelete) return

		try {
			await service.deleteNotification(item.id)
			const response = await service.getNotifications()
			setNotifications(response)
		} catch (error) {
			sendNotification({
				type: 'ERROR',
				message: error.response?.data?.message || error.message
			})
		}
	}

	useEffect(() => {
		;(async () => {
			try {
				const response = await service.getNotifications()
				setNotifications(response)
			} catch (error) {
				sendNotification({
					type: 'ERROR',
					message: error.response?.data?.message || error.message
				})
			}
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<div className="flex flex-col md:flex-row justify-between h-fit p-4 bg-slate-50">
				<span className=" text-2xl font-semibold">Página de ventas</span>
				<span className=" text-3xl font-semibold">Configuración de Notificaciones</span>
			</div>
			<div className="p-4">
				<TabButton />
			</div>
			<section className=" overflow-hidden">
				<div className="p-4 md:p-8 space-y-4">
					<div className="flex justify-start">
						<button className="primary-btn w-20" onClick={handleAddButton}>
							Agregar
						</button>
					</div>
					<Paginate
						data={notifications}
						showItems={5}
						options={{
							labelSelector: 'Mostrar',
							optionRange: [20, 50, 100],
							searchBy: ['nombre', 'medio']
						}}
					>
						<NotificationTable
							handleSelect={handleSelect}
							handleShowModal={setShowModal}
							handleDelete={deleteNotification}
							handleUsersModal={handleUsersModal}
						/>
					</Paginate>
				</div>
			</section>
			{/* MODALS*/}
			<FormModal
				key={1}
				active={showModal}
				handleToggle={setShowModal}
				name={selectedNotification ? 'Editar notificación' : 'Agregar notificación'}
			>
				<NotificationForm
					item={selectedNotification}
					addNewNotification={addNewNotification}
					updateNotification={updateNotification}
					handleModal={setShowModal}
				/>
			</FormModal>

			<FormModal
				key={2}
				active={showUsersModal}
				handleToggle={setShowUsersModal}
				name={`Asignar usuarios a: ${selectedNotification?.nombre || ''}`}
			>
				<div className="p-8 h-[500px] w-[400px] md:h-[570px] md:w-[500px] lg:w-[1000px] overflow-y-auto">
					<Paginate
						data={notificationUsers}
						showItems={5}
						options={{
							labelSelector: 'Mostrar',
							optionRange: [20, 50, 100],
							searchBy: ['nombre', 'apellidos', 'userCode', 'noEmpleado', 'rol']
						}}
					>
						<NotificationUsersTable toggleNotificationToUser={toggleNotificationToUser} />
					</Paginate>
				</div>
			</FormModal>
		</>
	)
}

const WithAuthNotifications = withAuth(NotificationsPage)
WithAuthNotifications.getLayout = getBaseLayout
export default WithAuthNotifications
