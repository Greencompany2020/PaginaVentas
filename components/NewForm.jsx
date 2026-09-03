import React, { useState, useEffect } from 'react'

import Image from 'next/image'
import { Formik, Form, useFormikContext } from 'formik'
import { v4 } from 'uuid'
import * as Yup from 'yup'
import { TextInput, CheckBoxInput, SelectInput, RadioInput, RadioImageInput } from './FormInputs'
import { comboValues, inputNames, comboNames, checkboxLabels as label } from '../utils/data'

import tableIcon from '../public/icons/table.svg'
import statIcon from '../public/icons/stat.svg'
import statGroupIcon from '../public/icons/stat-group.svg'
import mobileTableIcon from '../public/icons/mobile-table.svg'

const WatchIncluirWeb = () => {
	const { values, setFieldValue } = useFormikContext()
	useEffect(() => {
		if (!values[inputNames.INCLUIR_WEB] && values[inputNames.USAR_FUSION]) {
			setFieldValue(inputNames.USAR_FUSION, false)
		}
	}, [values, setFieldValue])
	return null
}

const UsarFusionCheckbox = () => {
	const { values } = useFormikContext()
	return (
		<CheckBoxInput
			label="Reportar venta en línea con fecha de entrega"
			name={inputNames.USAR_FUSION}
			id={inputNames.USAR_FUSION}
			disabled={!values[inputNames.INCLUIR_WEB]}
		/>
	)
}

