import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeList from "./employeeList"; // Certifique-se de que o caminho está correto

const AddButtonModalTeam = ({ equipeId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // Função para abrir o modal
    const handleOpenModal = async () => {
        await fetchEmployees(); // Atualiza a lista de funcionários
        setIsModalOpen(true);
    };

    // Função para fechar o modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEmployee(null);
        setErrorMessage('');
    };


    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:3000/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
            setErrorMessage('Erro ao buscar pessoas. Tente novamente.');
        }
    };


    const handleConfirm = async () => {
        if (!selectedEmployee) {
            setErrorMessage('Por favor, selecione uma pessoa.');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:3000/equipes/funcionarios', {
                funcionarioId: selectedEmployee.id,
                equipeId: equipeId // Passa o ID da equipe selecionada
            });
            console.log('Pessoa adicionado à equipe com sucesso!', response.data);
    
     
            setEmployees(prevEmployees => [
                ...prevEmployees,
            ]);
    
            handleCloseModal();
        } catch (error) {
            console.error('Erro ao adicionar funcionário à equipe:', error);
            setErrorMessage('Erro ao adicionar funcionário à equipe. ' + (error.response?.data?.error || 'Tente novamente.'));
        }
    };

    return (
        <div>
          
            <button style={styles.button} onClick={handleOpenModal}>
                <span style={styles.plus}>+</span>
            </button>

            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h2>Escolha um funcionário para a equipe</h2>
                        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
                        
                        <EmployeeList 
                            employees={employees} 
                            onSelect={(employee) => setSelectedEmployee(employee)} // Define o funcionário selecionado
                        />

                        <div style={styles.buttonGroup}>
                            <button style={styles.confirmButton} onClick={handleConfirm}>Adicionar Funcionário</button>
                            <button style={styles.cancelButton} onClick={handleCloseModal}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Estilos do botão e modal
const styles = {
    button: {
        backgroundColor: '#4285F4',
        border: 'none',
        borderRadius: '50px',
        width: 'calc(100% - 20px)',
        height: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        margin: '0 10px',
    },
    plus: {
        color: '#fff',
        fontSize: '18px',
        fontWeight: 'bold',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginRight: '10px',
    },
    cancelButton: {
        backgroundColor: '#f44336',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        marginBottom: '10px',
    },
};

export default AddButtonModalTeam;
