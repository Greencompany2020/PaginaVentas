// pages/reportes/VentaDetNivelTienda.jsx
import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { Formik, Form } from 'formik'

import withAuth from '../../components/withAuth'
import { getVentasLayout } from '../../components/layout/VentasLayout'
import TitleReport from '../../components/TitleReport'
import { useNotification } from '../../components/notifications/NotificationsProvider'
import { isMobile } from 'react-device-detect'
import ViewFilter from '../../components/ViewFilter'
import { getTableName, parseNumberToBoolean } from '../../utils/functions'
import { numberWithCommas, selectRow } from '../../utils/resultsFormated'
import Stats from '../../components/Stats'

import { ParametersContainer, Parameters } from '../../components/containers'
import { Input, Checkbox } from '../../components/reportInputs'
import ExcelButton from '../../components/buttons/ExcelButton'
import { v4 } from 'uuid'

import DateHelper from '../../utils/dateHelper'

import { getVentaDetNivelTienda } from '../../services/VentaDetService'

const pct = (n) => `${(Number(n || 0) * 100).toFixed(1)}%`

// --- helpers de orden ---
const REGION_ORDER = ['REGION I', 'REGION II', 'REGION III', 'WEB']
const PLAZA_ORDER = ['MAZATLAN', 'ACAPULCO', 'CANCUN', 'PCARMEN', 'ISM', 'COZUMEL', 'VALLARTA', 'CABOS']

const plazaIndex = (p) => {
	const i = PLAZA_ORDER.indexOf(String(p || '').toUpperCase())
	return i === -1 ? 98 : i
}

const regionIndex = (r) => {
	const i = REGION_ORDER.indexOf(String(r || '').toUpperCase())
	return i === -1 ? 99 : i
}

// extrae sufijo numérico del final (M1 -> 1, PV12 -> 12, etc.)
const numSufijo = (label = '') => {
	const rev = `${label}`.split('').reverse().join('')
	const cut = rev.search(/[^0-9]/)
	if (cut <= 0) return null
	const digits = rev.slice(0, cut).split('').reverse().join('')
	const n = parseInt(digits, 10)
	return Number.isFinite(n) ? n : null
}

// etiqueta visible en primera columna
const displayLabel = (r) => {
	const t = String(r.Tienda || '')
	if (t === 'TOTAL') return 'TOTAL'
	if (/^TOT\s+/i.test(t)) return String(r.Plaza || t).toUpperCase()
	return t
}

const isBoolean = (data) => {
	if (data === 'N') {
		return false
	} else {
		return true
	}
}

