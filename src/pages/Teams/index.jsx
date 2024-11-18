import React, { useEffect, useState } from "react";
import axios from "axios";
import TeamCard from "../../components/team"; // Importa o componente TeamCard
import SelectEmployee from "../../components/SelectEmployee"; // Importa o componente SelectEmployee
import PlusButton  from '../../components/addButton';

const TeamList = () => {
    const [teams, setTeams] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Carrega as equipes do banco de dados
    useEffect(() => {
        const fetchTeams = async () => {
            console.log("Fetching teams...");
            try {
                const response = await axios.get("http://localhost:3000/equipes");
                console.log(response.data); 
                console.log('response');
                setTeams(response.data);
            } catch (err) {
                console.error("Erro ao buscar equipes:", err);
            }
        };
    
        fetchTeams();
    }, []);

    // Função para remover a equipe da lista localmente após a exclusão
    const handleDelete = (id) => {
        setTeams(teams.filter(team => team.id !== id));
    };

    // Função para lidar com a seleção de um funcionário
    const handleEmployeeChange = (selectedOption) => {
        setSelectedEmployee(selectedOption);
        console.log("Funcionário selecionado:", selectedOption);
    };

    

    return (
        <>
            <div>
            <h1 style={styles.h1}>Lista de Equipes</h1>
                
                {teams.length > 0 ? (
                    teams.map((team) => (
                        <TeamCard key={team.id} team={team} onDelete={handleDelete} />
                    ))
                ) : (
                    <p>Nenhuma equipe encontrada.</p>
                )}


                <PlusButton />
            </div>
        </>
    );
};

const styles = {
    h1: {
        textAlign: 'center',
        margin: 0,
        padding: '20px 0',
    },
};


export default TeamList;
