import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { TextInput, SelectInput, PasswordViewInput } from '../../FormInputs'
import { ConfirmOptions } from 'constants/ConfirmOptions'
import { StockTransferUserType } from 'constants/StockTransferUserType'
import { LocationsSection } from 'components/configuration/users/LocationsSection'
import { PDFReplenishmentCatalogInput } from 'components/PDFReplenishmentCatalogInput'

/**
 * @typedef {Object} SAPUser
 * @property {string} UserCode
 */

/**
 * @param {UserDetailWithoutAccessList | undefined} item
 * @param groups
 * @param addNewUser
 * @param updateUser
 * @param handleToggle
 * @param digitalGroups
 * @param addUserToGroup
 * @param locatities
 * @param {Array<SAPUser>} sapUsers
 * @param {Array<Store>} shops
 * @param setShopsToUser
 * @param userShops
 * @param {Array<ReportsCatalog>} reportsCatalog
 * @returns {JSX.Element}
 */
export default function UserForm({
	item, // Valores del usuario. Si se asigna indica que es una actualización.
	groups,
	addNewUser,
	updateUser,
	handleToggle,
	digitalGroups,
	addUserToGroup,
	locatities,
	sapUsers,
	shops,
	setShopsToUser,
	userShops,
	reportsCatalog
}) {
	const getUserLocations = () => {
		const localidades = locatities.reduce((obj, item) => Object.assign(obj, { [item.Localidad]: '' }), {})

		if (item) {
			const userLocalidades = item.Localidades.flatMap((item) => item.Codigo)
			const userLocalidadesFilter = locatities.filter((item) => userLocalidades.includes(item.Codigo))
			const userPlaces = userLocalidadesFilter.flatMap((item) => item.Localidad)
			if (userPlaces) {
				const newLocalidades = {}
				for (let property in localidades) {
					if (userPlaces.includes(property)) {
						Object.assign(newLocalidades, { [property]: true })
					} else {
						Object.assign(newLocalidades, { [property]: false })
					}
				}
				return newLocalidades
			}
		}
		return localidades
	}

	const getUserShops = () => {
		const filteredUserShops = userShops
			.flatMap((item) => item.almacenes.filter((flat) => flat.selected))
			.map((flat) => flat.codigo)
		const globalShops = shops
			.flatMap((item) => item.almacenes.map((flat) => flat.codigo))
			.reduce((obj, item) => Object.assign(obj, { [item]: filteredUserShops.includes(item) }), {})
		return globalShops
	}

	const initialValues = {
		UserCode: item?.UserCode || '',
		Email: item?.Email || '',
		NoEmpleado: item?.NoEmpleado || '',
		Level: item?.Level || 1,
		Clase: item?.Clase || 1,
		Nombre: item?.Nombre || '',
		Apellidos: item?.Apellidos || '',
		password: '',
		idGrupo: item?.IdGrupo || groups[0]?.Id,
		idGrupoDigital: item?.IdGrupoDigitalizacion || 0,
		localidades: getUserLocations(),
		UserSAP: item?.UserSAP || '',
		PasswordSAP: item?.PasswordSAP || '',
		DefaultReposicion: item?.DefaultReposicion ?? 1,
		parametros: {
			confirmShippingList: item?.Parametros?.confirmShippingList || ConfirmOptions.CONFIRMAR_BULTO,
			confirmPackingList: item?.Parametros?.confirmPackingList || ConfirmOptions.CONFIRMAR_LINEA,
			tipoTraspasos: item?.Parametros?.tipoTraspasos || StockTransferUserType.TIENDA
		},
		shops: getUserShops()
	}

	const validationSchema = Yup.object().shape({
		UserCode: Yup.string().required('Requerido'),
		Email: Yup.string().email('Ingrese un email con formato valido @example.com').required('Requerido'),
		NoEmpleado: Yup.number()
			.transform((v) => parseInt(v))
			.required('Requerido'),
		Level: Yup.number().transform((v) => parseInt(v)),
		Clase: Yup.number().transform((v) => parseInt(v)),
		Nombre: Yup.string().required('Requerido'),
		Apellidos: Yup.string().required('Requerido'),
		password: !item && Yup.string().required('Requerido'),
		idGrupo: Yup.number().transform((v) => parseInt(v)),
    UserSAP: Yup.string().ensure().when(['PasswordSAP'],{
      is: (PasswordSAP) => PasswordSAP,
      then: Yup.string().required('Es necesario elegir un usuario de SAP')
    }),
    PasswordSAP: Yup.string().ensure().when('UserSAP', {
      is: (UserSAP) => UserSAP,
      then: Yup.string().required('Es necesario agregar una contraseña')
    })
	}, [['UserSAP', 'PasswordSAP']])

	const getIdFromLocations = (data) => {
		let places = []
		for (let property in data) {
			if (data[property] === true) places = [...places, property]
		}
		if (places) {
			const filter = locatities.filter((val) => places.includes(val.Localidad))
			const placesFilter = filter.flatMap((val) => val.Codigo)
			return placesFilter
		}
		return []
	}

	const getShopsFromValues = (data) => {
		let shopsIntrue = []
		for (const property in data) {
			if (data[property] === true) shopsIntrue = [...shopsIntrue, property]
		}
		return shopsIntrue
	}

	const handleOnSubmit = async (values, { resetForm }) => {
		const { idGrupoDigital, localidades, shops, ...rest } = values
		const localitities = getIdFromLocations(localidades)

		if (item) {
			const { password,...params } = rest
			const body = { ...params, localidades: localitities, idProyect: 1 }
			await updateUser(item?.Id, body)
			await addUserToGroup({
				idUser: item?.Id,
				idGrupo: idGrupoDigital
			})
			await setShopsToUser(item?.Id, getShopsFromValues(values.shops))
		} else {
			const body = { ...rest, localidades: localitities }
			await addNewUser(body)
		}
		resetForm({})
		handleToggle()
	}

	return (
		<Formik
			validationSchema={validationSchema}
			initialValues={initialValues}
			onSubmit={handleOnSubmit}
			enableReinitialize
		>
			<Form className="p-4 relative h-fit overflow-y-auto">
				<div className="space-y-1">
					<TextInput label="No. Empleado" name="NoEmpleado" type="number" elementwidth="w-36" />
					<TextInput label="Nombre" name="Nombre" />
					<TextInput label="Apellidos" name="Apellidos" />
				</div>

				<div className="space-y-1 mt-4">
					<TextInput label="Usuario" name="UserCode" />
					<TextInput label="Correo" name="Email" type="email" />
					{!item && <TextInput label="Password" name="password" type="password" />}
					<div className="flex flex-row space-x-1">
						<SelectInput label="Clase" name="Clase">
							<option value={0}>0</option>
							<option value={1}>1</option>
						</SelectInput>
						<SelectInput label="Level" name="Level">
							<option value={3}>3</option>
							<option value={5}>5</option>
							<option value={6}>6</option>
							<option value={7}>7</option>
							<option value={10}>10</option>
							<option value={11}>11</option>
							<option value={20}>20</option>
						</SelectInput>
						<SelectInput label="Grupo" name="idGrupo">
							<ListGroups groups={groups} />
						</SelectInput>
					</div>
				</div>

				<fieldset className="mt-4">
					<SelectInput label="Rol digitalizado" name="idGrupoDigital" disabled={!item}>
						<option value={0}>Elegir grupo</option>
						<DigitalGroups digitalGroups={digitalGroups} />
					</SelectInput>
				</fieldset>

				<fieldset className="mt-4">
					<legend className="font-semibold text-sm text-gray-600 mb-1">Localidades</legend>
					<ul className="space-y-2">
						{locatities &&
							locatities.map((item) => <LocationsSection key={item.Codigo} locality={item} shops={shops} />)}
					</ul>
				</fieldset>

				<fieldset className="mt-4">
					<SelectInput label="Usuario sap" name="UserSAP">
						<option value={''}>Seleccionar usuario</option>
						{sapUsers && sapUsers.map((item) => <option key={item.UserCode}>{item.UserCode}</option>)}
					</SelectInput>
				</fieldset>

				<div className="space-y-1 mt-4">
					<PasswordViewInput label="Contraseña SAP" name="PasswordSAP" />
				</div>
				{/* * El nombre del input representa que es un objeto anidado. Ver initialValues */}
				<fieldset className="mt-4 space-y-2">
					<SelectInput label={'Metodo de confirmacion de embarque'} name="parametros.confirmShippingList">
						<option value={ConfirmOptions.CONFIRMAR_MANUAL}>Confirmacion manual</option>
						<option value={ConfirmOptions.CONFIRMAR_BULTO}>Confirmar por bulto</option>
						<option value={ConfirmOptions.CONFIRMAR_EMBARQUE}>Confirmar por embarque</option>
					</SelectInput>
					<SelectInput label="Metodo de confirmacion de packing" name="parametros.confirmPackingList">
						<option value={ConfirmOptions.CONFIRMAR_MANUAL}>Confirmacion manual</option>
						<option value={ConfirmOptions.CONFIRMAR_LINEA}>Confirmar por linea</option>
					</SelectInput>
					<SelectInput label="Tipo Usuario para Traspasos" name="parametros.tipoTraspasos">
						<option value={StockTransferUserType.TIENDA}>Tienda</option>
						<option value={StockTransferUserType.BODEGA}>Bodega</option>
					</SelectInput>
				</fieldset>

				<fieldset className="mt-4">
					{reportsCatalog.length !== 0 && (
						<PDFReplenishmentCatalogInput
							label={'PDF Reporte Reposición'}
							name={'DefaultReposicion'}
							catalog={reportsCatalog}
						/>
					)}
				</fieldset>

				<div className="flex flex-row justify-end space-x-2 mt-6 ">
					<input type="reset" value="Cancelar" className="secondary-btn w-28" onClick={handleToggle} />
					<input type="submit" value="Guardar" className="primary-btn w-28" />
				</div>
			</Form>
		</Formik>
	)
}

function ListGroups({ groups }) {
	if (!groups) return <option value={0}>Sin grupos</option>
	const Items = groups.map((item, index) => (
		<option key={index} value={item.Id}>
			{item.Nombre}
		</option>
	))
	return Items
}

function DigitalGroups({ digitalGroups }) {
	if (!digitalGroups) return <option value={0}>Sin grupo</option>
	const Items = digitalGroups.map((item, index) => (
		<option key={index} value={item.Id}>
			{item.Nombre}
		</option>
	))
	return Items
}
