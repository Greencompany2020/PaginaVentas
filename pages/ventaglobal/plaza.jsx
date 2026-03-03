// pages/ventaglobal/plaza.jsx
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

import { spliteArrDate, parseNumberToBoolean } from '../../utils/functions'
import { getVentaDetNivelTienda } from '../../services/VentaDetService'
import { checkboxLabels } from '../../utils/data'
import DateHelper from '../../utils/dateHelper'

/** Plugin: pinta % y monto con líneas guía */
const DoughnutSmartLabelsPlaza = {
    id: 'doughnutSmartLabelsPlaza',
    afterDatasetsDraw(chart, _args, opts) {
        const { ctx, data, chartArea } = chart
        const ds = data.datasets?.[0]
        if (!ds) return

        const meta = chart.getDatasetMeta(0)
        const total = (ds.data || []).reduce((a, b) => a + (Number(b) || 0), 0)
        if (!total) return

        const amounts = opts?.amounts || []
        const money = opts?.money || ((n) => `${n}`)
        const gap = opts?.gap ?? 16
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
            if (i >= 5) return // Solo mostrar labels para los 5 más grandes

            const text = `${pct.toFixed(1)}% — ${money(Number(amounts[i]) || 0)}`
            const item = { text, anchorX: ax, anchorY: ay, labelX: lx, labelY: ly, side }
                ; (side === 'right' ? right : left).push(item)
        })

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
        ctx.font = '600 11px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'
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
        ctx.font = opts?.font || '500 11px system-ui, -apple-system, Segoe UI, Roboto'
        const pad = opts?.padding ?? 10
        ctx.fillText(text, chartArea.right - pad, chartArea.bottom - pad)
        ctx.restore()
    }
}

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    ChartTitle,
    DoughnutSmartLabelsPlaza,
    CornerNote
)

const toDMY = (raw) => {
    if (!raw) return ''
    const s = String(raw)
    if (s.includes('-')) {
        const [a, b, c] = s.split('-')
        return a.length === 4 ? `${c.padStart(2, '0')}-${b.padStart(2, '0')}-${a}` : s
    }
    return s
}

