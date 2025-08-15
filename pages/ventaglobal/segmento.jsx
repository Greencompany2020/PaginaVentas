// pages/reportes/Segmento.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Formik, Form } from 'formik'

import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
	Title as ChartTitle
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

import withAuth from '../../components/withAuth'
import { getVentasLayout } from '../../components/layout/VentasLayout'
import TitleReport from '../../components/TitleReport'
import { useNotification } from '../../components/notifications/NotificationsProvider'
import { numberWithCommas } from '../../utils/resultsFormated'

import { ParametersContainer, Parameters } from '../../components/containers'
import { Input, Checkbox } from '../../components/reportInputs'
import { isMobile } from 'react-device-detect'
import ExcelButton from '../../components/buttons/ExcelButton'

import { spliteArrDate, isSecondDateBlock } from '../../utils/functions'
import { getVentaGlobalSegmento } from '../../services/VentaGlobalService'
import { checkboxLabels, comboValues } from '../../utils/data'
import DateHelper from '../../utils/dateHelper'

/** Plugin: pinta % y monto dentro de cada porción */
const DoughnutSmartLabels = {
	id: 'doughnutSmartLabels',
	afterDatasetsDraw(chart, _args, opts) {
		const { ctx, data, chartArea } = chart
		const ds = data.datasets?.[0]
		if (!ds) return

		const meta = chart.getDatasetMeta(0)
		const total = (ds.data || []).reduce((a, b) => a + (Number(b) || 0), 0)
		if (!total) return

		const amounts = opts?.amounts || []
		const money = opts?.money || ((n) => `${n}`)
		const gap = opts?.gap ?? 16 // px entre etiquetas
		const clampY = (y) => Math.min(chartArea.bottom - 8, Math.max(chartArea.top + 8, y))

		const left = [],
			right = []

		meta.data.forEach((arc, i) => {
			const val = Number(ds.data[i]) || 0
			if (val <= 0) return

			const ang = (arc.startAngle + arc.endAngle) / 2
			const cos = Math.cos(ang),
				sin = Math.sin(ang)
			const side = cos >= 0 ? 'right' : 'left'

			const rOut = arc.outerRadius
			const ax = arc.x + cos * rOut // ancla en el borde
			const ay = arc.y + sin * rOut
			const lx = arc.x + cos * (rOut + 24) // posición de etiqueta fuera
			const ly = arc.y + sin * (rOut + 24)

			const pct = (val / total) * 100
			const text = `${pct.toFixed(0)}% — ${money(Number(amounts[i]) || 0)}`
			const item = { text, anchorX: ax, anchorY: ay, labelX: lx, labelY: ly, side }
			;(side === 'right' ? right : left).push(item)
		})

		// separa verticalmente para evitar solapes
		const resolve = (list) => {
			list.sort((a, b) => a.labelY - b.labelY)
			for (let i = 1; i < list.length; i++) {
				if (list[i].labelY - list[i - 1].labelY < gap) {
					list[i].labelY = list[i - 1].labelY + gap
				}
			}
			list.forEach((p) => (p.labelY = clampY(p.labelY)))
		}
		resolve(left)
		resolve(right)

		// dibuja líneas y texto
		ctx.save()
		ctx.font = '600 12px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'
		ctx.fillStyle = '#111827'
		ctx.strokeStyle = opts?.lineColor || '#9CA3AF'
		ctx.lineWidth = opts?.lineWidth || 1

		const drawItem = (p) => {
			const elbowX = p.side === 'right' ? p.labelX - 8 : p.labelX + 8
			ctx.beginPath()
			ctx.moveTo(p.anchorX, p.anchorY)
			ctx.lineTo(elbowX, p.labelY)
			ctx.lineTo(p.labelX, p.labelY)
			ctx.stroke()

			ctx.textAlign = p.side === 'right' ? 'left' : 'right'
			ctx.textBaseline = 'middle'
			ctx.fillText(p.text, p.labelX, p.labelY)
		}
		left.forEach(drawItem)
		right.forEach(drawItem)
		ctx.restore()
	}
}

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ChartTitle, DoughnutSmartLabels)

