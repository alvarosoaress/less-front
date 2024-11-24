import axios from "axios";
import moment from "moment";

const token = import.meta.env.VITE_API_KEY;

const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    (config) => {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getFreeConstructionsByRange = async (startDate, endDate) => {
    try {
        const response = await apiClient.get(`/unallocatedConstruction`, {
            params: {
                startDate: startDate,
                endDate: endDate
            }
        });
        return response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export const getWorksByRange = async (startDate, endDate) => {
    try {
        const response = await apiClient.get(`/worksByRange`, {
            params: {
                startDate: startDate,
                endDate: endDate
            }
        });
        return response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export const getWorksDate = async () => {
    try {
        const response = await apiClient.get(`/worksDate`);
        return response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export const postWorks = async (workData) => {
    try {
        const response = await apiClient.post(`/works`, workData);
        return response.data;
    } catch (err) {
        console.log(err.message);
        return null;
    }
};

export const getUnallocatedEmployeesByConstruction = async (data) => {
    try {
        const response = await apiClient.get(`/unallocatedEmployeesByConstruction`, {
            params: data
        });
        return response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export const getUnallocatedEmployees = async (data) => {
    try {
        const response = await apiClient.get(`/unallocatedEmployees`, {
            params: data
        });
        return response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export const putWork = async (id_work, time_worked) => {
    try {
        const response = await apiClient.put(`/work`, {
            id: id_work,
            time_worked: time_worked
        });
        return response.data;
    } catch (err) {
        console.log(err.message);
        return null;
    }
};

export const putWorkFull = async (id_work, daily_value, time_worked) => {
    try {
        const response = await apiClient.put(`/workFull`, {
            id_work,
            time_worked,
            daily_value
        });
        return response.data;
    } catch (err) {
        console.log(err.message);
        return null;
    }
};

// Constructions
//GET
export const getConstruction = async () => {
    try {
        const response = await apiClient.get(`/construction`,);
        return response.data;
    } catch (err) {
        console.log(err.message);
        return null;
    }
};

//POST (Criação de nova construção)
export const createConstruction = async (constructionData) => {
    try {
        const response = await apiClient.post(`/construction`, constructionData);
        return response.data;
    } catch (err) {
        console.error("Erro ao criar construção:", err.message);
        return null;
    }
};

//UPDATE (Atualizar construção existente)
export const updateConstruction = async (id, constructionData) => {
    try {
        const response = await apiClient.put(`/construction/${id}`, constructionData);
        return response.data;
    } catch (err) {
        console.error("Erro ao atualizar construção:", err.message);
        return null;
    }
};

//DELETE (Deletar construção existente)
export const deleteConstruction = async (id) => {
    try {
        const response = await apiClient.delete(`/construction/${id}`);
        return response.data;
    } catch (err) {
        console.error("Erro ao deletar construção:", err.message);
        return null;
    }
};

export const getConstructionSummary = async (startDate, endDate) => {
    try {
        const response = await apiClient.get(`/constructionSummaryByRange`, {
            params: {
                startDate: startDate,
                endDate: endDate
            }
        });
        return response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export const deleteFullConstruction = async (id_construction, startDate, endDate) => {
    try {
        const response = await apiClient.delete(`/fullConstruction`, { data: { id_construction, startDate, endDate } });
        return response.data;
    } catch (err) {
        console.error("Erro ao deletar construção:", err.message);
        return null;
    }
};

export const getEmployees = async () => {
    try {
        const response = await apiClient.get(`/employees`,);
        return response.data;
    } catch (err) {
        console.log(err.message);
        return null;
    }
};

export const getEmployee = async (employeeID) => {
    try {
        const response = await apiClient.get(`/employee`, { params: employeeID });
        return response.data;
    } catch (err) {
        console.log(err.message);
        return null;
    }
};

export const putEmpWork = async (new_id_employee, old_id_employee, date, id_construction) => {
    try {
        const response = await apiClient.put(`/changeWorkEmp`, {
            new_id_employee, old_id_employee, date, id_construction
        });
        return response.data;
    } catch (err) {
        console.log(err.message);
        return null;
    }
};

export const deleteEmpWork = async (id_employee, date, id_construction) => {
    try {
        const response = await apiClient.delete(`/workEmp`, {
            data: { id_employee, date, id_construction }
        });
        return response.data;
    } catch (err) {
        console.log(err.message);
        return null;
    }
};

export const getEmployeeSummary = async (startDate, endDate) => {
    startDate = moment(startDate).format('yyyy-MM-DD');
    endDate = moment(endDate).format('yyyy-MM-DD');

    try {
        const response = await apiClient.get(`/worksSummaryByRange`, {
            params: {
                startDate: startDate,
                endDate: endDate
            }
        });
        return response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export const getWeeklyReport = async (startDate, endDate) => {
    try {
        const response = await apiClient.get(`/weeklyReport`, { params: { startDate, endDate } });
        return response.data;
    } catch (err) {
        console.log(err.message);
        return null;
    }
}