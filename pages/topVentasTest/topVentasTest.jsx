// filepath: /Users/programador4/Documents/PaginaVentas/pages/reportes/topVentasTest.jsx
import { useEffect, useMemo, useState } from 'react'
import { getVentasLayout } from '../../components/layout/VentasLayout'
import { ParametersContainer, Parameters } from '../../components/containers'
import { numberWithCommas } from '../../utils/resultsFormated'
import withAuth from '../../components/withAuth'
import TitleReport from '../../components/TitleReport'
import { useNotification } from '../../components/notifications/NotificationsProvider'
import { v4 } from 'uuid'
import { Formik, Form } from 'formik'
import ExcelButton from '../../components/buttons/ExcelButton'
import DateHelper from '../../utils/dateHelper'
import { getTopVentasTest } from '../../services/TopVentasTest'
import LoaderComponent from '../../components/Loader'
import topVentasTestTemplate from '../../utils/excel/templates/topVentasTest'
import exportExcelMulti from '../../utils/excel/exportExcelMulti'

/** Vistas disponibles para filtrar en cliente */
const VIEW_MODES = {
	GLOBAL_TOP100: 'GLOBAL_TOP100', // IsGlobalTop100 === true
	ALL_300: 'ALL_300', // RN_Seg <= 100 para los 3 segmentos (300 filas)
	LINEA: 'LINEA', // SegmentKey = 1 y RN_Seg <= 100
	MODA: 'MODA', // SegmentKey = 2 y RN_Seg <= 100
	ACCESORIO: 'ACCESORIO' // SegmentKey = 3 y RN_Seg <= 100  ← ojo: singular
}

const VIEW_OPTIONS = [
	{ id: VIEW_MODES.GLOBAL_TOP100, label: 'Todos (global)' },
	{ id: VIEW_MODES.ALL_300, label: 'Todos (300)' },
	{ id: VIEW_MODES.LINEA, label: 'Línea' },
	{ id: VIEW_MODES.MODA, label: 'Moda' },
	{ id: VIEW_MODES.ACCESORIO, label: 'Accesorio' }
]

function ViewButtons({ value, onChange }) {
	return (
		<div className="flex flex-wrap gap-2">
			{VIEW_OPTIONS.map((opt) => {
				const active = value === opt.id
				return (
					<button
						key={opt.id}
						type="button"
						aria-pressed={active}
						onClick={() => onChange(opt.id)}
						className={`inline-flex items-center px-3 py-2 rounded-md border text-sm shadow-sm
              ${
								active
									? 'bg-blue-600 text-white border-blue-600'
									: 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
							}`}
						title={opt.label}
					>
						{opt.label}
					</button>
				)
			})}
		</div>
	)
}

