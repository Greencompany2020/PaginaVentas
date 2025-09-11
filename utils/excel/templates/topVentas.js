/**
 * Plantilla para exportar Top Ventas a Excel
 * @param {string} monthName - Nombre del mes (ej: "Septiembre")
 * @param {Array} topMayores - Datos de top 15 mayores ventas
 * @returns {Object} - Objeto con columnas, filas y estilos
 */
export default function topVentasTemplate(monthName, topMayores) {
	// Definir columnas del Excel
	const getColumns = () => [
		{
			cell: 'A1',
			value: `Top Ventas ${monthName}`,
			styles: { font: { bold: true, size: 16 }, alignment: { horizontal: 'center' } }
		},
		{
			cell: 'A3',
			value: 'TOP 15 MAYORES VENTAS',
			styles: {
				font: { bold: true, size: 14 },
				fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4CAF50' } }
			}
		},
		{
			cell: 'A4',
			value: 'Ranking',
			styles: { font: { bold: true }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } } }
		},
		{
			cell: 'B4',
			value: 'Código',
			styles: { font: { bold: true }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } } }
		},
		{
			cell: 'C4',
			value: 'Descripción',
			styles: { font: { bold: true }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } } }
		},
		{
			cell: 'D4',
			value: 'Color',
			styles: { font: { bold: true }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } } }
		},
		// {
		// 	cell: 'E4',
		// 	value: 'Piezas',
		// 	styles: { font: { bold: true }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } } }
		// },
		{
			cell: 'E4',
			value: 'Importe',
			styles: { font: { bold: true }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } } }
		}
	]

	// Preparar las filas de datos
	const getRows = () => {
		const rows = []

		// Agregar datos de top mayores
		if (topMayores && topMayores.length > 0) {
			topMayores.forEach((item) => {
				rows.push({
					ranking: item.Ranking,
					codigo: item.ItemCode,
					descripcion: item.Description,
					color: item.Color,
					// piezas: item.ItemSales,
					importe: item.AmountSales
				})
			})
		}

		// Agregar separador
		rows.push({
			ranking: '',
			codigo: '',
			descripcion: '',
			color: '',
			// piezas: '',
			importe: ''
		})
		return rows
	}

	// Estilos generales
	const styles = {
		styles: {
			alignment: { horizontal: 'center', vertical: 'middle' },
			border: {
				top: { style: 'thin' },
				left: { style: 'thin' },
				bottom: { style: 'thin' },
				right: { style: 'thin' }
			}
		},
		format: {
			number: '#,##0',
			decimal: '#,##0.00'
		},
		cols: {
			A: { alignment: { horizontal: 'center' } }, // Ranking
			B: { alignment: { horizontal: 'left' } }, // Código
			C: { alignment: { horizontal: 'left' } }, // Descripción
			D: { alignment: { horizontal: 'left' } }, // Color
			// E: { alignment: { horizontal: 'right' } }, // Piezas
			E: { alignment: { horizontal: 'right' } } // Importe
		}
	}

	return {
		getColumns,
		getRows,
		style: styles
	}
}