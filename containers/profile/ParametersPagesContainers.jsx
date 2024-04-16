import { useEffect, useState } from 'react'
import { Form, Formik } from 'formik'
import { SelectInput } from 'components/FormInputs'
import { useNotification } from 'components/notifications/NotificationsProvider'
import { ConfirmOptions } from 'constants/ConfirmOptions'
import { StockTransferUserType } from 'constants/StockTransferUserType'
import { UserServiceInstance } from 'services/UserService'
import { useSelector } from 'react-redux'
import { PDFReplenishmentCatalogInput } from 'components/PDFReplenishmentCatalogInput'

/**
 * Componente de configuración de parámetros del
 * módulo WMS
 * @returns {JSX.Element}
 * @constructor
 */
export default function ParametersPageContainer() {
	/** @type {UserData} */
	const user = useSelector((state) => state.user)
	const sendNotification = useNotification()

	/**
	 * @typedef {Object} ConfigValues
	 * @property {string} confirmShippingList
	 * @property {string} confirmPackingList
	 * @property {string} tipoTraspasos
	 * @property {number} defaultReposicion
	 */

	const [config, setConfig] = useState(
		/** @type {ConfigValues} */
		{
			confirmShippingList: ConfirmOptions.CONFIRMAR_MANUAL,
			confirmPackingList: ConfirmOptions.CONFIRMAR_MANUAL,
			tipoTraspasos: StockTransferUserType.TIENDA,
			defaultReposicion: user?.DefaultReposicion ?? 1
		}
	)

	const [catalog, setCatalog] = useState(
		/** @type {Array<ReportsCatalog>} */
		[]
	)

	/**
	 * Wrapper de {@link getGlobalParameters} de servicio de usuarios.
	 * @returns {Promise<GlobalParameters>}
	 */
	const getGlobalParameters = async () => {
		const { confirmGlobalShippingList, confirmGlobalPackingList, tipoTraspasos } = await UserServiceInstance.getGlobalParameters()
		setConfig({
			confirmShippingList: confirmGlobalShippingList ?? config.confirmShippingList,
			confirmPackingList: confirmGlobalPackingList ?? config.confirmPackingList,
			tipoTraspasos: tipoTraspasos ?? config.tipoTraspasos,
      defaultReposicion: config.defaultReposicion
		})
	}

	/**
	 * Envía los valores de parámetros globales
	 * a llamar al formulario
	 * @param {ConfigValues} values
	 * @returns {Promise<void>}
	 */
	const onSubmitGlobals = async (values) => {
		try {
			const response = await UserServiceInstance.updateGlobalParameters({
				tipoTraspasos: values.tipoTraspasos,
				confirmPackingList: values.confirmShippingList,
				confirmShippingList: values.confirmShippingList
			})

      await UserServiceInstance.updateDefaultReposicion({
        idUser: user.Id,
        defaultReposicion: values.defaultReposicion
      })

			if (response) {
				sendNotification({
					type: 'OK',
					message: 'Datos actualizados'
				})
			}
		} catch (error) {
			sendNotification({
				type: 'ERROR',
				message: error.response.data.message || error.message
			})
		}
	}

	useEffect(() => {
		getGlobalParameters()
		UserServiceInstance.getCatalogReport({
			Tipo: 'Reposicion'
		}).then((data) => setCatalog(data))
	}, [])

	return (
		<div>
			<Formik initialValues={config} onSubmit={onSubmitGlobals} enableReinitialize>
				<Form>
					<fieldset className="space-y-2">
						<SelectInput label={'Metodo de confirmacion de embarque'} name="confirmShippingList">
							<option value={ConfirmOptions.CONFIRMAR_MANUAL}>Confirmacion manual</option>
							<option value={ConfirmOptions.CONFIRMAR_BULTO}>Confirmar por bulto</option>
							<option value={ConfirmOptions.CONFIRMAR_EMBARQUE}>Confirmar por embarque</option>
						</SelectInput>
						<SelectInput label={'Metodo de confirmacion de packing'} name="confirmPackingList">
							<option value={ConfirmOptions.CONFIRMAR_MANUAL}>Confirmacion manual</option>
							<option value={ConfirmOptions.CONFIRMAR_LINEA}>Confirmar por linea</option>
						</SelectInput>
						<SelectInput label={'Tipo Usuario para Traspasos'} name="tipoTraspasos">
							<option value={StockTransferUserType.TIENDA}>Tienda</option>
							<option value={StockTransferUserType.BODEGA}>Bodega</option>
						</SelectInput>

						{catalog.length !== 0 && (
							<PDFReplenishmentCatalogInput
								label={'PDF Reporte Reposición'}
								name={'defaultReposicion'}
								catalog={catalog}
							/>
						)}
					</fieldset>

					<div className="flex flex-row justify-end space-x-2 mt-6 ">
						<input type="reset" value="Cancelar" className="secondary-btn w-28" />
						<input type="submit" value="Guardar" className="primary-btn w-28" />
					</div>
				</Form>
			</Formik>
		</div>
	)
}
