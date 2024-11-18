import React, { useState } from 'react';
import axios from 'axios';

const PlusButtonWithModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Função para abrir o modal
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // Função para fechar o modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setName(''); // Limpa o campo de nome ao fechar o modal
        setErrorMessage('');
    };

    // Função para enviar o nome para o servidor
    const handleConfirm = async () => {
        if (!name) {
            setErrorMessage('O campo de nome não pode estar vazio.');
            return;
        }

        try {

            const response = await axios.post('http://localhost:3000/equipes', {
                nome: name,
            });

            console.log('Nome enviado com sucesso!', response.data);

            handleCloseModal();
        } catch (error) {
            console.error('Erro ao enviar o nome:', error);
            setErrorMessage('Erro ao enviar o nome. Tente novamente.');
        }
    };

    return (
        <div>
            {/* Botão de "+" */}
            <button style={styles.button} onClick={handleOpenModal}>
                <span style={styles.plus}>+</span>
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h2>Escolha um nome para a equipe</h2>

                        {/* Input para o nome */}
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite um nome"
                            style={styles.input}
                        />
                        
                        {errorMessage && <p style={styles.error}>{errorMessage}</p>}

                        {/* Botões de ação */}
                        <div style={styles.buttonGroup}>
                            <button onClick={handleConfirm} style={styles.confirmButton}>Confirmar</button>
                            <button onClick={handleCloseModal} style={styles.cancelButton}>Cancelar</button>
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
    input: {
        width: '80%',
        padding: '8px',
        marginBottom: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-between',
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

export default PlusButtonWithModal;