const TopVentasTest = () => {
	const sendNotification = useNotification()
	const dateHelper = DateHelper()

	const [data, setData] = useState([]) // ← ahora guardamos las 300 filas
	const [isLoading, setIsLoading] = useState(false)

	const [currentMonthName, setCurrentMonthName] = useState(dateHelper.getMonthName(dateHelper.getYesterdayDate()))
	const [showImages, setShowImages] = useState(true)

	// Nueva: vista activa para filtrar en front
	const [viewMode, setViewMode] = useState(VIEW_MODES.GLOBAL_TOP100)

	// paginación
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)

	// 👇 estados nuevos
	const [sortKey, setSortKey] = useState('none') // 'none' | 'ranking' | 'segment' | 'itemSales' | 'amountSales'
	const [sortDir, setSortDir] = useState('asc') // 'asc' | 'desc'

	// 👇 alterna orden al hacer clic en un header
	function handleSort(key) {
		if (!key) return
		setCurrentPage(1)
		if (sortKey === key) {
			setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
		} else {
			setSortKey(key)
			// por defecto: ranking asc; números típicamente desc
			setSortDir(key === 'ranking' ? 'asc' : 'desc')
		}
	}

	const handleSubmit = async (values) => {
		try {
			setIsLoading(true)
			const monthNumber = parseInt(values.month, 10)
			const selectedMonth = dateHelper.getMonths().find((m) => m.value === values.month)
			setCurrentMonthName(selectedMonth.label)

			const rows = await getTopVentasTest({ month: monthNumber }) // ← ahora trae 300 filas
			setData(rows || [])
			setCurrentPage(1)
		} catch (error) {
			sendNotification({
				type: 'ERROR',
				message: error.response?.data?.message || error.message
			})
			setData([])
		} finally {
			setIsLoading(false)
		}
	}

	const initialMonthValue = useMemo(
		() => String(dateHelper.getcurrentMonth(dateHelper.getYesterdayDate())).padStart(2, '0'),
		[dateHelper]
	)

	useEffect(() => {
		handleSubmit({ month: initialMonthValue })
	}, [initialMonthValue])

	// Filtrado en cliente según vista seleccionada
	const filtered = useMemo(() => {
		if (!Array.isArray(data)) return []

		switch (viewMode) {
			case VIEW_MODES.GLOBAL_TOP100:
				// Top 100 global por RankingGlobal
				return data.filter((r) => r.IsGlobalTop100).sort((a, b) => a.RankingGlobal - b.RankingGlobal)

			case VIEW_MODES.ALL_300:
				// Top 100 por segmento (las 300 filas), orden: segmento, ranking segmental
				return data
					.filter((r) => r.RankingSegment && r.RankingSegment <= 100)
					.sort((a, b) => a.SegmentKey - b.SegmentKey || a.RankingSegment - b.RankingSegment)

			case VIEW_MODES.LINEA:
				return data
					.filter((r) => r.SegmentKey === 1 && r.RankingSegment <= 100)
					.sort((a, b) => a.RankingSegment - b.RankingSegment)

			case VIEW_MODES.MODA:
				return data
					.filter((r) => r.SegmentKey === 2 && r.RankingSegment <= 100)
					.sort((a, b) => a.RankingSegment - b.RankingSegment)

			case VIEW_MODES.ACCESORIO:
				return data
					.filter((r) => r.SegmentKey === 3 && r.RankingSegment <= 100)
					.sort((a, b) => a.RankingSegment - b.RankingSegment)

			default:
				return []
		}
	}, [data, viewMode])

	const isGlobalRanking = viewMode === VIEW_MODES.GLOBAL_TOP100

	const sorted = useMemo(() => {
		if (sortKey === 'none') return filtered
		const arr = [...filtered]

		const val = (r) => {
			switch (sortKey) {
				case 'ranking':
					return isGlobalRanking ? r.RankingGlobal ?? 0 : r.RankingSegment ?? 0
				case 'segment':
					return r.Segment ?? ''
				case 'itemSales':
					return r.ItemSales ?? 0
				case 'amountSales':
					return r.AmountSales ?? 0
				default:
					return 0
			}
		}

		arr.sort((a, b) => {
			const av = val(a),
				bv = val(b)
			const isText = typeof av === 'string' || typeof bv === 'string'
			if (isText) {
				return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
			}
			const diff = Number(av) - Number(bv)
			return sortDir === 'asc' ? diff : -diff
		})

		return arr
	}, [filtered, sortKey, sortDir, isGlobalRanking])

	// Paginación sobre el filtrado
	const totalRecords = sorted.length
	const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))
	const start = (currentPage - 1) * pageSize
	const pageRows = useMemo(() => sorted.slice(start, start + pageSize), [sorted, start, pageSize])
	const startIndex = totalRecords ? start + 1 : 0
	const endIndex = Math.min(currentPage * pageSize, totalRecords)

	const goToPage = (p) => setCurrentPage(Math.min(Math.max(1, p), totalPages))

	// arriba, dentro del componente:
	const maxMonth = parseInt(initialMonthValue, 10)
	const monthsToShow = useMemo(
	() => dateHelper.getMonths().filter(m => parseInt(m.value, 10) <= maxMonth),
	[dateHelper, maxMonth]
	)

	// 	const handleExport = () => {
	//   const rowsToExport = sorted; // todo lo visible (sin paginación)
	//   if (!rowsToExport.length) {
	//     sendNotification({ type: 'WARNING', message: 'No hay datos para exportar' })
	//     return
	//   }

	//   const title = titleByView(viewMode, currentMonthName)
	//   const isGlobalRanking = viewMode === VIEW_MODES.GLOBAL_TOP100
	//   const includeSegment = viewMode === VIEW_MODES.GLOBAL_TOP100 || viewMode === VIEW_MODES.ALL_300

	//   const template = topVentasTestTemplate({
	//     title,
	//     rows: rowsToExport,
	//     useGlobalRanking: isGlobalRanking,
	//     includeSegment
	//   })

	//   const fileName = `${title} ${new Date().getFullYear()}`
	//   const sheetName = title.slice(0, 31)

	//   exportExcel(
	//     fileName,
	//     template.getColumns(),
	//     template.getRows(),
	//     template.style,
	//     [sheetName],
	//     { includeWeb: true },
	//     `Reporte generado el ${new Date().toLocaleDateString('es-ES')}`
	//   )

	//   sendNotification({ type: 'SUCCESS', message: 'Excel exportado exitosamente' })
	// }

	const rowsByView = (mode, allData) => {
		if (!Array.isArray(allData)) return []
		switch (mode) {
			case VIEW_MODES.GLOBAL_TOP100:
				return allData.filter((r) => r.IsGlobalTop100).sort((a, b) => a.RankingGlobal - b.RankingGlobal)

			case VIEW_MODES.ALL_300:
				return allData
					.filter((r) => r.RankingSegment && r.RankingSegment <= 100)
					.sort((a, b) => a.SegmentKey - b.SegmentKey || a.RankingSegment - b.RankingSegment)

			case VIEW_MODES.LINEA:
				return allData
					.filter((r) => r.SegmentKey === 1 && r.RankingSegment <= 100)
					.sort((a, b) => a.RankingSegment - b.RankingSegment)

			case VIEW_MODES.MODA:
				return allData
					.filter((r) => r.SegmentKey === 2 && r.RankingSegment <= 100)
					.sort((a, b) => a.RankingSegment - b.RankingSegment)

			case VIEW_MODES.ACCESORIO:
				return allData
					.filter((r) => r.SegmentKey === 3 && r.RankingSegment <= 100)
					.sort((a, b) => a.RankingSegment - b.RankingSegment)

			default:
				return []
		}
	}

	const handleExport = () => {
		if (!data.length) {
			sendNotification({ type: 'WARNING', message: 'No hay datos para exportar' })
			return
		}

		// 1 hoja por vista
		const modes = [
			VIEW_MODES.GLOBAL_TOP100,
			VIEW_MODES.ALL_300,
			VIEW_MODES.LINEA,
			VIEW_MODES.MODA,
			VIEW_MODES.ACCESORIO
		]

		const sheets = modes.map((mode) => {
			const title = titleByView(mode, currentMonthName)
			const rows = rowsByView(mode, data)

			const template = topVentasTestTemplate({
				title,
				rows,
				useGlobalRanking: mode === VIEW_MODES.GLOBAL_TOP100,
				includeSegment: mode === VIEW_MODES.GLOBAL_TOP100 || mode === VIEW_MODES.ALL_300
			})

			return {
				name: title.slice(0, 31), // Excel: máx 31
				columns: template.getColumns(),
				rows: template.getRows(),
				style: template.style
			}
		})

		// Archivo final con todas las hojas
		const fileName = `Top Ventas ${currentMonthName} ${new Date().getFullYear()}`
		const footerMsg = `Reporte generado el ${new Date().toLocaleDateString('es-ES')}`

		// NUEVO helper multi-hoja
		exportExcelMulti(fileName, sheets, { includeWeb: true }, footerMsg)

		sendNotification({ type: 'SUCCESS', message: 'Excel exportado (todas las vistas)' })
	}

	return (
		<div className="flex flex-col h-full">
			<TitleReport title={`Top Ventas ${currentMonthName}`} />

			{/* Toolbar superior: botones de vista (izquierda) + Excel (derecha) */}
			<div className="p-4">
				<div className="flex items-center justify-between gap-3">
					<ViewButtons
						value={viewMode}
						onChange={(mode) => {
							setViewMode(mode)
							setCurrentPage(1)
						}}
					/>
					<ExcelButton handleClick={handleExport} />
				</div>
			</div>

			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center z-10">
					<LoaderComponent />
				</div>
			)}

			{/* Filtros (solo Mes + Mostrar imágenes) */}
			<section className="px-4 space-y-2">
				<ParametersContainer>
					<Parameters>
						<Formik initialValues={{ month: initialMonthValue }} enableReinitialize onSubmit={handleSubmit}>
							{({ values, setFieldValue }) => (
								<Form>
									<fieldset className="space-y-2 mb-3">
										<div className="flex flex-col">
											<label htmlFor="month" className="text-sm font-medium mb-1">
												Mes
											</label>
											<select
												id="month"
												name="month"
												value={values.month}
												onChange={(e) => {
													setFieldValue('month', e.target.value)
													const m = dateHelper.getMonths().find((mm) => mm.value === e.target.value)
													setCurrentMonthName(m.label)
													handleSubmit({ month: e.target.value })
												}}
												className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
											>
												{monthsToShow.map((m) => (
													<option key={m.value} value={m.value}>
														{m.label}
													</option>
												))}
											</select>
										</div>

										<div className="flex items-center mt-2">
											<input
												type="checkbox"
												id="showImages"
												checked={showImages}
												onChange={(e) => setShowImages(e.target.checked)}
												className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
											/>
											<label htmlFor="showImages" className="text-sm font-medium text-gray-700">
												Mostrar imágenes
											</label>
										</div>
									</fieldset>
								</Form>
							)}
						</Formik>
					</Parameters>
				</ParametersContainer>
			</section>

			{/* Panel de contenido */}
			<section className="flex-1 p-4 overflow-y-auto relative">
				{!isLoading && (
					<>
						<TopVentasTestTable
							title={titleByView(viewMode, currentMonthName)}
							data={pageRows}
							showImages={showImages}
							showSegmentColumn={
								viewMode !== VIEW_MODES.LINEA && viewMode !== VIEW_MODES.MODA && viewMode !== VIEW_MODES.ACCESORIO
							}
							useGlobalRanking={isGlobalRanking}
							sortKey={sortKey}
							sortDir={sortDir}
							onSort={handleSort}
						/>

						{/* …tu paginación igual que antes */}
					</>
				)}
			</section>
		</div>
	)
}

