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

import { parseNumberToBoolean } from '../../utils/functions'
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
		const gap = opts?.gap ?? 24 // px entre etiquetas
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
			const ax = arc.x + cos * rOut
			const ay = arc.y + sin * rOut
			const lx = arc.x + cos * (rOut + 24)
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

const CornerNote = {
	id: 'cornerNote',
	afterDraw(chart, _args, opts) {
		const text = opts?.text
		if (!text) return
		const { ctx, chartArea } = chart
		ctx.save()
		ctx.textAlign = 'right'
		ctx.textBaseline = 'bottom'
		ctx.fillStyle = opts?.color || '#374151'
		ctx.font = opts?.font || '500 12px system-ui, -apple-system, Segoe UI, Roboto'
		const pad = opts?.padding ?? 10
		ctx.fillText(text, chartArea.right - pad, chartArea.bottom - pad)
		ctx.restore()
	}
}

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ChartTitle)

const toDMY = (raw) => {
	if (!raw) return ''
	const s = String(raw)
	if (s.includes('-')) {
		const [a, b, c] = s.split('-')
		if (a.length === 4) return `${c.padStart(2, '0')}-${b.padStart(2, '0')}-${a}`
		return `${a.padStart(2, '0')}-${b.padStart(2, '0')}-${c}`
	}
	if (s.includes('/')) {
		const [d, m, y] = s.split('/')
		return `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`
	}
	return s
}

const isBoolean = (data) => {
	if (data === 'N') {
		return false
	} else {
		return true
	}
}

