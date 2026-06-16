import React, { useState, useEffect } from 'react'
import { getVentasLayout } from '../../components/layout/VentasLayout'
import { ParametersContainer, Parameters } from '../../components/containers'
import { checkboxLabels, comboValues } from '../../utils/data'
import { getComparativoGrupo } from '../../services/ComparativoService'
import {
	stringFormatNumber,
	numberWithCommas,
	numberAbs,
	isNegative,
	isRegionOrPlaza,
	numberAbsComma,
	selectRow,
	formatPercentage
} from '../../utils/resultsFormated'
import {
	getTableName,
	spliceByRegion,
	parseParams,
	parseNumberToBoolean,
	spliteArrDate,
	isSecondDateBlock
} from '../../utils/functions'
import withAuth from '../../components/withAuth'
import TitleReport from '../../components/TitleReport'
import { useNotification } from '../../components/notifications/NotificationsProvider'
import Stats from '../../components/Stats'
import { v4 } from 'uuid'
import ViewFilter from '../../components/ViewFilter'
import { isMobile } from 'react-device-detect'
import { Select, Input, BeetWenYears, Checkbox } from '../../components/reportInputs'
import { Formik, Form, useFormikContext } from 'formik'
import AutoSubmitToken from '../../hooks/useAutoSubmitToken'
import ExcelButton from '../../components/buttons/ExcelButton'
import exportExcel from '../../utils/excel/exportExcel'
import comGrupo from '../../utils/excel/templates/comGrupo'
import DateHelper from '../../utils/dateHelper'

/**
 * Obtiene el valor del año a usar para
 * mostrar el porcentaje, dependiendo del tipo de incremento.
 * - El año base siempre es porcentaje VS. compromiso.
 * - El del año de comparación es VS las ventas del año.
 * @param currentYear {number}
 * @param comparissonYear {number}
 * @param incremento {string}
 * @returns {number}
 */
const getPercentageYear = (currentYear, comparissonYear, incremento) => {
	return incremento === 'compromiso' ? currentYear : comparissonYear
}

const isWebKey = (k) => {
	const x = String(k || '')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toUpperCase()
		.replace(/\s+/g, '')

	return x.includes('TIENDAENLINEA') || x.includes('WEB')
}

const isAeroKey = (k) => {
	const x = String(k || '')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toUpperCase()
		.replace(/\s+/g, '')

	return x.includes('AEROPUERTO')
}

const isBoolean = (data) => {
	if (data === 'N') {
		return false
	} else {
		return true
	}
}

// Muestra '-' si el valor numérico es 0; en otro caso aplica el formateador
const dashIfZero = (value, formatter) => {
	const n = Number(value ?? 0)
	return Number.isFinite(n) && n === 0 ? '-' : formatter(value)
}

// Atajos para tus formateadores actuales
const fmtAmount = (v) => dashIfZero(v, numberWithCommas) // para importes normales
const fmtDiff = (v) => dashIfZero(v, numberAbsComma) // para columnas (-) con signo/abs y coma

// Calcula diferencia para Daily/Weekly según el tipo de incremento
const calcDif = (item, dateHelper, date, incremento, scope, idx = 0) => {
	const currentYear = dateHelper.getCurrentYear(date.current)
	const compareYear = date?.dateRange?.[idx]

	// helper para leer valores numéricos seguros
	const n = (k) => {
		const v = Number(item?.[k] ?? 0)
		return Number.isFinite(v) ? v : 0
	}

	// si están comparando contra ventas de otro año pero no existe ese año, evita restar contra "undefined"
	if (incremento !== 'compromiso' && !compareYear) return 0

	if (scope === 'daily') {
		const curr = n('ventasActuales' + currentYear)
		return incremento === 'compromiso'
			? curr - n('presupuesto' + currentYear)
			: curr - n('ventasActuales' + compareYear)
	}

	if (scope === 'weekly') {
		const curr = n('ventasSemanalesActual' + currentYear)
		return incremento === 'compromiso'
			? curr - n('presupuestoSemanal' + currentYear)
			: curr - n('ventasSemanalesActual' + compareYear)
	}

	return 0
}

