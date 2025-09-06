import reporteProvider from './providers/reporteProvider'

export async function getTopVentas(body) {
	try {
		const { data } = await reporteProvider.post('/topVentas', body)
		return data.result
	} catch (error) {
		throw error
	}
}

