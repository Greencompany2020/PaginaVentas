import digitalizadoProvider from "./providers/digitalizadoProvider";

export default function digitalizadoService() {
    const getUserClave = async () => {
        try {
            const { data } = await digitalizadoProvider.get('/claves/user');
            return data;
        } catch (error) {
            throw error;
        }
    }

    const getPoliticas = async () => {
        try {
            const { data } = await digitalizadoProvider.get('/politicas');
            return data;
        } catch (error) {
            throw error;
        }
    }

    const getClaves = async () => {
        try {
            const { data } = await digitalizadoProvider.get('/claves');
            return data;
        } catch (error) {
            throw error;
        }

    }

    const createClave = async body => {
        try {
            const response = await digitalizadoProvider.post('/claves', body);
            return response;
        } catch (error) {
            throw error;
        }
    }

    const updateClave = async (id, body) => {
        try {
            const response = await digitalizadoProvider.put(`/claves/${id}`, body);
            return response;
        } catch (error) {
            throw error;
        }
    }

    const getPoliticasLog = async id => {
        try {
            const { data } = await digitalizadoProvider.get(`/politicas/logs/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    const getClavesGrupo = async id => {
        try {
            const { data } = await digitalizadoProvider.get(`/claves/grupos/data/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    const addGroupToClave = async body => {
        try {
            const response = await digitalizadoProvider.post('/claves/grupos', body);
            return response;
        } catch (error) {
            throw error;
        }
    }

    const deleteGroupFromClave = async id => {
        try {
            const response = await digitalizadoProvider.delete(`/claves/grupos/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    }

    const addNewPolitica = async body => {
        try {
            const response = await digitalizadoProvider.post('/politicas', body);
            return response;
        } catch (error) {
            throw error;
        }
    }

    const getEmpresas = async () => {
        try {
            const {data} = await digitalizadoProvider.get('/empresas');
            return data;
        } catch (error) {
            throw error;
        }
    }

    const getPoliticaFile = async id => {
        try {
            const {data} = await digitalizadoProvider.get(`/politicas/logs/files/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    const getPoliticasList = async body => {
        try {
            const {data} = await digitalizadoProvider.post('/politicas/logs/files/list', body);
            return data;
        } catch (error) {
            throw error;
        }
    }

    const deletePoliticas = async body => {
        try {
            const response  = await digitalizadoProvider.delete(`politicas/?politicas=${body}`);
            return response
        } catch (error) {
            throw error;
        }
    }

    const updatePoliticaFile = async (id, body) => {
        try {
            const response  = await digitalizadoProvider.put(`politicas/log/${id}`, body);
            return response;
        } catch (error) {
            throw error;
        }
    }

    const addPoliticaLog = async body => {
        try {
            const response = await digitalizadoProvider.post('politicas/log', body);
            return response;
        } catch (error) {
            throw error;
        }
    }

    const updatePoliticaContainer = async (id, body) => {
        try {
            const response = await digitalizadoProvider.put(`politicas/description/${id}`, body);
            return response;
        } catch (error) {
            throw error;
        }
    }

    const deleteClave = async id => {
        try {
            const response = await digitalizadoProvider.delete(`claves/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    }

    return {
        getUserClave,
        getPoliticas,
        getClaves,
        createClave,
        updateClave,
        getPoliticasLog,
        getClavesGrupo,
        addGroupToClave,
        deleteGroupFromClave,
        addNewPolitica,
        getEmpresas,
        getPoliticaFile,
        getPoliticasList,
        deletePoliticas,
        updatePoliticaFile,
        addPoliticaLog,
        updatePoliticaContainer,
        deleteClave,
    }
}