function Grupo(props) {
	const { config } = props
	const sendNotification = useNotification()
	const dateHelper = DateHelper()

	//Estados de los reportes
	const [dataReport, setDataReport] = useState(null)
	const [reportDate, setReportDate] = useState({
		current: dateHelper.getYesterdayDate(),
		dateRange: spliteArrDate(config.agnosComparativos, config?.cbAgnosComparar || 1)
	})
	const [includeSem, setIncludeSem] = useState(false)
	const [isDisable, setIsDisable] = useState(isSecondDateBlock(config?.cbAgnosComparar || 1))

	//Estado del reporte por secciones;
	const [dataReportSeccions, setDataReportSeccions] = useState(null)
	const [seccions, setSeccions] = useState(['REGION I', 'REGION II', 'REGION III', 'WEB', 'AEROPUERTO', 'TOTAL'])
	const [currentRegion, setCurrentRegion] = useState(seccions[0])
	const [displayMode, setDisplayMode] = useState(isMobile ? config?.mobileReportView : config?.desktopReportView)
	const [incremento, setIncremento] = useState('compromiso')
	const [showWeb, setShowWeb] = useState(true)
	const [fusionOn, setFusionOn] = useState(isBoolean(config?.usarFusion || 'N'))
	const [showAeropuerto, setShowAeropuerto] = useState(isBoolean(config?.incluirAeropuerto || 'N'))

	const parameters = {
		fecha: dateHelper.getToday(),
		conIva: parseNumberToBoolean(config?.conIva || 0),
		incremento: 'compromiso',
		noHorasVentasParciales: parseNumberToBoolean(config?.noHorasVentasParciales || 0),
		conVentasEventos: parseNumberToBoolean(config?.conVentasEventos || 0),
		tipoCambioTiendas: parseNumberToBoolean(config?.tipoCambioTiendas || 0),
		agnosComparar: spliteArrDate(config?.agnosComparativos, config?.agnosComparar || 1),
		cbAgnosComparar: Number(config?.cbAgnosComparar ?? 1),
		resultadosPesos: parseNumberToBoolean(config?.resultadosPesos || 0),
		mostrarTiendas: 'activas',
		incluirWeb: isBoolean(config?.incluirWeb || 'N'),
		usarFusion: isBoolean(config?.usarFusion || 'N'),
		incluirAeropuerto: isBoolean(config?.incluirAeropuerto || 'N')
	}
	Object.seal(parameters)

	const WatchIncluirWeb = () => {
		const { values, setFieldValue } = useFormikContext()
		useEffect(() => {
			setShowWeb(!!values.incluirWeb)

			// si no incluye web, apaga y deshabilita usarFusion
			if (!values.incluirWeb && values.usarFusion) {
				setFieldValue('usarFusion', false)
			}
		}, [values.incluirWeb, values.usarFusion, setFieldValue])

		return null
	}

	const WatchUsarFusion = () => {
		const { values } = useFormikContext()
		useEffect(() => {
			setFusionOn(!!values.usarFusion)
		}, [values.usarFusion])
		return null
	}

	const WatchIncluirAeropuerto = () => {
		const { values } = useFormikContext()
		useEffect(() => {
			setShowAeropuerto(!!values.incluirAeropuerto)
		}, [values.incluirAeropuerto])
		return null
	}

	const UsarFusionCheckbox = () => {
		const { values } = useFormikContext()
		return (
			<Checkbox id="usarFusion" name="usarFusion" label={checkboxLabels.USAR_FUSION} disabled={!values.incluirWeb} />
		)
	}

	const handleSubmit = async (values) => {
		try {
			const params = removeParams(values)
			setIncremento(values.incremento)
			const response = await getComparativoGrupo(parseParams(params))
			setDataReport(response)
			setDataReportSeccions(spliceByRegion(response))
		} catch (error) {
			sendNotification({
				type: 'ERROR',
				message: error.response.data.message || error.message
			})
		}
	}

	const removeParams = (params) => {
		// const agnos = Array.isArray(params.agnosComparar) ? params.agnosComparar : [params.agnosComparar].filter(Boolean)

		// const a0 = agnos[0]

		// if (params.cbAgnosComparar === 1) {
		// 	const { cbAgnosComparar, agnosComparar, acumuladoSemanal, incluirWeb, ...rest } = params

		// 	setReportDate({ current: params.fecha, dateRange: [a0] })
		// 	setIncludeSem(acumuladoSemanal)
		// 	setIsDisable(isSecondDateBlock(cbAgnosComparar))

		// 	return {
		// 		...rest,
		// 		agnosComparar: [a0],
		// 		usarFusion: params.incluirWeb && params.usarFusion ? 'Y' : 'N'
		// 	}
		// } else {
		// 	const { cbAgnosComparar, acumuladoSemanal, incluirWeb, ...rest } = params

		// 	setReportDate({ current: params.fecha, dateRange: agnos })
		// 	setIncludeSem(acumuladoSemanal)
		// 	setIsDisable(isSecondDateBlock(cbAgnosComparar))

		// 	return {
		// 		...rest,
		// 		agnosComparar: agnos,
		// 		usarFusion: params.incluirWeb && params.usarFusion ? 'Y' : 'N'
		// 	}
		// }
		const agnos = Array.isArray(params.agnosComparar)
			? params.agnosComparar.filter(Boolean)
			: [params.agnosComparar].filter(Boolean)
		const cb = Number(params.cbAgnosComparar || 1)
		const agnosRecortados = agnos.slice(0, cb) // <- clave: elimina el 2º año cuando cb=1

		const { cbAgnosComparar, incluirWeb, acumuladoSemanal, incluirAeropuerto, ...rest } = params
		setReportDate({ current: params.fecha, dateRange: agnosRecortados })
		setIncludeSem(!!acumuladoSemanal)
		setIsDisable(isSecondDateBlock(cb))

		return {
			...rest,
			agnosComparar: agnosRecortados,
			usarFusion: params.incluirWeb && params.usarFusion ? 'Y' : 'N',
			mostrarAeropuerto: incluirAeropuerto ? 'Y' : 'N'
		}
	}

	const handleExport = (incremento) => {
		const dataToExport = { ...dataReport }
		const sheetNames = ['Tiendas frogs']
		
		if (!showWeb) {
			delete dataToExport.tiendaWeb
		} else {
			sheetNames.push('Tienda en linea')
		}
		
		if (!showAeropuerto) {
			delete dataToExport.tiendasAeropuerto
		} else {
			sheetNames.push('Tiendas frogs aeropuerto')
		}

		const template = comGrupo(
			[
				`${dateHelper.getWeekDate(reportDate.current)}`,
				`${dateHelper.getweekRange(reportDate.current)}`,
				`Acumulado ${dateHelper.getMonthName(reportDate.current)}`
			],
			dataToExport,
			[dateHelper.getCurrentYear(reportDate.current), reportDate.dateRange].flat(1),
			incremento
		)
		const legend = fusionOn
			? 'Las ventas en línea son reportadas por fecha de facturación.'
			: 'Las ventas en línea son reportadas por fecha de pedido.'
		exportExcel(
			`Comparativo Grupo ${reportDate.current}`,
			template.getColumns(),
			template.getRows(),
			template.style,
			sheetNames,
			{ includeWeb: true }, // Forzamos a true porque filtramos la data nosotros
			legend
		)
	}

	return (
		<div className=" flex flex-col h-full ">
			<TitleReport
				title={`
          COMPARATIVO VENTAS DEL AÑO ${dateHelper.getCurrentYear(reportDate.current)} 
          (AL ${dateHelper.getCurrentDate(reportDate.current)} 
          DE ${dateHelper.getMonthName(reportDate.current).toUpperCase()})
        `}
			/>

			<section className="p-4 space-y-2">
				<div className="flex justify-between items-start">
					<ParametersContainer>
						<Parameters>
							<Formik initialValues={parameters} onSubmit={handleSubmit}>
								<Form>
									<AutoSubmitToken />
									<WatchIncluirWeb />
									<WatchUsarFusion />
									<WatchIncluirAeropuerto />
									<fieldset className="space-y-2 mb-3">
										<Input type={'date'} placeholder={reportDate.current} id="fecha" name="fecha" label="Fecha" />
										<BeetWenYears
											enabledDates={{
												id: 'cbAgnosComparar',
												name: 'cbAgnosComparar',
												label: 'Años a comparar'
											}}
											begindDate={{
												id: 'agnosComparar[0]',
												name: 'agnosComparar[0]',
												label: 'Primer año'
											}}
											endDate={{
												id: 'agnosComparar[1]',
												name: 'agnosComparar[1]',
												label: 'Segundo año',
												disabled: isDisable
											}}
										/>
										<Select id="incremento" name="incremento" label="Formular % de incremento">
											{comboValues.CBINCREMENTO.map((item, i) => (
												<option key={i} value={item.value}>
													{item.text}
												</option>
											))}
										</Select>
										<Select id="mostrarTiendas" name="mostrarTiendas" label="Mostrar tiendas">
											{comboValues.CBMOSTRARTIENDAS.map((item, i) => (
												<option key={i} value={item.value}>
													{item.text}
												</option>
											))}
										</Select>
									</fieldset>
									<fieldset className="space-y-1">
										<Checkbox id="conIva" name="conIva" label={checkboxLabels.VENTAS_IVA} />
										<Checkbox
											id="noHorasVentasParciales"
											name="noHorasVentasParciales"
											label={checkboxLabels.NO_HORAS_VENTAS_PARCIALES}
										/>
										<Checkbox
											id="conVentasEventos"
											name="conVentasEventos"
											label={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
										/>
										<Checkbox id="incluirWeb" name="incluirWeb" label={checkboxLabels.INCLUIR_WEB} />
										<Checkbox id="incluirAeropuerto" name="incluirAeropuerto" label={checkboxLabels.INCLUIR_AEROPUERTO} />
										<UsarFusionCheckbox />
										<Checkbox id="acumuladoSemanal" name="acumuladoSemanal" label={checkboxLabels.ACUMULADO_SEMANAL} />
										<Checkbox id="resultadosPesos" name="resultadosPesos" label={checkboxLabels.RESULTADO_PESOS} />
										<Checkbox
											id="tipoCambioTiendas"
											name="tipoCambioTiendas"
											label={checkboxLabels.TIPO_CAMBIO_TIENDAS}
										/>
									</fieldset>
								</Form>
							</Formik>
						</Parameters>
					</ParametersContainer>
					<ViewFilter
						viewOption={displayMode}
						handleView={setDisplayMode}
						selectOption={currentRegion}
						handleSelect={setCurrentRegion}
						options={seccions}
					/>
				</div>
				<div className="flex justify-between">
					<p className={`text-sm font-bold`}> </p>
					<ExcelButton handleClick={() => handleExport(incremento)} />
				</div>
			</section>

			<section className="p-4 overflow-y-auto ">
				<div className=" overflow-y-auto">
					{(() => {
						switch (displayMode) {
							case 1:
								return (
									<Table
										data={dataReport}
										date={reportDate}
										includeSem={includeSem}
										incremento={incremento}
										webShown={showWeb}
										fusionOn={fusionOn}
										aeropuertoShown={showAeropuerto}
									/>
								)
							case 2:
								return (
									<Stat
										data={dataReport}
										date={reportDate}
										includeSem={includeSem}
										incremento={incremento}
										webShown={showWeb}
										fusionOn={fusionOn}
										aeropuertoShown={showAeropuerto}
									/>
								)
							case 3:
								return (
									<StatGroup
										data={dataReportSeccions}
										date={reportDate}
										region={currentRegion}
										includeSem={includeSem}
										incremento={incremento}
										webShown={showWeb}
										fusionOn={fusionOn}
										aeropuertoShown={showAeropuerto}
									/>
								)
							case 4:
								return (
									<TableMovil
										data={dataReport}
										date={reportDate}
										includeSem={includeSem}
										incremento={incremento}
										webShown={showWeb}
										fusionOn={fusionOn}
										aeropuertoShown={showAeropuerto}
									/>
								)
							default:
								return (
									<Table
										data={dataReport}
										date={reportDate}
										includeSem={includeSem}
										incremento={incremento}
										webShown={showWeb}
										fusionOn={fusionOn}
										aeropuertoShown={showAeropuerto}
									/>
								)
						}
					})()}
				</div>
			</section>
		</div>
	)
}

const Table = (props) => {
	const { date, data, includeSem, incremento, webShown, fusionOn, aeropuertoShown } = props
	const dateHelper = DateHelper()

	return (
		<div className="space-y-8">
			{data &&
				Object.entries(data).map(([key, values]) => {
					if (!webShown && isWebKey(key)) return null
					if (!aeropuertoShown && isAeroKey(key)) return null
					return (
						<React.Fragment key={v4()}>
							{getTableName(key)}
							<table className="table-report" key={v4()} onClick={selectRow}>
								<thead>
									<tr className="text-center">
										<th rowSpan={2}>Tienda</th>
										<th colSpan={date.dateRange[1] ? 8 : 5}>{`${dateHelper.getWeekDate(date.current)}`}</th>
										{includeSem && (
											<th colSpan={date.dateRange[1] ? 8 : 5}>{dateHelper.getweekRange(date.current).toUpperCase()}</th>
										)}
										<th colSpan={date.dateRange[1] ? 8 : 5}>{`Acumulado ${dateHelper.getMonthName(date.current)}`}</th>
										<th colSpan={date.dateRange[1] ? 8 : 5}>Acumulado Anual</th>
										<th rowSpan={2}>Tienda</th>
									</tr>
									<tr>
										<th>{dateHelper.getCurrentYear(date.current)}</th>
										<th>{date.dateRange[0]}</th>
										<th>PPTO.</th>
										<th>(-)</th>
										<th>%</th>
										{date.dateRange[1] && (
											<React.Fragment key={v4()}>
												<th>{date.dateRange[1]}</th>
												<th>(-)</th>
												<th>%</th>
											</React.Fragment>
										)}

										{includeSem && (
											<React.Fragment key={v4()}>
												<th>{dateHelper.getCurrentYear(date.current)}</th>
												<th>{date.dateRange[0]}</th>
												<th>PPTO.</th>
												<th>(-)</th>
												<th>%</th>
												{date.dateRange[1] && (
													<React.Fragment key={v4()}>
														<th>{date.dateRange[1]}</th>
														<th>(-)</th>
														<th>%</th>
													</React.Fragment>
												)}
											</React.Fragment>
										)}

										<th>{dateHelper.getCurrentYear(date.current)}</th>
										<th>{date.dateRange[0]}</th>
										<th>PPTO.</th>
										<th>(-)</th>
										<th>%</th>
										{date.dateRange[1] && (
											<React.Fragment key={v4()}>
												<th>{date.dateRange[1]}</th>
												<th>(-)</th>
												<th>%</th>
											</React.Fragment>
										)}

										<th>{dateHelper.getCurrentYear(date.current)}</th>
										<th>{date.dateRange[0]}</th>
										<th>PPTO.</th>
										<th>(-)</th>
										<th>%</th>
										{date.dateRange[1] && (
											<React.Fragment key={v4()}>
												<th>{date.dateRange[1]}</th>
												<th>(-)</th>
												<th>%</th>
											</React.Fragment>
										)}
									</tr>
								</thead>
								<tbody>
									{values &&
										Array.isArray(values) &&
										values.map((item) => {
											const difDia0 =
												(item['ventasActuales' + dateHelper.getCurrentYear(date.current)] || 0) -
												(incremento === 'compromiso'
													? item['presupuesto' + dateHelper.getCurrentYear(date.current)] || 0
													: item['ventasActuales' + date.dateRange[0]] || 0)
											const difDia1 = date.dateRange[1]
												? (item['ventasActuales' + dateHelper.getCurrentYear(date.current)] || 0) -
													(incremento === 'compromiso'
														? item['presupuesto' + dateHelper.getCurrentYear(date.current)] || 0
														: item['ventasActuales' + date.dateRange[1]] || 0)
												: 0
											const difSem0 =
												(item['ventasSemanalesActual' + dateHelper.getCurrentYear(date.current)] || 0) -
												(incremento === 'compromiso'
													? item['presupuestoSemanal' + dateHelper.getCurrentYear(date.current)] || 0
													: item['ventasSemanalesActual' + date.dateRange[0]] || 0)
											const difSem1 = date.dateRange[1]
												? (item['ventasSemanalesActual' + dateHelper.getCurrentYear(date.current)] || 0) -
													(incremento === 'compromiso'
														? item['presupuestoSemanal' + dateHelper.getCurrentYear(date.current)] || 0
														: item['ventasSemanalesActual' + date.dateRange[1]] || 0)
												: 0

											return (
												<tr key={v4()} data-row-format={isRegionOrPlaza(item.tienda)}>
													<td className="priority-cell text-left">{item.tienda}</td>
													{/* <td className="priority-cell">
													{numberWithCommas(item['ventasActuales' + dateHelper.getCurrentYear(date.current)])}
												</td> */}
													<td className="priority-cell">
														{fmtAmount(item['ventasActuales' + dateHelper.getCurrentYear(date.current)])}
													</td>
													{/* <td>{numberWithCommas(item['ventasActuales' + date.dateRange[0]])}</td> */}
													<td>{fmtAmount(item['ventasActuales' + date.dateRange[0]])}</td>
													{/* <td>{numberWithCommas(item['presupuesto' + dateHelper.getCurrentYear(date.current)])}</td> */}
													<td>{fmtAmount(item['presupuesto' + dateHelper.getCurrentYear(date.current)])}</td>
													<td data-porcent-format={isNegative(difDia0)}>{fmtDiff(difDia0)}</td>
													<td
														data-porcent-format={isNegative(
															item[
																'porcentaje' +
																	getPercentageYear(
																		dateHelper.getCurrentYear(date.current),
																		date.dateRange[0],
																		incremento
																	)
															]
														)}
													>
														{formatPercentage(
															item[
																'porcentaje' +
																	getPercentageYear(
																		dateHelper.getCurrentYear(date.current),
																		date.dateRange[0],
																		incremento
																	)
															]
														)}
													</td>
													{date.dateRange[1] && (
														<React.Fragment key={v4()}>
															<td className="priority-cell">{fmtAmount(item['ventasActuales' + date.dateRange[1]])}</td>
															<td data-porcent-format={isNegative(difDia1)}>{fmtDiff(difDia1)}</td>
															<td data-porcent-format={isNegative(item['porcentaje' + date.dateRange[1]])}>
																{formatPercentage(item['porcentaje' + date.dateRange[1]])}
															</td>
														</React.Fragment>
													)}

													{includeSem && (
														<React.Fragment key={v4()}>
															<td className="priority-cell">
																{fmtAmount(item['ventasSemanalesActual' + dateHelper.getCurrentYear(date.current)])}
															</td>
															<td>{fmtAmount(item['ventasSemanalesActual' + date.dateRange[0]])}</td>
															<td>{fmtAmount(item['presupuestoSemanal' + dateHelper.getCurrentYear(date.current)])}</td>
															<td
																data-porcent-format={isNegative(
																	item[
																		'porcentajeSemanal' +
																			getPercentageYear(
																				dateHelper.getCurrentYear(date.current),
																				date.dateRange[0],
																				incremento
																			)
																	]
																)}
															>
																{formatPercentage(
																	item[
																		'porcentajeSemanal' +
																			getPercentageYear(
																				dateHelper.getCurrentYear(date.current),
																				date.dateRange[0],
																				incremento
																			)
																	]
																)}
															</td>
															{date.dateRange[1] && (
																<React.Fragment key={v4()}>
																	<td>{fmtAmount(item['ventasSemanalesActual' + date.dateRange[1]])}</td>
																	<td data-porcent-format={isNegative(item['porcentajeSemanal' + date.dateRange[1]])}>
																		{formatPercentage(item['porcentajeSemanal' + date.dateRange[1]])}
																	</td>
																</React.Fragment>
															)}
														</React.Fragment>
													)}

													<td className="priority-cell">
														{fmtAmount(item['ventasMensualesActual' + dateHelper.getCurrentYear(date.current)])}
													</td>
													<td>{fmtAmount(item['ventasMensualesActual' + date.dateRange[0]])}</td>
													<td>{fmtAmount(item['presupuestoMensual' + dateHelper.getCurrentYear(date.current)])}</td>
													<td
														data-porcent-format={isNegative(
															item['diferenciaMensual' + date.dateRange[0]] || item['diferenciaMensual']
														)}
													>
														{fmtDiff(item['diferenciaMensual' + date.dateRange[0]] || item['diferenciaMensual'])}
													</td>
													<td
														data-porcent-format={isNegative(
															item[
																'porcentajeMensual' +
																	getPercentageYear(
																		dateHelper.getCurrentYear(date.current),
																		date.dateRange[0],
																		incremento
																	)
															]
														)}
													>
														{formatPercentage(
															item[
																'porcentajeMensual' +
																	getPercentageYear(
																		dateHelper.getCurrentYear(date.current),
																		date.dateRange[0],
																		incremento
																	)
															]
														)}
													</td>
													{date.dateRange[1] && (
														<React.Fragment key={v4()}>
															<td>{fmtAmount(item['ventasMensualesActual' + date.dateRange[1]])}</td>
															<td data-porcent-format={isNegative(item['diferenciaMensual' + date.dateRange[1]])}>
																{fmtDiff(item['diferenciaMensual' + date.dateRange[1]])}
															</td>
															<td data-porcent-format={isNegative(item['porcentajeMensual' + date.dateRange[1]])}>
																{formatPercentage(item['porcentajeMensual' + date.dateRange[1]])}
															</td>
														</React.Fragment>
													)}

													<td className="priority-cell">
														{fmtAmount(item['ventasAnualActual' + dateHelper.getCurrentYear(date.current)])}
													</td>
													<td>{fmtAmount(item['ventasAnualActual' + date.dateRange[0]])}</td>
													<td>{fmtAmount(item['presupuestoAnual' + dateHelper.getCurrentYear(date.current)])}</td>
													<td
														data-porcent-format={isNegative(
															item['diferenciaAnual' + date.dateRange[0]] || item['diferenciaAnual']
														)}
													>
														{fmtDiff(item['diferenciaAnual' + date.dateRange[0]] || item['diferenciaAnual'])}
													</td>
													<td
														data-porcent-format={isNegative(
															item[
																'porcentajeAnual' +
																	getPercentageYear(
																		dateHelper.getCurrentYear(date.current),
																		date.dateRange[0],
																		incremento
																	)
															]
														)}
													>
														{formatPercentage(
															item[
																'porcentajeAnual' +
																	getPercentageYear(
																		dateHelper.getCurrentYear(date.current),
																		date.dateRange[0],
																		incremento
																	)
															]
														)}
													</td>
													{date.dateRange[1] && (
														<React.Fragment key={v4()}>
															<td>{fmtAmount(item['ventasAnualActual' + date.dateRange[1]])}</td>
															<td data-porcent-format={isNegative(item['diferenciaAnual' + date.dateRange[1]])}>
																{fmtDiff(item['diferenciaAnual' + date.dateRange[1]])}
															</td>
															<td data-porcent-format={isNegative(item['porcentajeAnual' + date.dateRange[1]])}>
																{formatPercentage(item['porcentajeAnual' + date.dateRange[1]])}
															</td>
														</React.Fragment>
													)}

													<td className="priority-cell">{item.tienda}</td>
												</tr>
											)
										})}
								</tbody>
							</table>
						</React.Fragment>
					)
				})}

			{/* Mensaje general debajo de las tablas */}
			{webShown && (
				<div className="mt-3 mb-6">
					<p className="text-xs italic text-slate-600 text-center">
						{fusionOn
							? 'Las ventas en línea son reportadas por fecha de facturación.'
							: 'Las ventas en línea son reportadas por fecha de pedido.'}
					</p>
				</div>
			)}
		</div>
	)
}

const TableMovil = (props) => {
	const { date, data, includeSem, incremento, webShown, fusionOn, aeropuertoShown } = props
	const dateHelper = DateHelper()

	return (
		<div className="space-y-4">
			{data &&
				Object.entries(data).map(([key, values]) => {
					if (!webShown && isWebKey(key)) return null
					if (!aeropuertoShown && isAeroKey(key)) return null
					return (
						<React.Fragment key={v4()}>
							{getTableName(key)}
							<div key={v4()} className="space-y-8">
								<table className="table-report-mobile" onClick={selectRow}>
									<caption>{dateHelper.getWeekDate(date.current)}</caption>
									<thead>
										<tr>
											<th>Tienda</th>
											<th>{dateHelper.getCurrentYear(date.current)}</th>
											<th>{date.dateRange[0]}</th>
											<th>PPTO.</th>
											<th>(-)</th>
											<th>%</th>
											{date.dateRange[1] && (
												<React.Fragment key={v4()}>
													<th>{date.dateRange[1]}</th>
													<th>(-)</th>
													<th>%</th>
												</React.Fragment>
											)}
										</tr>
									</thead>
									<tbody>
										{values &&
											Array.isArray(values) &&
											values.map((item) => {
												const difDia0 = calcDif(item, dateHelper, date, incremento, 'daily', 0)
												const difDia1 = date.dateRange[1] ? calcDif(item, dateHelper, date, incremento, 'daily', 1) : 0

												return (
													<tr key={v4()} data-row-format={isRegionOrPlaza(item.tienda)}>
														<td className="priority-cell text-left">{item.tienda}</td>
														<td className="priority-cell">
															{fmtAmount(item['ventasActuales' + dateHelper.getCurrentYear(date.current)])}
														</td>
														<td>{fmtAmount(item['ventasActuales' + date.dateRange[0]])}</td>
														<td>{fmtAmount(item['presupuesto' + dateHelper.getCurrentYear(date.current)])}</td>
														<td data-porcent-format={isNegative(difDia0)}>{fmtDiff(difDia0)}</td>
														<td
															data-porcent-format={isNegative(
																item[
																	'porcentaje' +
																		getPercentageYear(
																			dateHelper.getCurrentYear(date.current),
																			date.dateRange[0],
																			incremento
																		)
																]
															)}
														>
															{formatPercentage(
																item[
																	'porcentaje' +
																		getPercentageYear(
																			dateHelper.getCurrentYear(date.current),
																			date.dateRange[0],
																			incremento
																		)
																]
															)}
														</td>
														{date.dateRange[1] && (
															<React.Fragment key={v4()}>
																<td className="priority-cell">
																	{fmtAmount(item['ventasActuales' + date.dateRange[1]])}
																</td>
																<td data-porcent-format={isNegative(difDia1)}>{fmtDiff(difDia1)}</td>
																<td data-porcent-format={isNegative(item['porcentaje' + date.dateRange[1]])}>
																	{formatPercentage(item['porcentaje' + date.dateRange[1]])}
																</td>
															</React.Fragment>
														)}
													</tr>
												)
											})}
									</tbody>
								</table>

								{includeSem && (
									<table className="table-report-mobile" onClick={selectRow}>
										<caption>{dateHelper.getweekRange(date.current).toUpperCase()}</caption>
										<thead>
											<tr>
												<th>Tienda</th>
												<th>{dateHelper.getCurrentYear(date.current)}</th>
												<th>{date.dateRange[0]}</th>
												<th>PPTO.</th>
												<th>(-)</th>
												<th>%</th>
												{date.dateRange[1] && (
													<React.Fragment key={v4()}>
														<th>{date.dateRange[1]}</th>
														<th>(-)</th>
														<th>%</th>
													</React.Fragment>
												)}
											</tr>
										</thead>
										<tbody>
											{values &&
												Array.isArray(values) &&
												values.map((item) => {
													const difSem0 = calcDif(item, dateHelper, date, incremento, 'weekly', 0)
													const difSem1 = date.dateRange[1]
														? calcDif(item, dateHelper, date, incremento, 'weekly', 1)
														: 0

													return (
														<tr key={v4()} data-row-format={isRegionOrPlaza(item.tienda)}>
															<td className="priority-cell text-left">{item.tienda}</td>
															<td className="priority-cell">
																{fmtAmount(item['ventasSemanalesActual' + dateHelper.getCurrentYear(date.current)])}
															</td>
															<td>{fmtAmount(item['ventasSemanalesActual' + date.dateRange[0]])}</td>
															<td>{fmtAmount(item['presupuestoSemanal' + dateHelper.getCurrentYear(date.current)])}</td>
															<td data-porcent-format={isNegative(difSem0)}>{fmtDiff(difSem0)}</td>
															<td
																data-porcent-format={isNegative(
																	item[
																		'porcentajeSemanal' +
																			getPercentageYear(
																				dateHelper.getCurrentYear(date.current),
																				date.dateRange[0],
																				incremento
																			)
																	]
																)}
															>
																{formatPercentage(
																	item[
																		'porcentajeSemanal' +
																			getPercentageYear(
																				dateHelper.getCurrentYear(date.current),
																				date.dateRange[0],
																				incremento
																			)
																	]
																)}
															</td>
															{date.dateRange[1] && (
																<React.Fragment key={v4()}>
																	<td>{fmtAmount(item['ventasSemanalesActual' + date.dateRange[1]])}</td>
																	<td data-porcent-format={isNegative(difSem1)}>{fmtDiff(difSem1)}</td>
																	<td data-porcent-format={isNegative(item['porcentajeSemanal' + date.dateRange[1]])}>
																		{formatPercentage(item['porcentajeSemanal' + date.dateRange[1]])}
																	</td>
																</React.Fragment>
															)}
														</tr>
													)
												})}
										</tbody>
									</table>
								)}

								<table className="table-report-mobile" onClick={selectRow}>
									<caption>{`Acumulado ${dateHelper.getMonthName(date.current)}`}</caption>
									<thead>
										<tr>
											<th>Tienda</th>
											<th>{dateHelper.getCurrentYear(date.current)}</th>
											<th>{date.dateRange[0]}</th>
											<th>PPTO.</th>
											<th>(-)</th>
											<th>%</th>
											{date.dateRange[1] && (
												<React.Fragment key={v4()}>
													<th>{date.dateRange[1]}</th>
													<th>(-)</th>
													<th>%</th>
												</React.Fragment>
											)}
										</tr>
									</thead>
									<tbody>
										{values &&
											Array.isArray(values) &&
											values.map((item) => (
												<tr key={v4()} data-row-format={isRegionOrPlaza(item.tienda)}>
													<td className="priority-cell text-left">{item.tienda}</td>
													<td className="priority-cell">
														{fmtAmount(item['ventasMensualesActual' + dateHelper.getCurrentYear(date.current)])}
													</td>
													<td>{fmtAmount(item['ventasMensualesActual' + date.dateRange[0]])}</td>
													<td>{fmtAmount(item['presupuestoMensual' + dateHelper.getCurrentYear(date.current)])}</td>
													<td
														data-porcent-format={isNegative(
															item['diferenciaMensual' + date.dateRange[0]] || item['diferenciaMensual']
														)}
													>
														{fmtDiff(item['diferenciaMensual' + date.dateRange[0]] || item['diferenciaMensual'])}
													</td>
													<td
														data-porcent-format={isNegative(
															item[
																'porcentajeMensual' +
																	getPercentageYear(
																		dateHelper.getCurrentYear(date.current),
																		date.dateRange[0],
																		incremento
																	)
															]
														)}
													>
														{formatPercentage(
															item[
																'porcentajeMensual' +
																	getPercentageYear(
																		dateHelper.getCurrentYear(date.current),
																		date.dateRange[0],
																		incremento
																	)
															]
														)}
													</td>
													{date.dateRange[1] && (
														<React.Fragment key={v4()}>
															<td>{fmtAmount(item['ventasMensualesActual' + date.dateRange[1]])}</td>
															<td data-porcent-format={isNegative(item['diferenciaMensual' + date.dateRange[1]])}>
																{fmtDiff(item['diferenciaMensual' + date.dateRange[1]])}
															</td>
															<td data-porcent-format={isNegative(item['porcentajeMensual' + date.dateRange[1]])}>
																{formatPercentage(item['porcentajeMensual' + date.dateRange[1]])}
															</td>
														</React.Fragment>
													)}
												</tr>
											))}
									</tbody>
								</table>

								<table className="table-report-mobile" onClick={selectRow}>
									<caption>Acumulado Anual</caption>
									<thead>
										<tr>
											<th>Tienda</th>
											<th>{dateHelper.getCurrentYear(date.current)}</th>
											<th>{date.dateRange[0]}</th>
											<th>PPTO.</th>
											<th>(-)</th>
											<th>%</th>
											{date.dateRange[1] && (
												<React.Fragment key={v4()}>
													<th>{date.dateRange[1]}</th>
													<th>(-)</th>
													<th>%</th>
												</React.Fragment>
											)}
										</tr>
									</thead>
									<tbody>
										{values &&
											Array.isArray(values) &&
											values.map((item) => (
												<tr key={v4()} data-row-format={isRegionOrPlaza(item.tienda)}>
													<td className="priority-cell text-left">{item.tienda}</td>
													<td className="priority-cell">
														{fmtAmount(item['ventasAnualActual' + dateHelper.getCurrentYear(date.current)])}
													</td>
													<td>{fmtAmount(item['ventasAnualActual' + date.dateRange[0]])}</td>
													<td>{fmtAmount(item['presupuestoAnual' + dateHelper.getCurrentYear(date.current)])}</td>
													<td
														data-porcent-format={isNegative(
															item['diferenciaAnual' + date.dateRange[0]] || item['diferenciaAnual']
														)}
													>
														{fmtDiff(item['diferenciaAnual' + date.dateRange[0]] || item['diferenciaAnual'])}
													</td>
													<td
														data-porcent-format={isNegative(
															item[
																'porcentajeAnual' +
																	getPercentageYear(
																		dateHelper.getCurrentYear(date.current),
																		date.dateRange[0],
																		incremento
																	)
															]
														)}
													>
														{formatPercentage(
															item[
																'porcentajeAnual' +
																	getPercentageYear(
																		dateHelper.getCurrentYear(date.current),
																		date.dateRange[0],
																		incremento
																	)
															]
														)}
													</td>
													{date.dateRange[1] && (
														<React.Fragment key={v4()}>
															<td>{fmtAmount(item['ventasAnualActual' + date.dateRange[1]])}</td>
															<td data-porcent-format={isNegative(item['diferenciaAnual' + date.dateRange[1]])}>
																{fmtDiff(item['diferenciaAnual' + date.dateRange[1]])}
															</td>
															<td data-porcent-format={isNegative(item['porcentajeAnual' + date.dateRange[1]])}>
																{formatPercentage(item['porcentajeAnual' + date.dateRange[1]])}
															</td>
														</React.Fragment>
													)}
												</tr>
											))}
									</tbody>
								</table>
							</div>
						</React.Fragment>
					)
				})}

			{/* Mensaje general debajo de las tablas */}
			{webShown && (
				<div className="mt-3 mb-6">
					<p className="text-xs italic text-slate-600 text-center">
						{fusionOn
							? 'Las ventas en línea son reportadas por fecha de facturación.'
							: 'Las ventas en línea son reportadas por fecha de pedido.'}
					</p>
				</div>
			)}
		</div>
	)
}

const Stat = (props) => {
	const { date, data, includeSem, incremento, webShown, fusionOn, aeropuertoShown } = props
	const dateHelper = DateHelper()

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
			{data &&
				Object.entries(data).map(([key, values]) => {
					if (!webShown && isWebKey(key)) return null
					if (!aeropuertoShown && isAeroKey(key)) return null
					const Items =
						values &&
						values.map((item) => {
							const difDia0 = calcDif(item, dateHelper, date, incremento, 'daily', 0)
							const difDia1 = date.dateRange[1] ? calcDif(item, dateHelper, date, incremento, 'daily', 1) : 0
							const difSem0 = calcDif(item, dateHelper, date, incremento, 'weekly', 0)
							const difSem1 = date.dateRange[1] ? calcDif(item, dateHelper, date, incremento, 'weekly', 1) : 0
							const acumDia = {
								columnTitle: dateHelper.getWeekDate(date.current),
								values: [
									{
										caption: dateHelper.getCurrentYear(date.current),
										value: fmtAmount(item['ventasActuales' + dateHelper.getCurrentYear(date.current)])
									},
									{
										caption: date.dateRange[0],
										value: fmtAmount(item['ventasActuales' + date.dateRange[0]])
									},
									{
										caption: 'PPTO.',
										value: fmtAmount(item['presupuesto' + dateHelper.getCurrentYear(date.current)])
									},
									{
										caption: '(-)',
										value: stringFormatNumber(difDia0, false)
									},
									{
										caption: '%',
										value: stringFormatNumber(
											item[
												'porcentaje' +
													getPercentageYear(dateHelper.getCurrentYear(date.current), date.dateRange[0], incremento)
											],
											true
										)
									},
									date.dateRange[1] && [
										{
											caption: date.dateRange[1],
											value: fmtAmount(item['ventasActuales' + date.dateRange[1]])
										},
										{
											caption: '(-)',
											value: stringFormatNumber(difDia1, false)
										},
										{
											caption: '%',
											value: stringFormatNumber(item['porcentaje' + date.dateRange[1]], true)
										}
									]
								].flat(2)
							}

							const acumSem = {
								columnTitle: dateHelper.getweekRange(date.current).toUpperCase(),
								values: [
									{
										caption: dateHelper.getCurrentYear(date.current),
										value: fmtAmount(item['ventasSemanalesActual' + dateHelper.getCurrentYear(date.current)])
									},
									{
										caption: date.dateRange[0],
										value: fmtAmount(item['ventasSemanalesActual' + date.dateRange[0]])
									},
									{
										caption: 'PPTO.',
										value: fmtAmount(item['presupuestoSemanal' + dateHelper.getCurrentYear(date.current)])
									},
									{
										caption: '(-)',
										value: stringFormatNumber(difSem0, false)
									},
									{
										caption: '%',
										value: stringFormatNumber(
											item[
												'porcentajeSemanal' +
													getPercentageYear(dateHelper.getCurrentYear(date.current), date.dateRange[0], incremento)
											],
											true
										)
									},
									date.dateRange[1] && [
										{
											caption: date.dateRange[1],
											value: fmtAmount(item['ventasSemanalesActual' + date.dateRange[1]])
										},
										{
											caption: '(-)',
											value: stringFormatNumber(difSem1, false)
										},
										{
											caption: '%',
											value: stringFormatNumber(item['porcentajeSemanal' + date.dateRange[1]], true)
										}
									]
								].flat(2)
							}

							const acumMes = {
								columnTitle: `Acumulado ${dateHelper.getMonthName(date.current)}`,
								values: [
									{
										caption: dateHelper.getCurrentYear(date.current),
										value: fmtAmount(item['ventasMensualesActual' + dateHelper.getCurrentYear(date.current)])
									},
									{
										caption: date.dateRange[0],
										value: fmtAmount(item['ventasMensualesActual' + date.dateRange[0]])
									},
									{
										caption: 'PPTO.',
										value: fmtAmount(item['presupuestoMensual' + dateHelper.getCurrentYear(date.current)])
									},
									{
										caption: '(-)',
										value: stringFormatNumber(
											item['diferenciaMensual' + date.dateRange[0]] || item['diferenciaMensual']
										)
									},
									{
										caption: '%',
										value: stringFormatNumber(
											item[
												'porcentajeMensual' +
													getPercentageYear(dateHelper.getCurrentYear(date.current), date.dateRange[0], incremento)
											],
											true
										)
									},
									date.dateRange[1] && [
										{
											caption: date.dateRange[1],
											value: fmtAmount(item['ventasMensualesActual' + date.dateRange[1]])
										},
										{
											caption: '(-)',
											value: stringFormatNumber(
												item['diferenciaMensual' + dateHelper.getCurrentYear(date.current)],
												false
											)
										},
										{
											caption: '%',
											value: stringFormatNumber(item['porcentajeMensual' + date.dateRange[1]], true)
										}
									]
								].flat(2)
							}

							const acumAnua = {
								columnTitle: 'Acumulado Anual',
								values: [
									{
										caption: dateHelper.getCurrentYear(date.current),
										value: fmtAmount(item['ventasAnualActual' + dateHelper.getCurrentYear(date.current)])
									},
									{
										caption: date.dateRange[0],
										value: fmtAmount(item['ventasAnualActual' + date.dateRange[0]])
									},
									{
										caption: 'PPTO.',
										value: fmtAmount(item['presupuestoAnual' + dateHelper.getCurrentYear(date.current)])
									},
									{
										caption: '(-)',
										value: stringFormatNumber(
											item['diferenciaAnual' + date.dateRange[0]] || item['diferenciaAnual'],
											false
										)
									},
									{
										caption: '%',
										value: stringFormatNumber(item['porcentajeAnual' + dateHelper.getCurrentYear(date.current)], true)
									},
									date.dateRange[1] && [
										{
											caption: date.dateRange[1],
											value: fmtAmount(item['ventasAnualActual' + date.dateRange[1]])
										},
										{
											caption: '(-)',
											value: stringFormatNumber(
												item[
													'diferenciaAnual' +
														getPercentageYear(dateHelper.getCurrentYear(date.current), date.dateRange[0], incremento)
												],
												false
											)
										},
										{
											caption: '%',
											value: stringFormatNumber(item['porcentajeAnual' + date.dateRange[1]], true)
										}
									]
								].flat(2)
							}

							return (
								<Stats
									key={v4()}
									title={item.tienda}
									expand={includeSem ? true : false}
									columns={[acumDia, includeSem && acumSem, acumMes, acumAnua]}
								/>
							)
						})
					return Items
				})}

			{/* Mensaje general debajo de las tablas */}
			{webShown && (
				<div className="mt-3 mb-6">
					<p className="text-xs italic text-slate-600 text-center">
						{fusionOn
							? 'Las ventas en línea son reportadas por fecha de facturación.'
							: 'Las ventas en línea son reportadas por fecha de pedido.'}
					</p>
				</div>
			)}
		</div>
	)
}

