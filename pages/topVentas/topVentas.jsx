// filepath: /Users/programador4/Documents/PaginaVentas/pages/reportes/topVentas.jsx
import { useEffect, useState } from 'react'
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
import { getTopVentas } from '../../services/TopVentas'
import ShowImage from '../../components/buttons/ShowImage'
import LoaderComponent from '../../components/Loader'
import topVentasTemplate from '../../utils/excel/templates/topVentas'
import exportExcel from '../../utils/excel/exportExcel'

const TopVentas = (props) => {
	const sendNotification = useNotification()
	const dateHelper = DateHelper()

	// Estados de los reportes
	const [dataTopMayores, setDataTopMayores] = useState(null)
	const [currentMonthName, setCurrentMonthName] = useState(dateHelper.getMonthName(dateHelper.getYesterdayDate()))
	const [currentMonthValue, setCurrentMonthValue] = useState(dateHelper.getcurrentMonth(dateHelper.getYesterdayDate()))

	const [isLoading, setIsLoading] = useState(false)
	const [showImages, setShowImages] = useState(false)

	const [showProductModal, setShowProductModal] = useState(false)
	const [selectedProduct, setSelectedProduct] = useState()

	const parameters = {
		month: currentMonthValue
	}
	Object.seal(parameters)

	const handleSubmit = async (values) => {
		try {
			setIsLoading(true)

			const monthNumber = parseInt(values.month)

			const selectedMonth = dateHelper.getMonths().find((m) => m.value === values.month)
			setCurrentMonthName(selectedMonth.label)

			const data = await getTopVentas({ month: monthNumber })

			if (data && data.length > 0) {
				const topMayores = data.slice(0, 15)

				setDataTopMayores(topMayores)
			} else {
				setDataTopMayores([])
			}
		} catch (error) {
			sendNotification({
				type: 'ERROR',
				message: error.response?.data?.message || error.message
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleToggleImages = () => {
		setShowImages(!showImages)
	}

	const handleProductClick = (producto) => {
		setShowProductModal(true)
		setSelectedProduct(producto)
	}

	const handleExport = () => {
		try {
			if (!dataTopMayores && !dataTopMenores) {
				sendNotification({
					type: 'WARNING',
					message: 'No hay datos para exportar'
				})
				return
			}

			const template = topVentasTemplate(currentMonthName, dataTopMayores, dataTopMenores)

			exportExcel(
				`Top Ventas ${currentMonthName} ${new Date().getFullYear()}`, // Nombre del archivo
				template.getColumns(), // Columnas
				template.getRows(), // Filas
				template.style, // Estilos
				[`Top Ventas ${currentMonthName}`], // Nombre de la hoja
				{ includeWeb: true }, // Configuración
				`Reporte generado el ${new Date().toLocaleDateString('es-ES')}` // Nota al pie
			)

			sendNotification({
				type: 'SUCCESS',
				message: 'Excel exportado exitosamente'
			})
		} catch (error) {
			console.error('Error al exportar:', error)
			sendNotification({
				type: 'ERROR',
				message: 'Error al exportar a Excel'
			})
		}
	}

	useEffect(() => {
		const initialMonthValue = String(dateHelper.getcurrentMonth(dateHelper.getYesterdayDate())).padStart(2, '0')
		handleSubmit({ month: initialMonthValue })
	}, [])

	// Valor inicial del select (formato "09")
	const initialMonthValue = String(dateHelper.getcurrentMonth(dateHelper.getYesterdayDate())).padStart(2, '0')

	return (
		<div className="flex flex-col h-full">
			<TitleReport title={`Top Ventas ${currentMonthName}`} />

			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center z-10">
					<LoaderComponent />
				</div>
			)}

			<section className="p-4 space-y-2">
				<div className="flex justify-between items-center">
					<ParametersContainer>
						<Parameters>
							<Formik initialValues={{ month: initialMonthValue }} onSubmit={handleSubmit}>
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
														const selectedMonth = dateHelper.getMonths().find((m) => m.value === e.target.value)
														setCurrentMonthName(selectedMonth.label)
														setCurrentMonthValue(parseInt(e.target.value))
														handleSubmit({ month: e.target.value })
													}}
													className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
												>
													{dateHelper.getMonths().map((month) => (
														<option key={month.value} value={month.value}>
															{month.label}
														</option>
													))}
												</select>
											</div>

											{/* Checkbox para mostrar/ocultar imágenes */}
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

					{/* Solo el botón de Excel */}
					<div className="flex space-x-2">
						<ExcelButton handleClick={handleExport} />
					</div>
				</div>
			</section>
			<section className={`flex-1 p-4 overflow-y-auto relative`}>
				{!isLoading && (
					<div className="">
						{/* Tabla Top 15 Mayores Ventas */}
						<TopVentasTable
							title={`Top 15 Mayores Ventas ${currentMonthName}`}
							data={dataTopMayores}
							onProductClick={handleProductClick}
							showImages={showImages}
						/>

						{/* Modal de producto */}
						{showProductModal && (
							<ProductModal
								product={selectedProduct}
								onClose={() => {
									setShowProductModal(false)
									setSelectedProduct(undefined)
								}}
							/>
						)}
					</div>
				)}
			</section>
		</div>
	)
}

const TopVentasTable = ({ title, data, onProductClick, showImages }) => {
	if (!data) return null

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-bold text-center">{title}</h3>
			<div className="overflow-x-auto">
				<table className="table-report-top-ventas">
					<thead>
						<tr className="text-center">
							<th>#</th>
							{showImages && <th>Imagen</th>}
							<th>Producto</th>
							<th>Piezas</th>
							<th>Importe</th>
						</tr>
					</thead>
					<tbody>
						{data.map((item) => (
							<tr key={v4()}>
								<td className="text-center">{item.Ranking}</td>
								{showImages && (
									<td className="text-center">
										<div className="flex justify-center items-center">
											<img
												src={`${item.Image}`}
												width={100}
												height={100}
												alt="Icono de producto"
												className="object-cover rounded"
											/>
										</div>
									</td>
								)}
								<td
									className="text-center producto-cell cursor-pointer hover:underline"
									onClick={() => onProductClick(item)}
									title={`${item.Description} - ${item.Color}`}
								>
									{item.ItemCode}
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

const ProductModal = ({ product, onClose }) => {
	if (!product) return null

	const getImageSrc = (img) => {
		if (!img) return null
		if (typeof img !== 'string') return null
		const v = img.trim()
		if (v.startsWith('http') || v.startsWith('blob:') || v.startsWith('data:')) return v
		// Assume raw base64 without header
		return `data:image/jpeg;base64,${v}`
	}
	const imageSrc = getImageSrc(product.Image)

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
			<div className="bg-white p-4 rounded shadow-lg">
				<h2 className="text-lg font-bold mb-2">{product.Description}</h2>
				{imageSrc && (
					<div className="mb-3 w-full flex justify-center">
						<img
							src={imageSrc}
							alt={product.Description || product.ItemCode}
							className="max-h-64 object-contain rounded border"
						/>
					</div>
				)}
				<p className="text-sm mb-2">Color: {product.Color}</p>
				<p className="text-sm mb-2">Código: {product.ItemCode}</p>
				<p className="text-sm mb-2">Piezas: {numberWithCommas(product.ItemSales)}</p>
				<p className="text-sm mb-2">
					Importe: $
					{product.AmountSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
				</p>
				<button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
					Cerrar
				</button>
			</div>
		</div>
	)
}

const TopVentasWithAuth = withAuth(TopVentas)
TopVentasWithAuth.getLayout = getVentasLayout
export default TopVentasWithAuth
