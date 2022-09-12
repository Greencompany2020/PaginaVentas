import digitalizadoProvider from "./providers/digitalizadoProvider";

export default function digitalizadoService(){
    const getUserClave = async () => {
        try {
            const {data} = await digitalizadoProvider.get('/claves/user');
            return data;
        } catch (error) {
            throw error;
        }
    }

    const getPoliticas = async () => {
        try {
            const {data} = await digitalizadoProvider.get('/politicas');
            return data;
        } catch (error) {
            throw error;
        }
    }

    return {
        getUserClave,
        getPoliticas,
    }
}