const StatGroup = (props) => {
	const { date, data, includeSem, incremento, region, webShown, fusionOn, aeropuertoShown } = props
	const dateHelper = DateHelper()

	if (data && data.hasOwnProperty(region)) {
		let acumDia = []
		let acumSem = []
		let acumMes = []
		let acumAnual = []

		if (region !== 'TOTAL') {
			data[region].forEach((item) => {
				acumDia.push({
					columnTitle: item.tienda,
					values: [
						{
							caption: dateHelper.getCurrentYear(date.current),
							value: fmtAmount(item['ventasActuales' + dateHelper.getCurrentYear(date.current)])
						},
						{
							caption: date.dateRange[0],
							value: fmtAmount(item['ventasActuales' + date.dateRange[0]])
						},
						{
							caption: 'PPTO.',
							value: fmtAmount(item['presupuesto' + dateHelper.getCurrentYear(date.current)])
						},
						{
							caption: '%',
							value: stringFormatNumber(
								item[
									'porcentaje' +
										getPercentageYear(dateHelper.getCurrentYear(date.current), date.dateRange[0], incremento)
								],
								true
							)
						},
						date.dateRange[1] && [
							{
								caption: date.dateRange[1],
								value: fmtAmount(item['ventasActuales' + date.dateRange[1]])
							},
							{
								caption: '%',
								value: stringFormatNumber(item['porcentaje' + date.dateRange[1]], true)
							}
						]
					].flat(2)
				})

				acumSem.push({
					columnTitle: item.tienda,
					values: [
						{
							caption: dateHelper.getCurrentYear(date.current),
							value: fmtAmount(item['ventasSemanalesActual' + dateHelper.getCurrentYear(date.current)])
						},
						{
							caption: date.dateRange[0],
							value: fmtAmount(item['ventasSemanalesActual' + date.dateRange[0]])
						},
						{
							caption: 'PPTO.',
							value: fmtAmount(item['presupuestoSemanal' + dateHelper.getCurrentYear(date.current)])
						},
						{
							caption: '%',
							value: stringFormatNumber(
								item[
									'porcentajeSemanal' +
										getPercentageYear(dateHelper.getCurrentYear(date.current), date.dateRange[0], incremento)
								],
								true
							)
						},
						date.dateRange[1] && [
							{
								caption: date.dateRange[1],
								value: fmtAmount(item['ventasSemanalesActual' + date.dateRange[1]])
							},
							{
								caption: '%',
								value: stringFormatNumber(item['porcentajeSemanal' + date.dateRange[1]], true)
							}
						]
					].flat(2)
				})

				acumMes.push({
					columnTitle: item.tienda,
					values: [
						{
							caption: dateHelper.getCurrentYear(date.current),
							value: fmtAmount(item['ventasMensualesActual' + dateHelper.getCurrentYear(date.current)])
						},
						{
							caption: date.dateRange[0],
							value: fmtAmount(item['ventasMensualesActual' + date.dateRange[0]])
						},
						{
							caption: 'PPTO.',
							value: fmtAmount(item['presupuestoMensual' + dateHelper.getCurrentYear(date.current)])
						},
						{
							caption: '(-)',
							value: stringFormatNumber(
								item['diferenciaMensual' + date.dateRange[0]] || item['diferenciaMensual'],
								false
							)
						},
						{
							caption: '%',
							value: stringFormatNumber(
								item[
									'porcentajeMensual' +
										getPercentageYear(dateHelper.getCurrentYear(date.current), date.dateRange[0], incremento)
								],
								true
							)
						},
						date.dateRange[1] && [
							{
								caption: date.dateRange[1],
								value: fmtAmount(item['ventasMensualesActual' + date.dateRange[1]])
							},
							{
								caption: '(-)',
								value: stringFormatNumber(item['diferenciaMensual' + date.dateRange[0]], false)
							},
							{
								caption: '%',
								value: stringFormatNumber(item['porcentajeMensual' + date.dateRange[0]], true)
							}
						]
					].flat(2)
				})

				acumAnual.push({
					columnTitle: item.tienda,
					values: [
						{
							caption: dateHelper.getCurrentYear(date.current),
							value: fmtAmount(item['ventasAnualActual' + dateHelper.getCurrentYear(date.current)])
						},
						{
							caption: date.dateRange[0],
							value: fmtAmount(item['ventasAnualActual' + date.dateRange[0]])
						},
						{
							caption: 'PPTO.',
							value: fmtAmount(item['presupuestoAnual' + dateHelper.getCurrentYear(date.current)])
						},
						{
							caption: '(-)',
							value: stringFormatNumber(item['diferenciaAnual' + date.dateRange[0]] || item['diferenciaAnual'], false)
						},
						{
							caption: '%',
							value: stringFormatNumber(
								item[
									'porcentajeAnual' +
										getPercentageYear(dateHelper.getCurrentYear(date.current), date.dateRange[0], incremento)
								],
								true
							)
						},
						date.dateRange[1] && [
							{
								caption: date.dateRange[1],
								value: fmtAmount(item['ventasAnualActual' + date.dateRange[1]])
							},
							{
								caption: '(-)',
								value: stringFormatNumber(item['diferenciaAnual' + date.dateRange[0]], false)
							},
							{
								caption: '%',
								value: stringFormatNumber(item['porcentajeAnual' + date.dateRange[0]], true)
							}
						]
					].flat(2)
				})
			})

			return (
				<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
					<Stats title={dateHelper.getWeekDate(date.current)} columns={acumDia} expand={false} />
					{includeSem && (
						<Stats title={dateHelper.getweekRange(date.current).toUpperCase()} columns={acumSem} expand={false} />
					)}
					<Stats title={`Acumulado ${dateHelper.getMonthName(date.current)}`} columns={acumMes} expand={false} />
					<Stats title={'Acumulado Anual'} columns={acumAnual} expand={false} />

					{/* Mensaje general debajo de las tablas */}
					{webShown && (
						<div className="mt-3 mb-6">
							<p className="text-xs italic text-slate-600 text-center">
								{fusionOn
									? 'Las ventas en línea son reportadas por fecha de facturación.'
									: 'Las ventas en línea son reportadas por fecha de pedido.'}
							</p>
						</div>
					)}
				</div>
			)
		} else {
			return Object.entries(data.TOTAL).map(([key, item]) => {
				const difDia0 = calcDif(item, dateHelper, date, incremento, 'daily', 0)
				const difDia1 = date.dateRange[1] ? calcDif(item, dateHelper, date, incremento, 'daily', 1) : 0
				const difSem0 = calcDif(item, dateHelper, date, incremento, 'weekly', 0)
				const difSem1 = date.dateRange[1] ? calcDif(item, dateHelper, date, incremento, 'weekly', 1) : 0

				acumDia = [
					{
						columnTitle: item.tienda,
						values: [
							{
								caption: dateHelper.getCurrentYear(date.current),
								value: fmtAmount(item['ventasActuales' + dateHelper.getCurrentYear(date.current)])
							},
							{
								caption: date.dateRange[0],
								value: fmtAmount(item['ventasActuales' + date.dateRange[0]])
							},
							{
								caption: 'PPTO.',
								value: fmtAmount(item['presupuesto' + dateHelper.getCurrentYear(date.current)])
							},
							{
								caption: '(-)',
								value: stringFormatNumber(difDia0, false)
							},
							{
								caption: '%',
								value: stringFormatNumber(
									item[
										'porcentaje' +
											getPercentageYear(dateHelper.getCurrentYear(date.current), date.dateRange[0], incremento)
									]
								)
							},
							date.dateRange[1] && [
								{
									caption: date.dateRange[1],
									value: fmtAmount(item['ventasActuales' + date.dateRange[1]])
								},
								{
									caption: '(-)',
									value: stringFormatNumber(difDia1, false)
								},
								{
									caption: '%',
									value: stringFormatNumber(item['porcentaje' + date.dateRange[1]])
								}
							]
						].flat(2)
					}
				]

				acumSem = [
					{
						columnTitle: item.tienda,
						values: [
							{
								caption: dateHelper.getCurrentYear(date.current),
								value: fmtAmount(item['ventasSemanalesActual' + dateHelper.getCurrentYear(date.current)])
							},
							{
								caption: date.dateRange[0],
								value: fmtAmount(item['ventasSemanalesActual' + date.dateRange[0]])
							},
							{
								caption: 'PPTO.',
								value: fmtAmount(item['presupuestoSemanal' + dateHelper.getCurrentYear(date.current)])
							},
							{
								caption: '(-)',
								value: stringFormatNumber(difSem0, false)
							},
							{
								caption: '%',
								value: stringFormatNumber(
									item[
										'porcentajeSemanal' +
											getPercentageYear(dateHelper.getCurrentYear(date.current), date.dateRange[0], incremento)
									]
								)
							},
							date.dateRange[1] && [
								{
									caption: date.dateRange[1],
									value: fmtAmount(item['ventasSemanalesActual' + date.dateRange[1]])
								},
								{
									caption: '(-)',
									value: stringFormatNumber(difSem1, false)
								},
								{
									caption: '%',
									value: stringFormatNumber(item['porcentajeSemanal' + date.dateRange[1]])
								}
							]
						].flat(2)
					}
				]

				acumMes = [
					{
						columnTitle: item.tienda,
						values: [
							{
								caption: dateHelper.getCurrentYear(date.current),
								value: fmtAmount(item['ventasMensualesActual' + dateHelper.getCurrentYear(date.current)])
							},
							{
								caption: date.dateRange[0],
								value: fmtAmount(item['ventasMensualesActual' + date.dateRange[0]])
							},
							{
								caption: 'PPTO.',
								value: fmtAmount(item['presupuestoMensual' + dateHelper.getCurrentYear(date.current)])
							},
							{
								caption: '(-)',
								value: stringFormatNumber(
									item['diferenciaMensual' + dateHelper.getCurrentYear(date.current)] || item['diferenciaMensual']
								)
							},
							{
								caption: '%',
								value: stringFormatNumber(
									item[
										'porcentajeMensual' +
											getPercentageYear(dateHelper.getCurrentYear(date.current), date.dateRange[0], incremento)
									]
								)
							},
							date.dateRange[1] && [
								{
									caption: date.dateRange[1],
									value: fmtAmount(item['ventasMensualesActual' + date.dateRange[1]])
								},
								{
									caption: '(-)',
									value: stringFormatNumber(item['diferenciaMensual' + dateHelper.getCurrentYear(date.current)])
								},
								{
									caption: '%',
									value: stringFormatNumber(item['porcentajeMensual' + date.dateRange[1]])
								}
							]
						].flat(2)
					}
				]

				acumAnual = [
					{
						columnTitle: item.tienda,
						values: [
							{
								caption: dateHelper.getCurrentYear(date.current),
								value: fmtAmount(item['ventasAnualActual' + dateHelper.getCurrentYear(date.current)])
							},
							{
								caption: date.dateRange[0],
								value: fmtAmount(item['ventasAnualActual' + date.dateRange[0]])
							},
							{
								caption: 'PPTO.',
								value: fmtAmount(item['presupuestoAnual' + dateHelper.getCurrentYear(date.current)])
							},
							{
								caption: '(-)',
								value: stringFormatNumber(
									item['diferenciaAnual' + dateHelper.getCurrentYear(date.current)] || item['diferenciaAnual']
								)
							},
							{
								caption: '%',
								value: stringFormatNumber(
									item[
										'porcentajeAnual' +
											getPercentageYear(dateHelper.getCurrentYear(date.current), date.dateRange[0], incremento)
									]
								)
							},
							date.dateRange[1] && [
								{
									caption: date.dateRange[1],
									value: fmtAmount(item['ventasAnualActual' + date.dateRange[1]])
								},
								{
									caption: '(-)',
									value: stringFormatNumber(item['diferenciaAnual' + dateHelper.getCurrentYear(date.current)])
								},
								{
									caption: '%',
									value: stringFormatNumber(item['porcentajeAnual' + date.dateRange[1]])
								}
							]
						].flat(2)
					}
				]

				return (
					// eslint-disable-next-line react/jsx-key
					<div className="mb-8 space-y-4">
						{getTableName(key)}
						<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
							<Stats title={dateHelper.getWeekDate(date.current)} columns={acumDia} expand={false} />
							{includeSem && (
								<Stats title={dateHelper.getweekRange(date.current).toUpperCase()} columns={acumSem} expand={false} />
							)}
							<Stats title={`Acumulado ${dateHelper.getMonthName(date.current)}`} columns={acumMes} expand={false} />
							<Stats title={'Acumulado Anual'} columns={acumAnual} expand={false} />
						</div>
					</div>
				)
			})
		}
	}
	return <></>
}

const GrupoWithAuth = withAuth(Grupo)
GrupoWithAuth.getLayout = getVentasLayout
export default GrupoWithAuth