function titleByView(viewMode, monthName) {
	switch (viewMode) {
		case VIEW_MODES.GLOBAL_TOP100:
			return `Top 100 Global ${monthName}`
		case VIEW_MODES.ALL_300:
			return `Top 100 por Segmento (300) - ${monthName}`
		case VIEW_MODES.LINEA:
			return `Top 100 Línea - ${monthName}`
		case VIEW_MODES.MODA:
			return `Top 100 Moda - ${monthName}`
		case VIEW_MODES.ACCESORIO:
			return `Top 100 Accesorios - ${monthName}`
		default:
			return `Top Ventas ${monthName}`
	}
}

function SortTh({ label, active, dir, onClick }) {
	return (
		<button
			type="button"
			onClick={onClick}
			// hereda el estilo del <th>: sin fondo/borde, texto igual que los no ordenables
			className="w-full h-full bg-transparent border-0 px-0 py-0 
                 text-inherit font-inherit uppercase tracking-wide
                 flex items-center justify-center gap-1
                 focus:outline-none"
			title={`Ordenar por ${label}`}
		>
			<span className="whitespace-nowrap font-bold">{label}</span>
			<span className={`text-[10px] ${active ? 'opacity-90' : 'opacity-50'}`}>
				{active ? (dir === 'asc' ? '▲' : '▼') : '↕'}
			</span>
		</button>
	)
}

