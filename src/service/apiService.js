import axios from "axios";

export const getFreeConstructionsByRange = async (startDate, endDate) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/unallocatedConstruction`, {
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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/worksByRange`, {
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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/worksDate`);
        return response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export const postWorks = async (workData) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/works`, workData);
        return response.data;
    } catch (err) {
        console.log(err.message);
        return null;
    }
};

export const getUnallocatedEmployeesByConstruction = async (data) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/unallocatedEmployeesByConstruction`, {
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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/unallocatedEmployees`, {
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
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/work`, {
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
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/workFull`, {
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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/construction`,);
        return response.data;
    } catch (err) {
        console.log(err.message);
        return null;
    }
};
      
//POST (Criação de nova construção)
export const createConstruction = async (constructionData) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/construction`, constructionData);
        return response.data;
    } catch (err) {
        console.error("Erro ao criar construção:", err.message);
        return null;
    }
};

//UPDATE (Atualizar construção existente)
export const updateConstruction = async (id, constructionData) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/construction/${id}`, constructionData);
        return response.data;
    } catch (err) {
        console.error("Erro ao atualizar construção:", err.message);
        return null;
    }
};

//DELETE (Deletar construção existente)
export const deleteConstruction = async (id) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/construction/${id}`);
        return response.data;
    } catch (err) {
        console.error("Erro ao deletar construção:", err.message);
        return null;
    }
};

export const deleteFullConstruction = async (id_construction, startDate, endDate) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/fullConstruction`, { data: { id_construction, startDate, endDate } });
        return response.data;
    } catch (err) {
        console.error("Erro ao deletar construção:", err.message);
        return null;
    }
};

export const getEmployees = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/employees`,);
        return response.data;
    } catch (err) {
        console.log(err.message);
        return null;
    }
};

export const getEmployee = async (employeeID) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/employee`, { params: employeeID });
        return response.data;
    } catch (err) {
        console.log(err.message);
        return null;
    }
};

export const putEmpWork = async (new_id_employee, old_id_employee, date, id_construction) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/changeWorkEmp`, {
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
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/workEmp`, {
            data: { id_employee, date, id_construction }
        });
        return response.data;
    } catch (err) {
        console.log(err.message);
        return null;
    }
};

export const getWeeklyReport = async(startDate, endDate) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/weeklyReport`, { params: { startDate, endDate } });
        return response.data;
    } catch (err) {
        console.log(err.message);
        return null;
    }
}