function VentaDetNivelTienda(props) {
	const { config } = props
	const sendNotification = useNotification()
	const dateHelper = DateHelper()

	const [loading, setLoading] = useState(false)
	const [dataReport, setDataReport] = useState(null)
	const [displayMode, setDisplayMode] = useState(isMobile ? config?.mobileReportView : config?.desktopReportView)
	const [seccions, setSeccions] = useState(['REGION I', 'REGION II', 'REGION III', 'WEB', 'TOTAL'])
	const [currentRegion, setCurrentRegion] = useState(seccions[0])
	const [rows, setRows] = useState([])
	const [range, setRange] = useState(() => {
		const now = new Date()
		const ayer = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1) // local
		const ini = new Date(ayer.getFullYear(), ayer.getMonth(), 1)
		const ymd = (d) =>
			`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
		return { ini: ymd(ini), fin: ymd(ayer) }
	})

	const initialParams = {
		fechaIni: range.ini,
		fechaFin: range.fin,
		verAcumulado: false,
		conVentasEventos: parseNumberToBoolean(config?.conVentasEventos || 0),
		conVentasEnLinea: isBoolean(config?.incluirWeb || 'N')
	}

	async function handleSubmit(values) {
		try {
			setLoading(true)
			setRows([])

			let fIni = values.fechaIni
			if (values.verAcumulado) {
				const d = new Date(values.fechaFin + 'T12:00:00')
				fIni = `${d.getFullYear()}-01-01`
			}

			const payload = {
				fechaIni: fIni,
				fechaFin: values.fechaFin,
				conVentasEventos: values.conVentasEventos ? '1' : '2',
				conVentasEnLinea: values.conVentasEnLinea ? 'Y' : 'N'
			}

			const data = await getVentaDetNivelTienda(payload)

			setDataReport(data)

			setRows(Array.isArray(data) ? data : [])
			setRange({ ini: fIni, fin: values.fechaFin, isAcum: values.verAcumulado })
		} catch (err) {
			sendNotification({
				type: 'ERROR',
				message: err?.response?.data?.message || err?.message || 'Error al cargar el reporte'
			})
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		handleSubmit(initialParams)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// // --- Construir UNA sola lista con: REGION (row sintética), PLAZA (TOT), TIENDAS y TOTAL ---
	// const flat = useMemo(() => {
	// 	if (!rows?.length) return []

	// 	// total global (para % venta de filas sintéticas)
	// 	const totalRow = rows.find((r) => r.Tienda === 'TOTAL')
	// 	const totalGlobal = Number(totalRow?.Venta || 0)

	// 	// agrupar por región y plaza
	// 	const byRegPlaza = new Map()
	// 	for (const r of rows) {
	// 		const reg = String(r.Region || 'SIN REGION')
	// 		const plz = String(r.Plaza || '')
	// 		const key = `${reg}||${plz}`
	// 		if (!byRegPlaza.has(key)) byRegPlaza.set(key, [])
	// 		byRegPlaza.get(key).push(r)
	// 	}

	// 	// regiones en orden
	// 	const regiones = Array.from(new Set(rows.map((r) => String(r.Region || 'SIN REGION')))).sort(
	// 		(a, b) => regionIndex(a) - regionIndex(b)
	// 	)

	// 	const out = []

	// 	for (const region of regiones) {
	// 		// tiendas de la región (evitar duplicar con TOT plaza o TOTAL)
	// 		const deRegion = rows.filter((r) => String(r.Region || 'SIN REGION') === region && r.Tienda !== 'TOTAL')

	// 		// región: crear fila sintética SUMA de tiendas (excluye TOT plaza)
	// 		const soloTiendas = deRegion.filter((r) => !/^TOT\s+/i.test(String(r.Tienda || '')))
	// 		const regSum = (field) => soloTiendas.reduce((a, b) => a + Number(b[field] || 0), 0)

	// 		const regionRow = {
	// 			_level: 'region',
	// 			Region: region,
	// 			Plaza: null,
	// 			Tienda: region,
	// 			Venta: regSum('Venta'),
	// 			PartVenta:
	// 				rows.find((r) => r.Tienda === 'TOTAL')?.Venta || 0
	// 					? regSum('Venta') / Number(rows.find((r) => r.Tienda === 'TOTAL')?.Venta || 0)
	// 					: 0,
	// 			VentaLinea: regSum('VentaLinea'),
	// 			PartVentaLinea: regSum('Venta') ? regSum('VentaLinea') / regSum('Venta') : 0,
	// 			VentaModa: regSum('VentaModa'),
	// 			PartVentaModa: regSum('Venta') ? regSum('VentaModa') / regSum('Venta') : 0,
	// 			VentaAccesorio: regSum('VentaAccesorio'),
	// 			PartVentaAcc: regSum('Venta') ? regSum('VentaAccesorio') / regSum('Venta') : 0,
	// 			VentaFrogs: regSum('VentaFrogs'),
	// 			PartVentaFrogs: regSum('Venta') ? regSum('VentaFrogs') / regSum('Venta') : 0,
	// 			VentaMika: regSum('VentaMika'),
	// 			PartMika: regSum('Venta') ? regSum('VentaMika') / regSum('Venta') : 0
	// 		}

	// 		// plazas de la región en orden
	// 		const plazasReg = Array.from(new Set(deRegion.map((r) => r.Plaza))).sort((a, b) => plazaIndex(a) - plazaIndex(b))

	// 		for (const plaza of plazasReg) {
	// 			const key = `${region}||${plaza}`
	// 			const pack = (byRegPlaza.get(key) || []).slice()

	// 			// separar tiendas normales y TOT plaza
	// 			const totPlaza = pack.find((r) => /^TOT\s+/i.test(String(r.Tienda || '')))
	// 			const tiendas = pack.filter((r) => !/^TOT\s+/i.test(String(r.Tienda || '')))

	// 			// ordenar tiendas por sufijo (y casos especiales de Cancún)
	// 			tiendas.sort((a, b) => {
	// 				const la = String(a.Tienda || '')
	// 				const lb = String(b.Tienda || '')
	// 				if (String(a.Plaza).toUpperCase() === 'CANCUN' || String(b.Plaza).toUpperCase() === 'CANCUN') {
	// 					const special = (s) => {
	// 						const u = s.toUpperCase()
	// 						if (u.startsWith('IS-5')) return 998
	// 						if (u.startsWith('OUTLET MCD')) return 999
	// 						if (u.startsWith('FORUM')) return 1000
	// 						return null
	// 					}
	// 					const sa = special(la)
	// 					const sb = special(lb)
	// 					if (sa !== null || sb !== null) return (sa ?? 0) - (sb ?? 0)
	// 				}
	// 				const na = numSufijo(la)
	// 				const nb = numSufijo(lb)
	// 				if (na === null && nb === null) return la.localeCompare(lb)
	// 				if (na === null) return 1
	// 				if (nb === null) return -1
	// 				return na - nb
	// 			})

	// 			// primero todas las tiendas
	// 			for (const t of tiendas) out.push({ ...t, _level: 'store' })

	// 			// luego el TOT de la plaza
	// 			if (totPlaza) out.push({ ...totPlaza, _level: 'plaza' })
	// 		}

	// 		// FINALMENTE la fila de la REGIÓN (después de su contenido)
	// 		out.push(regionRow)
	// 	}

	// 	// TOTAL global al final
	// 	const total = rows.find((r) => r.Tienda === 'TOTAL')
	// 	if (total) out.push({ ...total, _level: 'grand' })

	// 	return out
	// }, [rows])

	// -------- helpers para construir la tabla visual (con totales y % recalculados) --------
	const makeFlat = useCallback((src, currentValues) => {
		if (!src?.length) return []

		// total del conjunto (solo tiendas; sin "TOTAL" ni "TOT plaza" para no duplicar)
		const isTotPlaza = (r) => /^TOT\s+/i.test(String(r.Tienda || ''))
		const isTotal = (r) => String(r.Tienda || '') === 'TOTAL'
		const tiendas = src.filter((r) => !isTotPlaza(r) && !isTotal(r))
		const sum = (arr, f) => arr.reduce((a, b) => a + Number(b[f] || 0), 0)
		const totalGlobal = sum(tiendas, 'Venta')

		// regiones en orden
		const regiones = Array.from(new Set(src.map((r) => String(r.Region || 'SIN REGION')))).sort(
			(a, b) => regionIndex(a) - regionIndex(b)
		)

		const out = []
		for (const region of regiones) {
			const deRegion = src.filter((r) => String(r.Region || 'SIN REGION') === region && r.Tienda !== 'TOTAL')
			const soloTiendas = deRegion.filter((r) => !/^TOT\s+/i.test(String(r.Tienda || '')))
			const regSum = (f) => sum(soloTiendas, f)

			// plazas en orden
			const plazasReg = Array.from(new Set(deRegion.map((r) => r.Plaza))).sort((a, b) => plazaIndex(a) - plazaIndex(b))

			for (const plaza of plazasReg) {
				const pack = deRegion.filter((r) => r.Plaza === plaza)
				const totPlaza = pack.find((r) => /^TOT\s+/i.test(String(r.Tienda || '')))
				const tiendasPlaza = pack.filter((r) => !/^TOT\s+/i.test(String(r.Tienda || '')))
				// ordenar tiendas (misma lógica que tenías)
				tiendasPlaza.sort((a, b) => {
					const la = String(a.Tienda || '')
					const lb = String(b.Tienda || '')
					if (String(a.Plaza).toUpperCase() === 'CANCUN' || String(b.Plaza).toUpperCase() === 'CANCUN') {
						const special = (s) => {
							const u = s.toUpperCase()
							if (u.startsWith('IS-5')) return 998
							if (u.startsWith('OUTLET MCD')) return 999
							if (u.startsWith('FORUM')) return 1000
							return null
						}
						const sa = special(la)
						const sb = special(lb)
						if (sa !== null || sb !== null) return (sa ?? 0) - (sb ?? 0)
					}
					const ns = (s) => {
						const rev = `${s}`.split('').reverse().join('')
						const cut = rev.search(/[^0-9]/)
						if (cut <= 0) return null
						const digits = rev.slice(0, cut).split('').reverse().join('')
						const n = parseInt(digits, 10)
						return Number.isFinite(n) ? n : null
					}
					const na = ns(la)
					const nb = ns(lb)
					if (na === null && nb === null) return la.localeCompare(lb)
					if (na === null) return 1
					if (nb === null) return -1
					return na - nb
				})

				// tiendas (recalcula % vs total del conjunto)
				for (const t of tiendasPlaza) {
					out.push({
						...t,
						_level: 'store',
						PartVenta: totalGlobal ? Number(t.Venta || 0) / totalGlobal : 0
					})
				}
				// TOT plaza al final de la plaza
				if (totPlaza) {
					out.push({
						...totPlaza,
						_level: 'plaza',
						PartVenta: totalGlobal ? Number(totPlaza.Venta || 0) / totalGlobal : 0
					})
				}
			}

			// fila de región al final de su bloque
			const regVenta = regSum('Venta')
			out.push({
				_level: 'region',
				Region: region,
				Plaza: null,
				Tienda: region,
				Venta: regVenta,
				PartVenta: totalGlobal ? regVenta / totalGlobal : 0,
				VentaLinea: regSum('VentaLinea'),
				PartVentaLinea: regVenta ? regSum('VentaLinea') / regVenta : 0,
				VentaModa: regSum('VentaModa'),
				PartVentaModa: regVenta ? regSum('VentaModa') / regVenta : 0,
				VentaAccesorio: regSum('VentaAccesorio'),
				PartVentaAcc: regVenta ? regSum('VentaAccesorio') / regVenta : 0,
				VentaFrogs: regSum('VentaFrogs'),
				PartVentaFrogs: regVenta ? regSum('VentaFrogs') / regVenta : 0,
				VentaMika: regSum('VentaMika'),
				PartMika: regVenta ? regSum('VentaMika') / regVenta : 0
			})
		}

		// TOTAL del conjunto
		const g = {
			_level: 'grand',
			Tienda: 'TOTAL',
			Plaza: null,
			Region: null,
			Venta: totalGlobal,
			PartVenta: totalGlobal ? 1 : 0,
			VentaLinea: sum(tiendas, 'VentaLinea'),
			PartVentaLinea: totalGlobal ? sum(tiendas, 'VentaLinea') / totalGlobal : 0,
			VentaModa: sum(tiendas, 'VentaModa'),
			PartVentaModa: totalGlobal ? sum(tiendas, 'VentaModa') / totalGlobal : 0,
			VentaAccesorio: sum(tiendas, 'VentaAccesorio'),
			PartVentaAcc: totalGlobal ? sum(tiendas, 'VentaAccesorio') / totalGlobal : 0,
			VentaFrogs: sum(tiendas, 'VentaFrogs'),
			PartVentaFrogs: totalGlobal ? sum(tiendas, 'VentaFrogs') / totalGlobal : 0,
			VentaMika: sum(tiendas, 'VentaMika'),
			PartMika: totalGlobal ? sum(tiendas, 'VentaMika') / totalGlobal : 0
		}
		out.push(g)
		return out
	}, [])

	// split: normal vs WEB (si existe)
	const hasWeb = useMemo(() => rows.some((r) => String(r.Region || r.Plaza || '').toUpperCase() === 'WEB'), [rows])

	const flatMain = useMemo(
		() => makeFlat(rows.filter((r) => String(r.Region || r.Plaza || '').toUpperCase() !== 'WEB')),
		[rows, makeFlat]
	)
	const flatWeb = useMemo(
		() => (hasWeb ? makeFlat(rows.filter((r) => String(r.Region || r.Plaza || '').toUpperCase() === 'WEB')) : []),
		[rows, hasWeb, makeFlat]
	)

	// objeto que consume <Table /> para renderizar 1 o 2 tablas
	const tablesData = useMemo(
		() => (hasWeb ? { ventadetalle: flatMain, ventadetalle_web: flatWeb } : { ventadetalle: flatMain }),
		[hasWeb, flatMain, flatWeb]
	)

	const title = range.isAcum
		? `VENTA TIENDAS CON DETALLADO POR SEGMENTO & MARCA (ACUMULADO ${dateHelper.getCurrentYear(range.fin)})`
		: `VENTA TIENDAS CON DETALLADO POR SEGMENTO & MARCA (${dateHelper.getCurrentDate(range.ini)} ${dateHelper
				.getMonthName(range.ini)
				.toUpperCase()} ${dateHelper.getCurrentYear(range.ini)} - ${dateHelper.getCurrentDate(range.fin)} ${dateHelper
				.getMonthName(range.fin)
				.toUpperCase()} ${dateHelper.getCurrentYear(range.fin)})`

	// exportación rápida (misma estructura visual)
	// exportación a Excel (con título, periodo, estilos y filtros)
	const handleExport = async () => {
		try {
			const allRowsForExport = Object.values(tablesData).flat()
			if (!allRowsForExport.length) {
				sendNotification({ type: 'ERROR', message: 'No hay datos para exportar.' })
				return
			}

			const { Workbook } = await import('exceljs')
			const wb = new Workbook()
			const ws = wb.addWorksheet('VENTA DETALLADA')

			// ---------- Título y periodo ----------
			const titulo = range.isAcum
				? `VENTA TIENDAS CON DETALLADO POR SEGMENTO & MARCA (ACUMULADO ${dateHelper.getCurrentYear(range.fin)})`
				: 'VENTA TIENDAS CON DETALLADO POR SEGMENTO & MARCA'

			const periodo = range.isAcum
				? `Acumulado al ${dateHelper.getCurrentDate(range.fin)} ${dateHelper.getMonthName(range.fin)} ${dateHelper.getCurrentYear(range.fin)}`
				: `Datos del ${dateHelper.getCurrentDate(range.ini)} ${dateHelper.getMonthName(range.ini)} ${dateHelper.getCurrentYear(range.ini)} al ${dateHelper.getCurrentDate(range.fin)} ${dateHelper.getMonthName(range.fin)} ${dateHelper.getCurrentYear(range.fin)}`

			ws.mergeCells('A3:A4')
			ws.getCell('A3').value = 'TIENDA'

			// En web NO hay grupo "VENTA", son dos columnas sueltas:
			ws.mergeCells('B3:B4')
			ws.getCell('B3').value = 'Venta ($)'
			ws.mergeCells('C3:C4')
			ws.getCell('C3').value = '% PART. VS. VTA. TOT.'

			// Grupos iguales a la tabla web:
			ws.mergeCells('D3:I3')
			ws.getCell('D3').value = 'VENTA POR SEGMENTO & PORC.PARTICIPACION POR ENTIDAD'
			ws.getCell('D4').value = 'Línea ($)'
			ws.getCell('E4').value = '% L'
			ws.getCell('F4').value = 'Moda ($)'
			ws.getCell('G4').value = '% M'
			ws.getCell('H4').value = 'Accesorio ($)'
			ws.getCell('I4').value = '% A'

			ws.mergeCells('J3:M3')
			ws.getCell('J3').value = 'VENTA POR MARCA & PORC. PARTICIPACION'
			ws.getCell('J4').value = 'Frogs ($)'
			ws.getCell('K4').value = '% SF'
			ws.getCell('L4').value = 'Mika ($)'
			ws.getCell('M4').value = '% MK'

			// Formato del header
			const thinWhite = { style: 'thin', color: { argb: 'FFFFFFFF' } }
			const blackFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '000000' } }
			const blueFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E3A8A' } }
			const greenFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '064E3B' } }

			for (const r of [3, 4]) {
				const row = ws.getRow(r)
				row.height = 25
				row.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
				row.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
				row.eachCell({ includeEmpty: true }, (c) => {
					const col = c.col
					if (col >= 4 && col <= 9) c.fill = blueFill
					else if (col >= 10 && col <= 13) c.fill = greenFill
					else c.fill = blackFill
					c.border = { top: thinWhite, left: thinWhite, bottom: thinWhite, right: thinWhite }
				})
			}

			// Columnas (ancho + formato)
			ws.columns = [
				{ key: 'label', width: 28 },
				{ key: 'Venta', width: 15, style: { numFmt: '$#,##0.00' } },
				{ key: 'PartVenta', width: 12, style: { numFmt: '0.0%' } },
				{ key: 'VentaLinea', width: 15, style: { numFmt: '$#,##0.00' } },
				{ key: 'PartVentaLinea', width: 9, style: { numFmt: '0.0%' } },
				{ key: 'VentaModa', width: 15, style: { numFmt: '$#,##0.00' } },
				{ key: 'PartVentaModa', width: 9, style: { numFmt: '0.0%' } },
				{ key: 'VentaAccesorio', width: 15, style: { numFmt: '$#,##0.00' } },
				{ key: 'PartVentaAcc', width: 9, style: { numFmt: '0.0%' } },
				{ key: 'VentaFrogs', width: 15, style: { numFmt: '$#,##0.00' } },
				{ key: 'PartVentaFrogs', width: 9, style: { numFmt: '0.0%' } },
				{ key: 'VentaMika', width: 15, style: { numFmt: '$#,##0.00' } },
				{ key: 'PartMika', width: 9, style: { numFmt: '0.0%' } }
			]

			// ---------- Datos ----------
			const startRow = 5
			const toExport = allRowsForExport.filter(
				(r) => !(r._level === 'region' && String(r.Region || '').toUpperCase() === 'SIN REGION')
			)

			toExport.forEach((r) => {
				const row = ws.addRow({
					label: displayLabel(r),
					Venta: +r.Venta || 0,
					PartVenta: +r.PartVenta || 0,
					VentaLinea: +r.VentaLinea || 0,
					PartVentaLinea: +r.PartVentaLinea || 0,
					VentaModa: +r.VentaModa || 0,
					PartVentaModa: +r.PartVentaModa || 0,
					VentaAccesorio: +r.VentaAccesorio || 0,
					PartVentaAcc: +r.PartVentaAcc || 0,
					VentaFrogs: +r.VentaFrogs || 0,
					PartVentaFrogs: +r.PartVentaFrogs || 0,
					VentaMika: +r.VentaMika || 0,
					PartMika: +r.PartMika || 0
				})

				// Estilos por nivel
				const lvl =
					r._level || (r.Tienda === 'TOTAL' ? 'grand' : /^TOT\s+/i.test(String(r.Tienda || '')) ? 'plaza' : 'store')

				if (lvl === 'grand') {
					row.font = { bold: true, color: { argb: 'FFFFFFFF' } }
					row.eachCell((c) => (c.fill = blackFill))
				} else if (lvl === 'region') {
					row.font = { bold: true }
					row.eachCell((c) => (c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '9CA3AF' } }))
				} else if (lvl === 'plaza') {
					row.font = { bold: true }
					row.eachCell((c) => (c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D1D5DB' } }))
				} else if (lvl === 'store') {
					// Tintes de color para segmentos y marcas
					row.eachCell((c) => {
						const col = c.col
						if (col >= 4 && col <= 9) {
							c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9EFFF' } }
						} else if (col >= 10 && col <= 13) {
							c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E6FFED' } }
						}
					})
				}
			})

			// Bordes finos para el bloque de datos
			const lastRow = ws.lastRow.number
			for (let r = startRow; r <= lastRow; r++) {
				ws.getRow(r).eachCell((c) => {
					c.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					}
					if (c.col === 1) c.alignment = { horizontal: 'left' }
					else c.alignment = { horizontal: 'right' }
				})
			}

			const noteRow = ws.lastRow.number + 2
			ws.mergeCells(`A${noteRow}:M${noteRow}`)
			// ws.getCell(`A${noteRow}`).value = 'Las ventas en línea son reportadas por fecha de facturación.'
			ws.getCell(`A${noteRow}`).font = { italic: true, color: { argb: '555555' } }
			ws.getCell(`A${noteRow}`).alignment = { horizontal: 'center' }

			// Congelar encabezado / Autofiltro
			ws.views = [{ state: 'frozen', xSplit: 1, ySplit: 4 }]
			ws.autoFilter = { from: 'A4', to: 'M4' }

			// ---------- Descargar ----------
			const prefix = range.isAcum ? 'ACUMULADO_' : 'Venta_Tiendas_'
			const fn = `${prefix}${range.ini}_a_${range.fin}.xlsx`
			const buf = await wb.xlsx.writeBuffer()
			const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = fn
			a.click()
			URL.revokeObjectURL(url)
		} catch (err) {
			sendNotification({ type: 'ERROR', message: err?.message || 'No se pudo exportar.' })
		}
	}

	return (
		<div className="flex flex-col h-full">
			<TitleReport title={title} />

			{/* Parámetros */}
			<section className="p-4 space-y-2">
				<div className="flex justify-between items-start">
					<ParametersContainer>
						<Parameters>
							<Formik initialValues={initialParams} onSubmit={handleSubmit} enableReinitialize>
								{({ isSubmitting, values }) => (
									<Form>
										<fieldset className="space-y-2 mb-[14rem]">
											{!values.verAcumulado && (
												<Input
													type="date"
													id="fechaIni"
													name="fechaIni"
													label="Fecha inicial"
													placeholder={range.ini}
													disabled={loading}
												/>
											)}
											<Input
												type="date"
												id="fechaFin"
												name="fechaFin"
												label={values.verAcumulado ? 'Fecha (al)' : 'Fecha final'}
												placeholder={range.fin}
												disabled={loading}
											/>
											<Checkbox id="verAcumulado" name="verAcumulado" label="Ver Acumulado Anual" disabled={loading} />
											<Checkbox
												id="conVentasEventos"
												name="conVentasEventos"
												label="Incluir ventas de eventos"
												disabled={loading}
											/>
											<Checkbox
												id="conVentasEnLinea"
												name="conVentasEnLinea"
												label="Incluir venta en línea"
												disabled={loading}
											/>
										</fieldset>

										<button
											type="submit"
											disabled={loading || isSubmitting}
											className={`w-full mt-2 px-4 py-2 rounded-md text-white ${
												loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-500'
											}`}
										>
											{loading ? 'Buscando…' : 'Buscar'}
										</button>
									</Form>
								)}
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
					<ExcelButton handleClick={handleExport} />
				</div>
			</section>

			{/* Subtítulo centrado */}
			<h2 className="text-center text-base md:text-base font-bold text-black-mt-2">
				{range.isAcum
					? `Acumulado al ${dateHelper.getCurrentDate(range.fin)} ${dateHelper.getMonthName(range.fin)} ${dateHelper.getCurrentYear(range.fin)}`
					: `Datos del 
          ${dateHelper.getCurrentDate(range.ini)} ${dateHelper.getMonthName(range.ini)} ${dateHelper.getCurrentYear(range.ini)}
          al 
          ${dateHelper.getCurrentDate(range.fin)} ${dateHelper.getMonthName(range.fin)} ${dateHelper.getCurrentYear(range.fin)}
        `}
			</h2>

			<section className="p-4 overflow-y-auto ">
				{loading && (
					<div className="rounded-xl border p-10 bg-white h-[380px] flex items-center justify-center">
						<div className="flex flex-col items-center">
							<svg className="animate-spin h-12 w-12 text-black" viewBox="0 0 24 24">
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
									fill="none"
								/>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
							</svg>
							<p className="mt-3 text-black font-medium">Cargando datos…</p>
						</div>
					</div>
				)}

				{!loading && rows.length > 0 && (
					<div className=" overflow-y-auto">
						{(() => {
							switch (displayMode) {
								case 1:
									return <Table data={tablesData} />
								case 2:
									return <Stat data={tablesData} />
								case 3:
									return <StatGroup data={tablesData} region={currentRegion} />
								case 4:
									return <TableMovil data={tablesData} />
								default:
									return <Table data={tablesData} />
							}
						})()}
					</div>
				)}

				{!loading && rows.length === 0 && (
					<div className="rounded-xl border p-10 bg-white text-gray-500 flex items-center justify-center h-[380px]">
						Sin datos para los filtros seleccionados.
					</div>
				)}
			</section>
		</div>
	)
}

const Table = (props) => {
	let { data } = props
	if (Array.isArray(data)) {
		data = { ventadetalle: data }
	} else if (typeof data !== 'object' || data === null) {
		data = {}
	}

	return (
		<div className="space-y-8">
			{data &&
				Object.entries(data).map(([key, values]) => (
					<React.Fragment key={v4()}>
						{getTableName(key)}
						<table className="table-report" key={v4()} onClick={selectRow}>
							<thead>
								<tr className="text-center">
									<th rowSpan={2}>Tienda</th>
									<th rowSpan={2}>Venta ($)</th>
									<th rowSpan={2} className="w-20 whitespace-nowrap">
										% PART. VS. VTA. TOT.
									</th>
									<th colSpan={6} className="!bg-blue-900 text-white">
										VENTA POR SEGMENTO & PORC.PARTICIPACION POR ENTIDAD
									</th>
									<th colSpan={4} className="!bg-green-800 text-white">
										VENTA POR MARCA & PORC. PARTICIPACION
									</th>
								</tr>
								<tr className="text-center">
									<th className="!bg-blue-900 text-white">Línea ($)</th>
									<th className="!bg-blue-900 text-white">% L</th>
									<th className="!bg-blue-900 text-white">Moda ($)</th>
									<th className="!bg-blue-900 text-white">% M</th>
									<th className="!bg-blue-900 text-white">Accesorio ($)</th>
									<th className="!bg-blue-900 text-white">% A</th>
									<th className="!bg-green-800 text-white">Frogs ($)</th>
									<th className="!bg-green-800 text-white">% SF</th>
									<th className="!bg-green-800 text-white">Mika ($)</th>
									<th className="!bg-green-800 text-white">% MK</th>
								</tr>
							</thead>
							<tbody>
								{(Array.isArray(values) ? values : [])
									.filter((r) => !(r._level === 'region' && String(r.Region || '').toUpperCase() === 'SIN REGION'))
									.map((r, idx) => {
										const level =
											r._level ||
											(r.Tienda === 'TOTAL' ? 'grand' : /^TOT\s+/i.test(String(r.Tienda || '')) ? 'plaza' : 'store')

										// Colores tipo la 2da imagen (texto negro)
										const rowClass =
											level === 'grand'
												? 'bg-black font-bold text-white' // TOTAL final en negro
												: level === 'region'
													? 'bg-gray-400 font-bold' // REGIÓN
													: level === 'plaza'
														? 'bg-gray-300 font-bold' // PLAZA (TOT ...)
														: '' // Tienda

										// Clases para las celdas de la sección "Segmento"
										const segmentCellClass =
											level === 'grand'
												? '!bg-blue-900 text-white' // Total final: Azul fuerte
												: level === 'store'
													? 'bg-blue-200/60' // Tiendas: Azul más notable
													: '' // Otros (Región/Plaza): Sin fondo especial para no sobrecargar

										// Clases para las celdas de la sección "Marca"
										const brandCellClass =
											level === 'grand'
												? '!bg-green-800 text-white' // Total final: Verde fuerte
												: level === 'store'
													? 'bg-green-200/60' // Tiendas: Verde más notable
													: ''

										const label =
											r.Tienda === 'TOTAL'
												? 'TOTAL'
												: /^TOT\s+/i.test(String(r.Tienda || ''))
													? String(r.Plaza || '').toUpperCase()
													: r.Tienda || r.Region || ''

										return (
											<tr key={idx} className={rowClass} data-row-format={level}>
												{/* 1a columna: izquierda */}
												<td className="text-left">{label}</td>

												{/* demás columnas: derecha */}
												<td className="text-right">{numberWithCommas(r.Venta)}</td>
												<td className={`text-right w-20 whitespace-nowrap`}>{pct(r.PartVenta)}</td>

												<td className={`text-right ${segmentCellClass}`}>{numberWithCommas(r.VentaLinea)}</td>
												<td className={`text-right ${segmentCellClass}`}>{pct(r.PartVentaLinea)}</td>

												<td className={`text-right ${segmentCellClass}`}>{numberWithCommas(r.VentaModa)}</td>
												<td className={`text-right ${segmentCellClass}`}>{pct(r.PartVentaModa)}</td>

												<td className={`text-right ${segmentCellClass}`}>{numberWithCommas(r.VentaAccesorio)}</td>
												<td className={`text-right ${segmentCellClass}`}>{pct(r.PartVentaAcc)}</td>

												<td className={`text-right ${brandCellClass}`}>{numberWithCommas(r.VentaFrogs)}</td>
												<td className={`text-right ${brandCellClass}`}>{pct(r.PartVentaFrogs)}</td>

												<td className={`text-right ${brandCellClass}`}>{numberWithCommas(r.VentaMika)}</td>
												<td className={`text-right ${brandCellClass}`}>{pct(r.PartMika)}</td>
											</tr>
										)
									})}
							</tbody>
						</table>
					</React.Fragment>
				))}

			{/* Mensaje general debajo de las tablas */}
			{/* <div className="mt-3 mb-6">
				<p className="text-xs italic text-slate-600 text-center">
					Las ventas en línea son reportadas por fecha de facturación.
				</p>
			</div> */}
		</div>
	)
}

const Stat = ({ data }) => {
	// Normalizar la entrada: objeto { ventadetalle: [...] } o arreglo [...]
	let list = []
	if (Array.isArray(data)) {
		list = data
	} else if (data && typeof data === 'object') {
		list = Array.isArray(data.ventadetalle)
			? data.ventadetalle
			: Array.isArray(Object.values(data)[0])
				? Object.values(data)[0]
				: []
	}

	const etiqueta = (r) => {
		if (r.Tienda === 'TOTAL') return 'TOTAL'
		if (/^TOT\s+/i.test(String(r.Tienda || ''))) return String(r.Plaza || '').toUpperCase()
		return r.Tienda || r.Region || ''
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
			{list
				.filter((r) => !(r._level === 'region' && String(r.Region || '').toUpperCase() === 'SIN REGION'))
				.map((r, i) => {
					const colVenta = {
						columnTitle: 'VENTA',
						values: [
							{ caption: 'Venta ($)', value: numberWithCommas(r.Venta) },
							{ caption: '% vs. Vta. Tot.', value: pct(r.PartVenta) }
						]
					}

					const colSegmento = {
						columnTitle: 'SEGMENTO',
						values: [
							{ caption: 'Línea ($)', value: numberWithCommas(r.VentaLinea) },
							{ caption: '% L', value: pct(r.PartVentaLinea) },
							{ caption: 'Moda ($)', value: numberWithCommas(r.VentaModa) },
							{ caption: '% M', value: pct(r.PartVentaModa) },
							{ caption: 'Accesorio ($)', value: numberWithCommas(r.VentaAccesorio) },
							{ caption: '% A', value: pct(r.PartVentaAcc) }
						]
					}

					const colMarca = {
						columnTitle: 'MARCA',
						values: [
							{ caption: 'Frogs ($)', value: numberWithCommas(r.VentaFrogs) },
							{ caption: '% SF', value: pct(r.PartVentaFrogs) },
							{ caption: 'Mika ($)', value: numberWithCommas(r.VentaMika) },
							{ caption: '% MK', value: pct(r.PartMika) }
						]
					}

					return (
						<Stats
							key={`${etiqueta(r)}-${i}`}
							title={etiqueta(r)}
							expand={false}
							columns={[colVenta, colSegmento, colMarca]}
						/>
					)
				})}

			{/* Mensaje general debajo de las tarjetas */}
			{/* <div className="mt-3 mb-6 col-span-full">
				<p className="text-xs italic text-slate-600 text-center">
					Las ventas en línea son reportadas por fecha de facturación.
				</p>
			</div> */}
		</div>
	)
}

const StatGroup = ({ data, region = 'TOTAL' }) => {
	// Normalizar entrada: puede venir como arreglo o como { ventadetalle: [...] }
	let list = []
	if (Array.isArray(data)) {
		list = data
	} else if (data && typeof data === 'object') {
		list = Array.isArray(data.ventadetalle)
			? data.ventadetalle
			: Array.isArray(Object.values(data)[0])
				? Object.values(data)[0]
				: []
	}

	// Etiqueta igual que la tabla (REGIÓN / TOT PLAZA / TIENDA / TOTAL)
	const label = (r) => {
		if (r.Tienda === 'TOTAL') return 'TOTAL'
		if (/^TOT\s+/i.test(String(r.Tienda || ''))) return String(r.Plaza || '').toUpperCase()
		return r.Tienda || r.Region || ''
	}

	// Filtrar “SIN REGION” en caso de que exista como fila sintética
	const notSinRegion = (r) => !(r._level === 'region' && String(r.Region || '').toUpperCase() === 'SIN REGION')

	// Elegir columnas según la región seleccionada
	let colsSource = []
	if (region === 'TOTAL') {
		const regions = list.filter((r) => r._level === 'region').filter(notSinRegion)
		const total = list.find((r) => r.Tienda === 'TOTAL')
		colsSource = [...regions, ...(total ? [total] : [])]
	} else {
		colsSource = list
			.filter((r) => String(r.Region || '') === region)
			.filter((r) => r.Tienda !== 'TOTAL' && r._level !== 'region') // solo tiendas y TOT plaza
	}

	// Construir columnas para cada bloque
	const ventaCols = colsSource.map((r) => ({
		columnTitle: label(r),
		values: [
			{ caption: 'Venta ($)', value: numberWithCommas(r.Venta) },
			{ caption: '% vs. Vta. Tot.', value: pct(r.PartVenta) }
		]
	}))

	const segmentoCols = colsSource.map((r) => ({
		columnTitle: label(r),
		values: [
			{ caption: 'Línea ($)', value: numberWithCommas(r.VentaLinea) },
			{ caption: '% L', value: pct(r.PartVentaLinea) },
			{ caption: 'Moda ($)', value: numberWithCommas(r.VentaModa) },
			{ caption: '% M', value: pct(r.PartVentaModa) },
			{ caption: 'Accesorio ($)', value: numberWithCommas(r.VentaAccesorio) },
			{ caption: '% A', value: pct(r.PartVentaAcc) }
		]
	}))

	const marcaCols = colsSource.map((r) => ({
		columnTitle: label(r),
		values: [
			{ caption: 'Frogs ($)', value: numberWithCommas(r.VentaFrogs) },
			{ caption: '% SF', value: pct(r.PartVentaFrogs) },
			{ caption: 'Mika ($)', value: numberWithCommas(r.VentaMika) },
			{ caption: '% MK', value: pct(r.PartMika) }
		]
	}))

	// Si no hay columnas, no renderizamos nada “raro”
	if (!ventaCols.length) return <></>

	return (
		<div className="grid grid-cols-1 gap-4">
			<Stats title={`VENTA — ${region}`} columns={ventaCols} expand={false} />
			<Stats title="SEGMENTO" columns={segmentoCols} expand={false} />
			<Stats title="MARCA" columns={marcaCols} expand={false} />

			{/* Mensaje general debajo de las tarjetas */}
			{/* <div className="mt-3 mb-6">
				<p className="text-xs italic text-slate-600 text-center">
					Las ventas en línea son reportadas por fecha de facturación.
				</p>
			</div> */}
		</div>
	)
}

// --- Mobile table for Venta Detalle (VENTA / SEGMENTO / MARCA) ---
const TableMovil = ({ data }) => {
	// Normalizar entrada: { ventadetalle: [...] } o arreglo [...]
	let list = []
	if (Array.isArray(data)) {
		list = data
	} else if (data && typeof data === 'object') {
		list = Array.isArray(data.ventadetalle)
			? data.ventadetalle
			: Array.isArray(Object.values(data)[0])
				? Object.values(data)[0]
				: []
	}

	// Ocultar fila sintética "SIN REGION"
	const rows = (list || []).filter(
		(r) => !(r._level === 'region' && String(r.Region || '').toUpperCase() === 'SIN REGION')
	)

	const label = (r) => {
		if (r.Tienda === 'TOTAL') return 'TOTAL'
		if (/^TOT\s+/i.test(String(r.Tienda || ''))) return String(r.Plaza || '').toUpperCase()
		return r.Tienda || r.Region || ''
	}

	const levelOf = (r) =>
		r._level || (r.Tienda === 'TOTAL' ? 'grand' : /^TOT\s+/i.test(String(r.Tienda || '')) ? 'plaza' : 'store')

	// Clases al estilo de la segunda imagen (grises, texto negro)
	const rowClassOf = (level) =>
		level === 'grand'
			? 'bg-gray-400 font-bold text-black'
			: level === 'region'
				? 'bg-gray-300 font-semibold text-black'
				: level === 'plaza'
					? 'bg-gray-200 font-medium text-black'
					: ''

	// Render helpers (una fila para un r y un set de celdas)
	const RowVenta = (r, i) => {
		const lvl = levelOf(r)
		return (
			<tr key={`v-${i}`} className={rowClassOf(lvl)} data-row-format={lvl}>
				<td className="priority-cell text-left">{label(r)}</td>
				<td className="text-right">{numberWithCommas(r.Venta)}</td>
				<td className="text-right">{pct(r.PartVenta)}</td>
			</tr>
		)
	}

	const RowSegmento = (r, i) => {
		const lvl = levelOf(r)
		return (
			<tr key={`s-${i}`} className={rowClassOf(lvl)} data-row-format={lvl}>
				<td className="priority-cell text-left">{label(r)}</td>
				<td className="text-right">{numberWithCommas(r.VentaLinea)}</td>
				<td className="text-right">{pct(r.PartVentaLinea)}</td>
				<td className="text-right">{numberWithCommas(r.VentaModa)}</td>
				<td className="text-right">{pct(r.PartVentaModa)}</td>
				<td className="text-right">{numberWithCommas(r.VentaAccesorio)}</td>
				<td className="text-right">{pct(r.PartVentaAcc)}</td>
			</tr>
		)
	}

	const RowMarca = (r, i) => {
		const lvl = levelOf(r)
		return (
			<tr key={`m-${i}`} className={rowClassOf(lvl)} data-row-format={lvl}>
				<td className="priority-cell text-left">{label(r)}</td>
				<td className="text-right">{numberWithCommas(r.VentaFrogs)}</td>
				<td className="text-right">{pct(r.PartVentaFrogs)}</td>
				<td className="text-right">{numberWithCommas(r.VentaMika)}</td>
				<td className="text-right">{pct(r.PartMika)}</td>
			</tr>
		)
	}

	if (!rows.length) return <></>

	return (
		<div className="space-y-8">
			{/* VENTA */}
			<table className="table-report-mobile" onClick={selectRow}>
				<caption>VENTA</caption>
				<thead>
					<tr>
						<th>Tienda</th>
						<th>Venta ($)</th>
						<th>% PART. VS. VTA. TOT.</th>
					</tr>
				</thead>
				<tbody>{rows.map(RowVenta)}</tbody>
			</table>

			{/* SEGMENTO */}
			<table className="table-report-mobile" onClick={selectRow}>
				<caption>VENTA POR SEGMENTO &amp; PORC. PARTICIPACIÓN POR ENTIDAD</caption>
				<thead>
					<tr>
						<th>Tienda</th>
						<th>Línea ($)</th>
						<th>% L</th>
						<th>Moda ($)</th>
						<th>% M</th>
						<th>Accesorio ($)</th>
						<th>% A</th>
					</tr>
				</thead>
				<tbody>{rows.map(RowSegmento)}</tbody>
			</table>

			{/* MARCA */}
			<table className="table-report-mobile" onClick={selectRow}>
				<caption>VENTA POR MARCA &amp; PORC. PARTICIPACIÓN</caption>
				<thead>
					<tr>
						<th>Tienda</th>
						<th>Frogs ($)</th>
						<th>% SF</th>
						<th>Mika ($)</th>
						<th>% MK</th>
					</tr>
				</thead>
				<tbody>{rows.map(RowMarca)}</tbody>
			</table>

			{/* Mensaje final */}
			{/* <div className="mt-3 mb-6">
				<p className="text-xs italic text-slate-600 text-center">
					Las ventas en línea son reportadas por fecha de facturación.
				</p>
			</div> */}
		</div>
	)
}

const PageWithAuth = withAuth(VentaDetNivelTienda)
PageWithAuth.getLayout = getVentasLayout
export default PageWithAuth

