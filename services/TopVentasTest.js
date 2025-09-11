import reporteProvider from './providers/reporteProvider'

export async function getTopVentasTest(body) {
	try {
		const { data } = await reporteProvider.post('/topVentasTest', body)
		return data.result
	} catch (error) {
		throw error
	}
}