function ParticipacionPlaza({ config }) {
    const sendNotification = useNotification()
    const dateHelper = DateHelper()

    const [loading, setLoading] = useState(false)
    const [dataMonth, setDataMonth] = useState([])
    const [dataYear, setDataYear] = useState([])
    const [reportDate, setReportDate] = useState(dateHelper.getYesterdayDate())

    const initialParams = {
        fecha: dateHelper.getYesterdayDate(),
        conVentasEventos: parseNumberToBoolean(config?.conVentasEventos || 0),
        conVentasEnLinea: config?.incluirWeb !== 'N'
    }

    const monthChartRef = useRef(null)
    const yearChartRef = useRef(null)

    const [lastParams, setLastParams] = useState({
        fecha: initialParams.fecha,
        conVentasEventos: initialParams.conVentasEventos ? '1' : '2',
        conVentasEnLinea: initialParams.conVentasEnLinea ? 'Y' : 'N'
    })

    const processPlazaData = (rows) => {
        if (!Array.isArray(rows)) return []
        // Filtramos solo las filas que son totales por plaza (Tienda empieza con "TOT ")
        const plazaRows = rows.filter(r => /^TOT\s+/i.test(String(r.Tienda || '')))
        const totalRow = rows.find(r => String(r.Tienda) === 'TOTAL')
        const vtaTotal = Number(totalRow?.Venta || 0)

        return plazaRows.map(r => ({
            plaza: String(r.Plaza || '').toUpperCase(),
            venta: Number(r.Venta || 0),
            participacion: vtaTotal > 0 ? Number(r.Venta || 0) / vtaTotal : 0
        })).sort((a, b) => b.venta - a.venta)
    }

    async function handleSubmit(values) {
        try {
            setLoading(true)
            setReportDate(values.fecha)

            const basePayload = {
                conVentasEventos: values.conVentasEventos ? '1' : '2',
                conVentasEnLinea: values.conVentasEnLinea ? 'Y' : 'N'
            }

            // 1. Rango Mensual (Desde el inicio del mes hasta la fecha)
            const d = new Date(values.fecha + 'T12:00:00')
            const iniMes = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
            const payloadMonth = { ...basePayload, fechaIni: iniMes, fechaFin: values.fecha }

            // 2. Rango Anual (Desde el inicio del año hasta la fecha)
            const iniAno = `${d.getFullYear()}-01-01`
            const payloadYear = { ...basePayload, fechaIni: iniAno, fechaFin: values.fecha }

            const [resMonth, resYear] = await Promise.all([
                getVentaDetNivelTienda(payloadMonth),
                getVentaDetNivelTienda(payloadYear)
            ])

            setDataMonth(processPlazaData(resMonth))
            setDataYear(processPlazaData(resYear))
            setLastParams({ ...basePayload, fecha: values.fecha })
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error?.response?.data?.message || error?.message || 'Error al cargar el reporte'
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        handleSubmit(initialParams)
    }, [])

    // Colores para plazas
    const palette = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
        '#EC4899', '#06B6D4', '#F97316', '#6366F1', '#14B8A6'
    ]

    const labelsMonth = dataMonth.map(d => d.plaza)
    const valuesMonth = dataMonth.map(d => d.participacion)
    const salesMonth = dataMonth.map(d => d.venta)

    const labelsYear = dataYear.map(d => d.plaza)
    const valuesYear = dataYear.map(d => d.participacion)
    const salesYear = dataYear.map(d => d.venta)

    const colors = palette.slice(0, Math.max(labelsMonth.length, labelsYear.length))

    const chartDataMonth = {
        labels: labelsMonth,
        datasets: [{ data: valuesMonth, backgroundColor: colors, hoverOffset: 6 }]
    }
    const chartDataYear = {
        labels: labelsYear,
        datasets: [{ data: valuesYear, backgroundColor: colors, hoverOffset: 6 }]
    }

    const fmtMoney = (n) => '$' + numberWithCommas(n == null ? 0 : n)
    const fmtPct = (p) => `${(p * 100).toFixed(1)}%`

    const makeOptions = (title, parts, sales, note) => ({
        responsive: true,
        maintainAspectRatio: false,
        cutout: '58%',
        plugins: {
            legend: {
                position: 'right',
                labels: { usePointStyle: true, font: { size: 11, weight: '600' } }
            },
            title: {
                display: true,
                text: title,
                color: '#111827',
                font: { size: 16, weight: '700' },
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
            doughnutSmartLabelsPlaza: { amounts: sales, money: fmtMoney, gap: 16, lineColor: '#CBD5E1' },
            cornerNote: note ? { text: note, color: '#374151' } : undefined
        }
    })

    const handleExport = async () => {
        try {
            if (!dataMonth.length && !dataYear.length) {
                sendNotification({ type: 'ERROR', message: 'No hay datos para exportar.' })
                return
            }
            const takePng = (ref) => ref?.current?.toBase64Image() || null
            const imgMonth = takePng(monthChartRef)
            const imgYear = takePng(yearChartRef)

            const { Workbook } = await import('exceljs')
            const wb = new Workbook()
            const ws = wb.addWorksheet('Participacion por Plaza')

            // Tabla combinada
            ws.columns = [
                { header: 'Plaza', key: 'plaza', width: 25 },
                { header: 'Venta Mes ($)', key: 'vmes', width: 18, style: { numFmt: '$#,##0.00' } },
                { header: '% Part. Mes', key: 'pmes', width: 12, style: { numFmt: '0.0%' } },
                { header: 'Venta Acum. ($)', key: 'vyear', width: 18, style: { numFmt: '$#,##0.00' } },
                { header: '% Part. Acum.', key: 'pyear', width: 12, style: { numFmt: '0.0%' } }
            ]

            // Unir datos de ambos para la tabla
            const allPlazas = Array.from(new Set([...labelsMonth, ...labelsYear]))
            allPlazas.forEach(p => {
                const dm = dataMonth.find(x => x.plaza === p)
                const dy = dataYear.find(x => x.plaza === p)
                ws.addRow({
                    plaza: p,
                    vmes: dm?.venta || 0,
                    pmes: dm?.participacion || 0,
                    vyear: dy?.venta || 0,
                    pyear: dy?.participacion || 0
                })
            })

            const hdr = ws.getRow(1)
            hdr.font = { bold: true, color: { argb: 'FFFFFFFF' } }
            hdr.eachCell(c => c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } })

            // Imágenes
            const startRow = ws.lastRow.number + 4
            if (imgMonth) {
                const id1 = wb.addImage({ base64: imgMonth, extension: 'png' })
                ws.addImage(id1, { tl: { col: 0, row: startRow }, ext: { width: 800, height: 350 } })
            }
            if (imgYear) {
                const id2 = wb.addImage({ base64: imgYear, extension: 'png' })
                ws.addImage(id2, { tl: { col: 6, row: startRow }, ext: { width: 800, height: 350 } })
            }

            const filename = `Participacion_Plazas_${toDMY(reportDate)}.xlsx`
            const buf = await wb.xlsx.writeBuffer()
            const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url; a.download = filename; a.click()
            URL.revokeObjectURL(url)
        } catch (err) {
            sendNotification({ type: 'ERROR', message: 'Error al generar Excel: ' + err.message })
        }
    }

    const nota = `Ventas hasta el ${toDMY(reportDate)}`

    return (
        <div className="flex flex-col h-full">
            <TitleReport
                title={`PARTICIPACIÓN POR PLAZA (AL ${dateHelper.getCurrentDate(reportDate)} DE ${dateHelper.getMonthName(reportDate).toUpperCase()} ${dateHelper.getCurrentYear(reportDate)})`}
            />

            <section className="p-4">
                <ParametersContainer>
                    <Parameters>
                        <Formik initialValues={initialParams} onSubmit={handleSubmit} enableReinitialize>
                            {({ isSubmitting }) => (
                                <Form>
                                    <fieldset className="space-y-2 mb-[16rem]">
                                        <Input type="date" id="fecha" name="fecha" label="Fecha" disabled={loading} />
                                        <Checkbox id="conVentasEventos" name="conVentasEventos" label={checkboxLabels.INCLUIR_VENTAS_EVENTOS} disabled={loading} />
                                        <Checkbox id="conVentasEnLinea" name="conVentasEnLinea" label={checkboxLabels.INCLUIR_VENTA_EN_LINEA} disabled={loading} />
                                    </fieldset>
                                    <button type="submit" disabled={loading || isSubmitting} className={`w-full mt-2 px-4 py-2 rounded-md text-white ${loading ? 'bg-slate-400' : 'bg-sky-600 hover:bg-sky-500'}`}>
                                        {loading ? 'Buscando…' : 'Buscar'}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </Parameters>
                </ParametersContainer>

                <div className="flex justify-between mt-4">
                    <p className="text-sm font-bold">DISTRIBUCIÓN POR PLAZA</p>
                    <ExcelButton disabled={loading || (!dataMonth.length && !dataYear.length)} handleClick={handleExport} />
                </div>
            </section>

            <section className="p-4 flex-grow overflow-y-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[400px]">
                        <svg className="animate-spin h-12 w-12 text-blue-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" /></svg>
                        <p className="mt-4 font-medium text-gray-600">Cargando datos de plazas...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="rounded-xl border p-4 shadow-sm bg-white h-[420px]">
                            <Doughnut
                                ref={monthChartRef}
                                data={chartDataMonth}
                                options={makeOptions(
                                    `MENSUAL ${dateHelper.getMonthName(reportDate).toUpperCase()} ${dateHelper.getCurrentYear(reportDate)}`,
                                    valuesMonth, salesMonth, nota
                                )}
                            />
                        </div>
                        <div className="rounded-xl border p-4 shadow-sm bg-white h-[420px]">
                            <Doughnut
                                ref={yearChartRef}
                                data={chartDataYear}
                                options={makeOptions(
                                    `ACUMULADO ${dateHelper.getCurrentYear(reportDate)}`,
                                    valuesYear, salesYear, nota
                                )}
                            />
                        </div>
                    </div>
                )}
            </section>
        </div>
    )
}

const ParticipacionPlazaWithAuth = withAuth(ParticipacionPlaza)
ParticipacionPlazaWithAuth.getLayout = getVentasLayout
export default ParticipacionPlazaWithAuth
