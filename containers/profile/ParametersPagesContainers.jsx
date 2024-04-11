import { useEffect, useState } from 'react'
import { Form, Formik } from 'formik'
import { SelectInput } from 'components/FormInputs'
import { useNotification } from 'components/notifications/NotificationsProvider'
import { ConfirmOptions } from 'constants/ConfirmOptions'
import userService from 'services/userServices'
import { StockTransferUserType } from 'constants/StockTransferUserType'

/**
 * Componente de configuración de parámetros del
 * módulo WMS
 * @returns {JSX.Element}
 * @constructor
 */
export default function ParametersPageContainer() {
	const service = userService()
	const sendNotification = useNotification()

	/**
	 * @typedef {Object} GlobalParametersValue
	 * @property {string} confirmShippingList
	 * @property {string} confirmPackingList
	 * @property {string} tipoTraspasos
	 */

	/**
	 * @type {[GlobalParametersValue,Dispatch<SetStateAction<GlobalParametersValue>>]}
	 */
	const [values, setValues] = useState({
		confirmShippingList: ConfirmOptions.CONFIRMAR_MANUAL,
		confirmPackingList: ConfirmOptions.CONFIRMAR_MANUAL,
		tipoTraspasos: StockTransferUserType.TIENDA
	})

	/**
	 * Wrapper de {@link getGlobalParameters} de servicio de usuarios.
	 * @returns {Promise<GlobalParameters>}
	 */
	const getGlobalParameters = async () => {
		const { confirmGlobalShippingList, confirmGlobalPackingList, tipoTraspasos } = await service.getGlobalParameters()
		setValues({
			confirmShippingList: confirmGlobalShippingList ?? values.confirmShippingList,
			confirmPackingList: confirmGlobalPackingList ?? values.confirmPackingList,
			tipoTraspasos: tipoTraspasos ?? values.tipoTraspasos
		})
	}

	/**
	 * Envía los valores de parámetros globales
	 * a llamar al formulario
	 * @param {GlobalParametersValue} values
	 * @returns {Promise<void>}
	 */
	const onSubmitGlobals = async (values) => {
		try {
			const response = await service.updateGlobalParameters(values)
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
	}, [])

	return (
		<div>
			<Formik initialValues={values} onSubmit={onSubmitGlobals} enableReinitialize>
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
						<SelectInput label={'Tipo Usuario para Traspasos'} name='tipoTraspasos'>
							<option value={StockTransferUserType.TIENDA}>Tienda</option>
							<option value={StockTransferUserType.BODEGA}>Bodega</option>
						</SelectInput>
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
