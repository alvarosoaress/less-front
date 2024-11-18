import React, { useEffect, useState } from "react";
import axios from "axios";
import AddButtonModalTeam from "../addButtonModalTeam";

const EmployeeListModal = ({ team, onClose }) => {

    
    const [employees, setEmployees] = useState([]); // Estado para os funcionários vinculados
    const [loadingEmployees, setLoadingEmployees] = useState(false); // Estado para controle de loading
    

    useEffect(() => {
        const fetchEmployees = async () => {
            setLoadingEmployees(true); // Inicia o loading

            try {
                const response = await axios.get(`http://localhost:3000/equipes/${team.id}/funcionarios`);
                console.log(response)
                setEmployees(response.data); // Define os funcionários recebidos no estado
            } catch (error) {
                console.error("Erro ao buscar funcionários:", error);
            } finally {
                setLoadingEmployees(false); // Finaliza o loading
            }
        };

        fetchEmployees();
    }, [team.id]); // Dependência para refazer a requisição se o ID da equipe mudar

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await axios.get('http://localhost:3000/equipes/1'); // Substitua "1" pelo ID da equipe desejada
                setTeam(response.data);
            } catch (error) {
                console.error('Erro ao buscar a equipe:', error);
            }
        };

        fetchTeam();
    }, []);

    const handleDelete = async (employeeId) => {
        try {
            await axios.delete(`http://localhost:3000/equipes/${team.id}/funcionarios/${employeeId}`);
            setEmployees(employees.filter(employee => employee.id !== employeeId)); // Remove o funcionário da lista
        } catch (error) {
            console.error("Erro ao excluir funcionário:", error);
        }
    };

    return (
        <div style={styles.modalOverlay} className='z-[100]' onClick={onClose}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2>Equipe: {team.nome}</h2>

                {loadingEmployees ? (
                    <p>Carregando funcionários...</p>
                ) : (
                    <>
                        <h3>Funcionários Vinculados:</h3>
                        {employees.length > 0 ? (
                            <div>
                                {employees.map((employee) => (
                                    <div key={employee.id} style={styles.employeeCard}>
                                        <span>{employee.name}</span>
                                        <div 
                                            style={styles.deleteBox} 
                                            onClick={() => handleDelete(employee.id)}
                                        >
                                            X
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                        ) : (
                            <p>Nenhum funcionário vinculado.</p>
                        )}

                        
                    </>
                )}
                 <AddButtonModalTeam equipeId={team.id} />
            </div>
        </div>
    );
};

// Estilos do componente
const styles = {
    modalOverlay: {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        textAlign: "center",
        width: "300px", // Largura fixa para o modal
    },
    employeeCard: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        margin: "10px 0",
        border: "1px solid black",
        borderRadius: "8px",
        cursor: "pointer",
    },
    deleteBox: {
        width: "20px",
        height: "20px",
        backgroundColor: "red",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
    },
};

export default EmployeeListModal;
