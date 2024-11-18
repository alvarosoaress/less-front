import React, { useEffect, useState } from "react";
import axios from "axios";
import SelectEmployee from "./SelectEmployee"; 
import PlusButton  from '../components/addButton';
import TeamEmployeesModal from "../components/ModalTeam";


const TeamCard = ({ team, onDelete }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null); 
    const [employees, setEmployees] = useState([]); 
    const [loadingEmployees, setLoadingEmployees] = useState(false); 
    const openModal = async () => {
        setLoadingEmployees(true); 
        setModalOpen(true);

        try {

            const response = await axios.get(`http://localhost:3000/equipes/${team.id}/funcionarios`);
            setEmployees(response.data); 
            console.log(response)
        } catch (error) {
            console.error("Erro ao buscar funcionários:", error);
        } finally {
            setLoadingEmployees(false); 
        }
    };


    const closeModal = () => {
        setModalOpen(false);
        setSelectedEmployee(null); 
        setEmployees([]); 
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/equipes/${team.id}`);
            onDelete(team.id); // Chama a função de callback para atualizar a lista após a exclusão
        } catch (err) {
            console.error("Erro ao excluir equipe:", err);
        }
    };

    const handleEmployeeChange = (selectedOption) => {
        setSelectedEmployee(selectedOption);
        console.log("Funcionário selecionado:", selectedOption);
    };

    return (
        <div className='z-[100]'>
            <div style={styles.teamCard} onClick={openModal}>
                <span>{team.nome}</span>
                <div style={styles.deleteBox} onClick={(e) => {
                    e.stopPropagation(); // Evita a abertura do modal ao clicar no "X"
                    handleDelete();
                }}>
                    X
                </div>
            </div>

            {isModalOpen && (
            <TeamEmployeesModal team={team} onClose={closeModal} />
            )}
        </div>
    );
};

// Estilos do componente
const styles = {
    teamCard: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        border: "1px solid black",
        borderRadius: "8px",
        cursor: "pointer",
        position: "relative",
        width: "calc(100% - 20px)",
        height: "50px",
        margin: "0 10px 10px 10px",
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
    },
};

export default TeamCard;