function Segmento({ config }) {
	const sendNotification = useNotification()
	const dateHelper = DateHelper()

	const [loading, setLoading] = useState(false)
	const [dataReport, setDataReport] = useState(null)
	const [reportDate, setReportDate] = useState({
		current: dateHelper.getYesterdayDate()
	})
	const [currentRegion] = useState('TOTAL')
	const [incremento] = useState('compromiso')

	const initialParams = {
		fecha: dateHelper.getYesterdayDate(),
		conVentasEventos: parseNumberToBoolean(config?.conVentasEventos || 0),
		conVentasEnLinea: isBoolean(config?.incluirWeb || 'N')
	}

	const monthChartRef = useRef(null)
	const yearChartRef = useRef(null)

	const [lastParams, setLastParams] = useState({
		fecha: initialParams.fecha,
		conVentasEventos: initialParams.conVentasEventos ? '1' : '2',
		conVentasEnLinea: initialParams.conVentasEnLinea ? 'Y' : 'N'
	})

	async function handleSubmit(values) {
		try {
			setLoading(true)
			setDataReport(null) // limpia mientras carga
			setReportDate((prev) => ({ ...prev, current: values.fecha }))

			const payload = {
				fecha: values.fecha,
				conVentasEventos: values.conVentasEventos ? '1' : '2', // '1' incluye, '2' excluye
				conVentasEnLinea: values.conVentasEnLinea ? 'Y' : 'N'
			}
			const res = await getVentaGlobalSegmento(payload)
			setDataReport(res)
			setLastParams(payload)
		} catch (error) {
			sendNotification({
				type: 'ERROR',
				message: error?.response?.data?.message || error?.message || 'Error al cargar el reporte'
			})
		} finally {
			setLoading(false)
		}
	}

	const handleExport = async () => {
		try {
			const rows = Array.isArray(dataReport) ? dataReport : []
			if (!rows.length) {
				sendNotification({ type: 'ERROR', message: 'No hay datos para exportar.' })
				return
			}

			const takePng = (ref) => {
				const chart = ref?.current
				if (!chart) return null
				if (typeof chart.toBase64Image === 'function') return chart.toBase64Image()
				const canvas = chart.canvas || chart.ctx?.canvas
				return canvas?.toDataURL?.('image/png') || null
			}
			const imgMonth = takePng(monthChartRef)
			const imgYear = takePng(yearChartRef)

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
				{ k: 'Incluir ventas de eventos', v: String(lastParams.conVentasEventos) === '1' ? 'Sí' : 'No' },
				{ k: 'Incluir venta en línea', v: lastParams.conVentasEnLinea === 'Y' ? 'Sí' : 'No' }
			])
			wf.getRow(1).font = { bold: true }

			const startRow = ws.lastRow.number + 3
			const leftCol = 0 // ~columna B (0=A,1=B,...)
			const rightCol = 10 // ~columna K
			const imgW = 1000,
				imgH = 400 // tamaño aprox. en px

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
	}, [])

	// ====== datos ======
	const rows = Array.isArray(dataReport) ? dataReport : []
	const labels = rows.map((r) => (r.ItemClass || '').toUpperCase())
	const monthPart = rows.map((r) => Number(r.MonthParticipation) || 0)
	const monthSale = rows.map((r) => Number(r.MonthSale) || 0)
	const anualPart = rows.map((r) => Number(r.AnualParticipation) || 0)
	const anualSale = rows.map((r) => Number(r.AnualSale) || 0)

	// paleta
	const palette = { LINEA: '#3B82F6', MODA: '#F59E0B', ACCESORIOS: '#9CA3AF' }
	const fallback = ['#6366F1', '#10B981', '#F97316', '#EF4444', '#22C55E']
	const colors = labels.map((lbl, i) => palette[lbl] || fallback[i % fallback.length])

	const doughnutDataMonth = { labels, datasets: [{ data: monthPart, backgroundColor: colors, hoverOffset: 6 }] }
	const doughnutDataAnual = { labels, datasets: [{ data: anualPart, backgroundColor: colors, hoverOffset: 6 }] }

	const fmtMoney = (n) => '$' + numberWithCommas(n == null ? 0 : n)
	const fmtPct = (p) => `${(p * 100).toFixed(1)}%`

	const makeOptions = (title, parts, sales, cornerNoteText) => ({
		responsive: true,
		maintainAspectRatio: false,
		cutout: '58%',
		layout: { padding: { bottom: 22 } },
		plugins: {
			legend: {
				position: 'right',
				labels: { usePointStyle: true, font: { size: 12, weight: '600' } }
			},
			title: {
				display: true,
				text: title,
				color: '#111827',
				font: { size: 18, weight: '700' },
				padding: { top: 8, bottom: 12 }
			},
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
				gap: 24,
				lineColor: '#CBD5E1',
				lineWidth: 1
			},
			cornerNote: cornerNoteText ? { text: cornerNoteText, color: '#374151' } : undefined
		}
	})

	const notaMensual = `Ventas hasta el ${toDMY(reportDate.current)}`
	const notaAnual = `Ventas hasta el ${toDMY(reportDate.current)}`

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
									<fieldset className="space-y-2 mb-[16rem]">
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
										<Checkbox
											id="conVentasEnLinea"
											name="conVentasEnLinea"
											label={checkboxLabels.INCLUIR_VENTA_EN_LINEA}
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
			<h2 className="text-center text-base md:text-base font-bold text-black-mt-2">
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
								plugins={[DoughnutSmartLabels, CornerNote]}
								options={makeOptions(
									`MENSUAL ${dateHelper.getMonthName(reportDate.current).toUpperCase()} ${dateHelper.getCurrentYear(reportDate.current)}`,
									monthPart,
									monthSale,
									notaMensual
								)}
							/>
						</div>
						<div className="rounded-xl border p-4 shadow-sm bg-white h-[380px]">
							<Doughnut
								ref={yearChartRef}
								data={doughnutDataAnual}
								plugins={[DoughnutSmartLabels, CornerNote]}
								options={makeOptions(
									`ACUMULADO ${dateHelper.getCurrentYear(reportDate.current)}`,
									anualPart,
									anualSale,
									notaAnual
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

			{/* Mensaje general debajo de las tablas */}
			{/* <div className="mt-3 mb-6">
				<p className="text-xs italic text-slate-600 text-center">
					Las ventas en línea son reportadas por fecha de facturación.
				</p>
			</div> */}
		</div>
	)
}

const SegmentoWithAuth = withAuth(Segmento)
SegmentoWithAuth.getLayout = getVentasLayout
export default SegmentoWithAuth