export default function NewForm({ submit, userParams, dashbordParams }) {
	//Valor del año actual
	const currentYear = new Date(Date.now()).getFullYear()

	/**
	 * Esta funcion retorna true si su valor es Y o false si es N
	 * @param {*} val
	 * @returns
	 */
	const isTrue = (val) => (val == 'Y' ? true : false)

	/**
	 * Esta funcion retorna Y si  val es true o N si es false
	 * @param {*} val
	 * @returns
	 */
	const toYesNo = (val) => (val == true ? 'Y' : 'N')

	/**
	 * Evalua si la propiedad esta habilidata para  el acceso,
	 * evalua los diferentes tipos de datos para retornar verdadero o falso
	 * @param {*} param
	 * @returns
	 */
	const isDisabled = (param) => {
		switch (typeof param) {
			case 'string':
				return param == 'n' || param == 'N'
			case 'boolean':
				return param
			case 'number':
				return param == 0
			case 'undefined':
				return true
			default:
				return param
		}
	}

	/**
	 * Establece el objeto de valores iniciales
	 */
	const initialValues = {
		[comboNames.CBAGNOSCOMPARAR]: userParams?.[comboNames.CBAGNOSCOMPARAR] || comboValues.CBAGNOSCOMPARAR[0].value,
		[comboNames.CBINCREMENTO]: userParams?.[comboNames.CBINCREMENTO] || comboValues.CBINCREMENTO[0].value,
		[comboNames.CBMOSTRARTIENDAS]: comboValues.CBMOSTRARTIENDAS[0].value,
		[inputNames.NO_HORAS_VENTAS_PARCIALES]: isTrue(userParams?.[inputNames.NO_HORAS_VENTAS_PARCIALES]),
		[inputNames.TIPO_CAMBIO_TIENDAS]: isTrue(userParams?.[inputNames.TIPO_CAMBIO_TIENDAS]),
		[inputNames.CON_IVA]: isTrue(userParams?.[inputNames.CON_IVA]),
		[inputNames.ACUMULADO_SEMANAL]: isTrue(userParams?.[inputNames.ACUMULADO_SEMANAL]),
		[inputNames.RESULTADOS_PESOS]: isTrue(userParams?.[inputNames.RESULTADOS_PESOS]),
		[inputNames.CON_VENTAS_EVENTOS]: isTrue(userParams?.[inputNames.CON_VENTAS_EVENTOS]),
		[inputNames.INCLUIR_WEB]: isTrue(userParams?.[inputNames.INCLUIR_WEB]),
		[inputNames.USAR_FUSION]: isTrue(userParams?.[inputNames.USAR_FUSION]),
		[inputNames.INCLUIR_AEROPUERTO]: isTrue(userParams?.[inputNames.INCLUIR_AEROPUERTO]),
		[inputNames.VISTA_DESKTOP]: userParams?.[inputNames.VISTA_DESKTOP] || 1,
		[inputNames.VISTA_MOBILE]: userParams?.[inputNames.VISTA_MOBILE] || 1
	}

	/**
	 * Esta funcion remplaza los parametros del objeto segun el tipo de datos
	 * @param {*} values
	 * @returns
	 */
	const validateValuesTypes = (values) => {
		const valuesWithTypes = {}

		//Este for evalua los valores del objeto y segun el caso los cambia
		for (const item in values) {
			//Obtiene el valo del objeto
			const value = values[item]
			let temp = null

			//Switch que evalua los tipos de valores
			switch (typeof value) {
				//si son boleanos (checks) los cambia por 'Y' o 'N'
				case 'boolean':
					temp = toYesNo(value)
					break

				//si es undefined lo marca como 'N'
				case 'undefined':
					temp = 'N'
					break

				//si no esta evaluado le deja su valor
				default:
					temp = value
			}
			Object.assign(valuesWithTypes, { [item]: temp })
		}
		return valuesWithTypes
	}

	/**
	 * Esta funcion se ejecuta cuando onSubmit es activado
	 * @param {*} values
	 */
	const handleOnSubmit = async (values) => {
		const params = validateValuesTypes(values)
		await submit(params)
	}

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={handleOnSubmit}
			enableReinitialize
		>
			<Form className="space-y-4 flex flex-col p-4">
				<WatchIncluirWeb />
				<section>
					<h4 className="font-bold mb-2">Parametros</h4>
					<div className="space-y-4">
						<fieldset className="space-y-2">
							<SelectInput
								label={label.CBAGNOSCOMPARAR}
								name={comboNames.CBAGNOSCOMPARAR}
								id={comboNames.CBAGNOSCOMPARAR}
							>
								{comboValues.CBAGNOSCOMPARAR.map((item, i) => (
									<option key={v4()} value={item.value}>
										{item.text}
									</option>
								))}
							</SelectInput>
							<SelectInput label={label.CBINCREMENTO} name={comboNames.CBINCREMENTO} id={comboNames.CBINCREMENTO}>
								{comboValues.CBINCREMENTO.map((item, i) => (
									<option key={v4()} value={item.value}>
										{item.text}
									</option>
								))}
							</SelectInput>
							<SelectInput
								label={label.CBMOSTRARTIENDAS}
								name={comboNames.CBMOSTRARTIENDAS}
								id={comboNames.CBMOSTRARTIENDAS}
							>
								{comboValues.CBMOSTRARTIENDAS.map((item, i) => (
									<option key={v4()} value={item.value}>
										{item.text}
									</option>
								))}
							</SelectInput>
						</fieldset>

						<fieldset className="space-y-1">
							<CheckBoxInput
								label={label.INCLUIR_EVENTOS}
								name={inputNames.CON_VENTAS_EVENTOS}
								id={inputNames.CON_VENTAS_EVENTOS}
							/>
							<CheckBoxInput label={label.INCLUIR_WEB} name={inputNames.INCLUIR_WEB} id={inputNames.INCLUIR_WEB} />
							<CheckBoxInput
								label={label.INCLUIR_AEROPUERTO}
								name={inputNames.INCLUIR_AEROPUERTO}
								id={inputNames.INCLUIR_AEROPUERTO}
							/>
							<UsarFusionCheckbox />
							<CheckBoxInput
								label={label.NO_HORAS_VENTAS_PARCIALES}
								name={inputNames.NO_HORAS_VENTAS_PARCIALES}
								id={inputNames.NO_HORAS_VENTAS_PARCIALES}
							/>
							<CheckBoxInput
								label={label.TIPO_CAMBIO_TIENDAS}
								name={inputNames.TIPO_CAMBIO_TIENDAS}
								id={inputNames.TIPO_CAMBIO_TIENDAS}
							/>
						</fieldset>
					</div>
				</section>

				<section>
					<h4 className="font-bold mb-2">Visualizar</h4>
					<div className="space-y-2">
						<fieldset className="space-y-1">
							<CheckBoxInput label={label.VENTAS_IVA} name={inputNames.CON_IVA} id={inputNames.CON_IVA} />
							<CheckBoxInput
								label={label.ACUMULADO_SEMANAL}
								name={inputNames.ACUMULADO_SEMANAL}
								id={inputNames.ACUMULADO_SEMANAL}
							/>
							<CheckBoxInput
								label={label.RESULTADO_PESOS}
								name={inputNames.RESULTADOS_PESOS}
								id={inputNames.RESULTADOS_PESOS}
							/>
						</fieldset>
						<fieldset className="space-y-1">
							<legend className="text-sm font-bold">Visualización de información en escritorio</legend>
							<RadioImageInput
								label={'Vista de tabla'}
								name={inputNames.VISTA_DESKTOP}
								image={tableIcon}
								value={1}
								disabled={isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])}
							/>
							<RadioImageInput
								label={'Vista por tarjetas'}
								name={inputNames.VISTA_DESKTOP}
								image={statIcon}
								value={2}
								disabled={isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])}
							/>
							<RadioImageInput
								label={'Vista de region'}
								name={inputNames.VISTA_DESKTOP}
								image={statGroupIcon}
								value={3}
								disabled={isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])}
							/>
							<RadioImageInput
								label={'Vista por seccion'}
								name={inputNames.VISTA_DESKTOP}
								image={mobileTableIcon}
								value={4}
								disabled={isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])}
							/>
						</fieldset>
						<fieldset className="space-y-1">
							<legend className="text-sm font-bold">Visualización de información en móvil</legend>
							<RadioImageInput
								label={'Vista de tabla'}
								name={inputNames.VISTA_MOBILE}
								image={tableIcon}
								value={1}
								disabled={isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])}
							/>
							<RadioImageInput
								label={'Vista por tarjetas'}
								name={inputNames.VISTA_MOBILE}
								image={statIcon}
								value={2}
								disabled={isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])}
							/>
							<RadioImageInput
								label={'Vista de region'}
								name={inputNames.VISTA_MOBILE}
								image={statGroupIcon}
								value={3}
								disabled={isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])}
							/>
							<RadioImageInput
								label={'Vista por seccion'}
								name={inputNames.VISTA_MOBILE}
								image={mobileTableIcon}
								value={4}
								disabled={isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])}
							/>
						</fieldset>
					</div>
				</section>

				<input className="primary-btn w-20 self-end" type={'submit'} value={'Guardar'} />
			</Form>
		</Formik>
	)
}

