import React from 'react';
import { supabase } from "../../../supabaseClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import EmployeeEdit from "../Employee/EmployeeEdit";
import EmployeeCreate from "../Employee/EmployeeCreate";
import ConstructionCreate from "../Construction/ConstructionCreate";
import ConstructionEdit from "../Construction/ConstructionEdit";

const ControlCenter = () => {
  // User
  const [user, setUser] = useState(null);

  // Constructions
  const [showConstructionCreate, setShowConstructionCreate] = useState(false);
  const [showEditConstruction, setShowEditConstruction] = useState(false);
  const [selectedConstruction, setSelectedConstruction] = useState("");
  const [constructionInfo, setConstructionInfo] = useState(null);
  const [constructions, setConstructions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Employees
  const [showEmployeeCreate, setShowEmployeeCreate] = useState(false);
  const [showEditEmployee, setShowEditEmployee] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [employees, setEmployees] = useState([]);

  // Navegação
  const navigate = useNavigate();

  // Carrega Usuário
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    fetchUser();
  }, []);

  // Carrega Obras
  const fetchConstructions = async () => {
    const { data, error } = await supabase.from("construction").select("*");
    if (error) console.error("Erro ao buscar obras:", error.message);
    else setConstructions(data);
  };

  // Carrega Funcionários
  const fetchEmployees = async () => {
    const { data, error } = await supabase.from("employee").select("*");
    if (error) console.error("Erro ao buscar funcionários:", error.message);
    else setEmployees(data);
  };

  useEffect(() => {
    fetchConstructions();
    fetchEmployees();
  }, []);

  const handleSelectConstruction = async () => {
    if (selectedConstruction) {
      const { data, error } = await supabase
        .from("construction")
        .select("*")
        .eq("id", selectedConstruction)
        .single();

      if (error) {
        console.error("Erro ao buscar a obra selecionada:", error.message);
      } else {
        console.log("Dados da obra selecionada:", data);
        setConstructionInfo(data); // Atualiza o estado com as informações da obra selecionada
      }
    }
  };

  const handleDeleteConstruction = async () => {
    const { error } = await supabase
      .from("construction")
      .delete()
      .eq("id", constructionInfo?.id);
    if (error) {
      console.error("Erro ao deletar a obra:", error.message);
    } else {
      // Atualiza a lista de obras após a exclusão
      fetchConstructions();
      setConstructionInfo(null);
      setShowDeleteModal(false);
    }
  };

  const handleSelectEmployee = async () => {
    if (selectedEmployee) {
      const { data, error } = await supabase
        .from("employee")
        .select("*")
        .eq("id", selectedEmployee)
        .single();

      if (error) {
        console.error(
          "Erro ao buscar o funcionário selecionado:",
          error.message
        );
      } else {
        setEmployeeInfo(data); // Atualiza o estado com as informações do funcionário selecionado
      }
    }
  };

  const handleDeleteEmployee = async () => {
    const { error } = await supabase
      .from("employee")
      .delete()
      .eq("id", employeeInfo?.id);
    if (error) {
      console.error("Erro ao deletar o funcionário:", error.message);
    } else {
      fetchEmployees(); // Atualiza a lista de funcionários
      setEmployeeInfo(null);
    }
  };

  const updateConstructionInfo = (updatedConstruction) => {
    if (!updatedConstruction) {
      console.error("updatedConstruction é null ou indefinido");
      return;
    }
    setConstructions((prev) => 
      prev.map((construction) => 
        construction.id === updatedConstruction.id ? updatedConstruction : construction
      )
    );
    fetchConstructions();
  };
  

  const updateEmployeeInfo = (updatedEmployee) => {
    setEmployeeInfo(updatedEmployee);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm(
      "Tem certeza que deseja encerrar a sua sessão?"
    );
    if (confirmLogout) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Erro ao sair:", error.message);
      } else {
        setUser(null);
        navigate("/login");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
  <NavBar user={user} onLogout={handleLogout} />
  
  {/* Remove a margem superior para dispositivos móveis */}
  <div className="min-h-screen bg-white flex flex-col items-center py-4">
    
    {/* Seção de controle: funcionários e obras uma abaixo da outra em dispositivos móveis */}
    <div className="w-full max-w-md px-4 space-y-8">
      
      {/* Seção para funcionários */}
      <div>
        <select
          className="border border-gray-300 p-2 rounded w-full"
          value={selectedEmployee}
          onChange={(e) => {
            if (e.target.value === "new") {
              setShowEmployeeCreate(true); // Abre o modal de criação
              setSelectedEmployee(null);  // Reseta a seleção
            } else {
              setSelectedEmployee(e.target.value);
            }
          }}
        >
          <option value="">Selecione um funcionário</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
          <option value="new">-- Incluir novo Funcionário --</option>
        </select>

        <button
          onClick={handleSelectEmployee}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded mt-2"
        >
          OK
        </button>

        {/* Card de informações do funcionário */}
        {employeeInfo && (
          <div className="card bg-gray-100 shadow-lg rounded-lg p-4 mt-4">
            <h2 className="text-xl font-semibold text-center mb-2">
              {employeeInfo.name}
            </h2>
            <p className="text-gray-700">
              <strong>Especialidade:</strong> {employeeInfo.role}
            </p>
            <p className="text-gray-700">
              <strong>Diária:</strong> R$ {employeeInfo.daily_value.toFixed(2)}
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => setShowEditEmployee(true)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
              >
                Editar
              </button>
              <button
                onClick={handleDeleteEmployee}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
              >
                Deletar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Seção para obras */}
      <div>
        <select
          className="border border-gray-300 p-2 rounded w-full"
          value={selectedConstruction}
          onChange={(e) => {
            if (e.target.value === "new") {
              setShowConstructionCreate(true); // Abre o modal para criar nova obra
            } else {
              setSelectedConstruction(e.target.value); // Seleciona a obra existente
            }
          }}
        >
          <option value="">Selecione uma obra</option>
          {constructions.map((construction) => (
            <option key={construction.id} value={construction.id}>
              {construction.name}
            </option>
          ))}
          <option value="new">-- Incluir nova Obra --</option>
        </select>

        <button
          onClick={handleSelectConstruction}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded mt-2"
        >
          OK
        </button>

        {/* Card de informações da obra */}
        {constructionInfo && (
          <div className="card bg-gray-100 shadow-lg rounded-lg p-4 mt-4">
            <h2 className="text-xl font-semibold text-center mb-2">
              {constructionInfo.name}
            </h2>
            <p className="text-gray-700">
              <strong>Código:</strong> {constructionInfo.code}
            </p>
            <p className="text-gray-700">
              <strong>Apelido:</strong> {constructionInfo.name}
            </p>
            <p className="text-gray-700">
              <strong>Endereço:</strong> {constructionInfo.address}
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => setShowEditConstruction(true)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
              >
                Editar
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
              >
                Deletar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>

  {/* Modais para criar/editar obras e funcionários */}
  {showEmployeeCreate && (
    <EmployeeCreate onClose={() => setShowEmployeeCreate(false)} />
  )}
  {showEditEmployee && (
    <EmployeeEdit
      employeeId={employeeInfo.id}
      onClose={() => {
        setShowEditEmployee(false);
        handleSelectEmployee();
      }}
      onEmployeeUpdated={updateEmployeeInfo}
    />
  )}
  {showConstructionCreate && (
    <ConstructionCreate onClose={() => setShowConstructionCreate(false)} />
  )}
  {showEditConstruction && (
    <ConstructionEdit
      constructionId={constructionInfo.id}
      onClose={() => {
        setShowEditConstruction(false);
        handleSelectConstruction();
      }}
      onConstructionUpdated={updateConstructionInfo}
    />
  )}

  {/* Modal de confirmação para deletar obra */}
  {showDeleteModal && (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
        <p className="text-center text-gray-700 mb-4">
          Tem certeza que deseja deletar esta obra?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleDeleteConstruction}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
          >
            Deletar
          </button>
          <button
            onClick={() => setShowDeleteModal(false)}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )}
</div>

  );
};

export default ControlCenter;