const TopVentasTestTable = ({
	title,
	data,
	showImages,
	showSegmentColumn,
	useGlobalRanking,
	sortKey,
	sortDir,
	onSort
}) => {
	if (!data) return null

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-bold text-center">{title}</h3>
			<div className="overflow-x-auto">
				<table className="table-report-top-ventas">
					<thead>
						<tr className="text-center">
							<th aria-sort={sortKey === 'ranking' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}>
								<SortTh label="#" active={sortKey === 'ranking'} dir={sortDir} onClick={() => onSort('ranking')} />
							</th>
							{showSegmentColumn && (
								<th aria-sort={sortKey === 'segment' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}>
									<SortTh
										label="Segmento"
										active={sortKey === 'segment'}
										dir={sortDir}
										onClick={() => onSort('segment')}
									/>
								</th>
							)}
							{showImages && <th>IMAGEN</th>} {/* sin orden */}
							<th>PRODUCTO</th> {/* sin orden */}
							<th aria-sort={sortKey === 'itemSales' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}>
								<SortTh
									label="Piezas"
									active={sortKey === 'itemSales'}
									dir={sortDir}
									onClick={() => onSort('itemSales')}
								/>
							</th>
							<th aria-sort={sortKey === 'amountSales' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}>
								<SortTh
									label="Importe"
									active={sortKey === 'amountSales'}
									dir={sortDir}
									onClick={() => onSort('amountSales')}
								/>
							</th>
						</tr>
					</thead>

					<tbody>
						{data.map((item) => (
							<tr key={v4()}>
								<td className="text-center">{useGlobalRanking ? item.RankingGlobal : item.RankingSegment}</td>

								{showSegmentColumn && <td className="text-center">{item.Segment}</td>}

								{showImages && (
									<td className="text-center">
										<div className="flex justify-center items-center">
											<img
												src={safeImg(item.Image)}
												width={90}
												height={90}
												alt={item.Description || item.Modelo}
												className="object-cover rounded"
											/>
										</div>
									</td>
								)}

								<td className="text-center" title={`${item.Description} - ${item.Color}`}>
									{item.Modelo}
								</td>
								<td className="text-center">{numberWithCommas(item.ItemSales)}</td>
								<td className="text-center">
									${item.AmountSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

function safeImg(img) {
	if (!img || typeof img !== 'string') return ''
	const v = img.trim()
	if (v.startsWith('http') || v.startsWith('blob:') || v.startsWith('data:')) return v
	return `data:image/jpeg;base64,${v}`
}

const TopVentasTestWithAuth = withAuth(TopVentasTest)
TopVentasTestWithAuth.getLayout = getVentasLayout
export default TopVentasTestWithAuth