// util: fecha a DD-MM-YYYY (acepta 'YYYY-MM-DD' o 'DD/MM/YYYY')
const toDMY = (raw) => {
	if (!raw) return ''
	const s = String(raw)
	if (s.includes('-')) {
		const [a, b, c] = s.split('-')
		if (a.length === 4) return `${c.padStart(2, '0')}-${b.padStart(2, '0')}-${a}` // YYYY-MM-DD -> DD-MM-YYYY
		return `${a.padStart(2, '0')}-${b.padStart(2, '0')}-${c}` // DD-MM-YYYY
	}
	if (s.includes('/')) {
		const [d, m, y] = s.split('/')
		return `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`
	}
	return s
}

function Segmento({ config }) {
	const sendNotification = useNotification()
	const dateHelper = DateHelper()

	const [loading, setLoading] = useState(false)
	const [dataReport, setDataReport] = useState(null)
	const [reportDate, setReportDate] = useState({
		current: dateHelper.getYesterdayDate(),
		dateRange: spliteArrDate(config.agnosComparativos, config?.cbAgnosComparar || 1)
	})
	const [currentRegion] = useState('TOTAL') // placeholder
	const [incremento] = useState('compromiso') // placeholder

	const initialParams = {
		fecha: dateHelper.getYesterdayDate(),
		conVentasEventos: Boolean((config && config.conVentasEventos) || 0)
	}

	// refs de las donas (react-chartjs-2)
	const monthChartRef = useRef(null)
	const yearChartRef = useRef(null)
	// últimos parámetros usados (para hoja Filtros)
	const [lastParams, setLastParams] = useState({
		fecha: initialParams.fecha,
		conVentasEventos: initialParams.conVentasEventos ? 1 : 0
	})

	async function handleSubmit(values) {
		try {
			setLoading(true)
			setDataReport(null) // limpia mientras carga
			setReportDate((prev) => ({ ...prev, current: values.fecha }))

			const payload = {
				fecha: values.fecha,
				conVentasEventos: values.conVentasEventos ? 1 : 0
			}
			const res = await getVentaGlobalSegmento(payload)
			setDataReport(res)
			setLastParams(payload) // para exportar a Excel lo último que buscaste
		} catch (error) {
			sendNotification({
				type: 'ERROR',
				message: error?.response?.data?.message || error?.message || 'Error al cargar el reporte'
			})
		} finally {
			setLoading(false)
		}
	}

	// === Exportar a Excel (tabla + filtros + DONAS en la misma hoja) ===
	const handleExport = async () => {
		try {
			const rows = Array.isArray(dataReport) ? dataReport : []
			if (!rows.length) {
				sendNotification({ type: 'ERROR', message: 'No hay datos para exportar.' })
				return
			}

			// 1) Capturar PNGs de las gráficas
			const takePng = (ref) => {
				const chart = ref?.current
				if (!chart) return null
				if (typeof chart.toBase64Image === 'function') return chart.toBase64Image()
				const canvas = chart.canvas || chart.ctx?.canvas
				return canvas?.toDataURL?.('image/png') || null
			}
			const imgMonth = takePng(monthChartRef)
			const imgYear = takePng(yearChartRef)

			// 2) Workbook y hoja principal
			const { Workbook } = await import('exceljs')
			const wb = new Workbook()
			const ws = wb.addWorksheet('Segmento')

			ws.columns = [
				{ header: 'Segmento', key: 'segmento', width: 24 },
				{ header: 'Venta Mes ($)', key: 'mes', width: 16, style: { numFmt: '$#,##0.00' } },
				{ header: '% Mes', key: 'mes_pct', width: 10, style: { numFmt: '0.0%' } },
				{ header: 'Venta Año ($)', key: 'ano', width: 16, style: { numFmt: '$#,##0.00' } },
				{ header: '% Año', key: 'ano_pct', width: 10, style: { numFmt: '0.0%' } }
			]
			ws.addRows(
				rows.map((r) => ({
					segmento: String(r.ItemClass ?? ''),
					mes: Number(r.MonthSale ?? 0),
					mes_pct: Number(r.MonthParticipation ?? 0),
					ano: Number(r.AnualSale ?? 0),
					ano_pct: Number(r.AnualParticipation ?? 0)
				}))
			)

			const hdr = ws.getRow(1)
			hdr.font = { bold: true, color: { argb: 'FFFFFFFF' } }
			hdr.eachCell((c) => {
				c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } }
			})
			ws.autoFilter = 'A1:E1'
			ws.views = [{ state: 'frozen', ySplit: 1 }]

			// 3) Hoja de filtros con fecha DD-MM-YYYY
			const toDMY = (raw) => {
				if (!raw) return ''
				const s = String(raw)
				if (s.includes('-')) {
					const [a, b, c] = s.split('-')
					return a.length === 4 ? `${c.padStart(2, '0')}-${b.padStart(2, '0')}-${a}` : s
				}
				if (s.includes('/')) {
					const [d, m, y] = s.split('/')
					return `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`
				}
				return s
			}
			const wf = wb.addWorksheet('Filtros')
			wf.columns = [
				{ header: 'Parámetro', key: 'k', width: 28 },
				{ header: 'Valor', key: 'v', width: 32 }
			]
			wf.addRows([
				{ k: 'Fecha', v: toDMY(reportDate.current) },
				{ k: 'Incluir ventas de eventos', v: lastParams.conVentasEventos ? 'Sí' : 'No' }
			])
			wf.getRow(1).font = { bold: true }

			// 4) Insertar DONAS en la MISMA hoja "Segmento", debajo de la tabla
			const startRow = ws.lastRow.number + 3 // un poco de espacio tras la tabla
			const leftCol = 0 // ~columna B (0=A,1=B,...)
			const rightCol = 10 // ~columna K
			const imgW = 750,
				imgH = 350 // tamaño aprox. en px

			const monthTitle = `MENSUAL ${dateHelper.getMonthName(reportDate.current).toUpperCase()} ${dateHelper.getCurrentYear(reportDate.current)}`
			const yearTitle = `ACUMULADO ${dateHelper.getCurrentYear(reportDate.current)}`

			ws.getCell(`B${startRow - 1}`).value = monthTitle
			ws.getCell(`B${startRow - 1}`).font = { bold: true }
			ws.getCell(`K${startRow - 1}`).value = yearTitle
			ws.getCell(`K${startRow - 1}`).font = { bold: true }

			if (imgMonth) {
				const id1 = wb.addImage({ base64: imgMonth, extension: 'png' })
				ws.addImage(id1, { tl: { col: leftCol, row: startRow - 1 }, ext: { width: imgW, height: imgH } })
			}
			if (imgYear) {
				const id2 = wb.addImage({ base64: imgYear, extension: 'png' })
				ws.addImage(id2, { tl: { col: rightCol, row: startRow - 1 }, ext: { width: imgW, height: imgH } })
			}

			// 5) Descargar
			const filename = `Participación Global por Segmento${toDMY(reportDate.current)}.xlsx`
			const buf = await wb.xlsx.writeBuffer()
			const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = filename
			a.click()
			URL.revokeObjectURL(url)
		} catch (err) {
			sendNotification({ type: 'ERROR', message: err?.message || 'No se pudo generar el Excel.' })
		}
	}

	useEffect(() => {
		handleSubmit(initialParams)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// ====== datos ======
	const rows = Array.isArray(dataReport) ? dataReport : []
	const labels = rows.map((r) => (r.ItemClass || '').toUpperCase())
	const monthPart = rows.map((r) => Number(r.MonthParticipation) || 0) // 0..1
	const monthSale = rows.map((r) => Number(r.MonthSale) || 0)
	const anualPart = rows.map((r) => Number(r.AnualParticipation) || 0) // 0..1
	const anualSale = rows.map((r) => Number(r.AnualSale) || 0)

	// paleta
	const palette = { LINEA: '#3B82F6', MODA: '#F59E0B', ACCESORIOS: '#9CA3AF' }
	const fallback = ['#6366F1', '#10B981', '#F97316', '#EF4444', '#22C55E']
	const colors = labels.map((lbl, i) => palette[lbl] || fallback[i % fallback.length])

	const doughnutDataMonth = { labels, datasets: [{ data: monthPart, backgroundColor: colors, hoverOffset: 6 }] }
	const doughnutDataAnual = { labels, datasets: [{ data: anualPart, backgroundColor: colors, hoverOffset: 6 }] }

	const fmtMoney = (n) => '$' + numberWithCommas(n == null ? 0 : n)
	const fmtPct = (p) => `${(p * 100).toFixed(1)}%`

	const makeOptions = (title, parts, sales) => ({
		responsive: true,
		maintainAspectRatio: false,
		cutout: '58%',
		plugins: {
			legend: { position: 'right' },
			title: { display: true, text: title },
			tooltip: {
				callbacks: {
					label: (ctx) => {
						const i = ctx.dataIndex
						return `${ctx.label}: ${fmtPct(parts[i])} (${fmtMoney(sales[i])})`
					}
				}
			},
			doughnutSmartLabels: {
				amounts: sales,
				money: fmtMoney,
				gap: 18,
				lineColor: '#CBD5E1',
				lineWidth: 1
			}
		}
	})

	return (
		<div className="flex flex-col h-full">
			<TitleReport
				title={`PARTICIPACIÓN GLOBAL (AL ${dateHelper.getCurrentDate(reportDate.current)} DE ${dateHelper
					.getMonthName(reportDate.current)
					.toUpperCase()} ${dateHelper.getCurrentYear(reportDate.current)})`}
			/>

			{/* Parámetros */}
			<section className="p-4">
				<ParametersContainer>
					<Parameters>
						<Formik initialValues={initialParams} onSubmit={handleSubmit} enableReinitialize>
							{({ isSubmitting }) => (
								<Form>
									<fieldset className="space-y-2 mb-3">
										<Input
											type="date"
											id="fecha"
											name="fecha"
											label="Fecha"
											placeholder={reportDate.current}
											disabled={loading}
										/>
										<Checkbox
											id="conVentasEventos"
											name="conVentasEventos"
											label={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
											disabled={loading}
										/>
									</fieldset>

									{/* Botón de ancho completo */}
									<button
										type="submit"
										disabled={loading || isSubmitting}
										className={`w-full mt-2 px-4 py-2 rounded-md text-white ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-500'}`}
									>
										{loading ? 'Buscando…' : 'Buscar'}
									</button>
								</Form>
							)}
						</Formik>
					</Parameters>
				</ParametersContainer>

				<div className="flex justify-between mt-2">
					<p className="text-sm font-bold">{currentRegion}</p>
					<ExcelButton disabled={loading || rows.length === 0} handleClick={handleExport} />
				</div>
			</section>

			{/* Subtítulo centrado */}
			<h2 className="text-center text-base md:text-lg font-semibold text-gray-700 -mt-2">
				Distribución de venta por Segmento
			</h2>

			{/* Gráficas */}
			<section className="p-4">
				{loading && (
					<div className="rounded-xl border p-10 bg-white h-[380px] flex items-center justify-center">
						{/* Spinner grande */}
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
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="rounded-xl border p-4 shadow-sm bg-white h-[380px]">
							<Doughnut
								ref={monthChartRef}
								data={doughnutDataMonth}
								options={makeOptions(
									`MENSUAL ${dateHelper.getMonthName(reportDate.current).toUpperCase()} ${dateHelper.getCurrentYear(reportDate.current)}`,
									monthPart,
									monthSale
								)}
							/>
						</div>
						<div className="rounded-xl border p-4 shadow-sm bg-white h-[380px]">
							<Doughnut
								ref={yearChartRef}
								data={doughnutDataAnual}
								options={makeOptions(
									`ACUMULADO ${dateHelper.getCurrentYear(reportDate.current)}`,
									anualPart,
									anualSale
								)}
							/>
						</div>
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

const SegmentoWithAuth = withAuth(Segmento)
SegmentoWithAuth.getLayout = getVentasLayout
export default SegmentoWithAuth

