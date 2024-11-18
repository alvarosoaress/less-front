

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import EmployeeEdit from '../Employee/EmployeeEdit';
import EmployeeCreate from '../Employee/EmployeeCreate';
import EmployeeCard from '../../components/EmployeeCard';
import Button from '../../components/Button';
import { AnimatePresence } from 'framer-motion';

const Employee = () => {

    const [user, setUser] = useState(null);

    const [employees, setEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const employeesPerPage = 7;

    const [showEmployeeCreate, setShowEmployeeCreate] = useState(false);
    const [showEditEmployee, setShowEditEmployee] = useState(false);
    const [employeeInfo, setEmployeeInfo] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [reload, setReload] = useState(0)

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            setUser(session?.user ?? null);


            if (!session) {
                navigate('/login');
            }
        };
        fetchUser();
    }, [navigate]);

    useEffect(() => {
        const fetchEmployees = async () => {
            const { data, error } = await supabase.from('employee').select('*');
            if (error) {
                console.error('Erro ao buscar funcionários:', error.message);
            } else {
                console.log(data.sort((a,b) => a.name > b.name))
                setEmployees(data);
            }
        };
        fetchEmployees();
    }, [reload]);

    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const totalPages = Math.ceil(employees.length / employeesPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Função para selecionar um funcionário e exibir detalhes
    const handleSelectEmployee = (employee) => {
        // Atualiza o estado com as informações do funcionário selecionado
        setEmployeeInfo((prev) => (prev?.id === employee.id ? null : employee));
    };

    const handleDeleteEmployee = async () => {
        if (!employeeInfo) return;

        const { error } = await supabase
            .from('employee')
            .delete()
            .eq('id', employeeInfo.id);

        if (error) {
            console.error('Erro ao deletar o funcionário:', error.message);
        } else {

            setEmployees((prev) => prev.filter((e) => e.id !== employeeInfo.id));
            setEmployeeInfo(null);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full h-full p-2 overflow-y-scroll">
            <div className='flex flex-col w-full h-full gap-3 overflow-y-scroll'>
                <AnimatePresence>
                    {
                        employees.map(emp =>
                            <EmployeeCard
                                key={emp.id}
                                data={emp}
                                onClick={() => {
                                    handleSelectEmployee(emp)
                                    setShowEditEmployee(true)
                                }}
                                onDelete={() => {
                                    handleSelectEmployee(emp)
                                    setShowDeleteModal(true)
                                }}
                            />
                        )
                    }
                </AnimatePresence>
            </div>
            <div className='w-full p-3'>
                <Button
                    title="+"
                    enabled={true}
                    className="w-full py-2 font-extrabold rounded-md"
                    onClick={() => {
                        setShowEmployeeCreate(true)
                    }}
                />
            </div>

            {/* Modal para criar novo funcionário */}
            <AnimatePresence>
                {showEmployeeCreate && (
                    <EmployeeCreate
                        onClose={() => setShowEmployeeCreate(false)}
                        onEmployeeCreated={() => {
                            setShowEmployeeCreate(false)
                            setReload(reload + 1)
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Modal para editar funcionário */}
            <AnimatePresence>
                {showEditEmployee && (
                    <EmployeeEdit
                        employeeId={employeeInfo?.id}
                        onClose={() => {
                            setShowEditEmployee(false);
                            handleSelectEmployee(employeeInfo);
                        }}
                        onEmployeeUpdated={(updatedEmployee) => {
                            setEmployees((prev) =>
                                prev.map((e) => (e.id === updatedEmployee.id ? updatedEmployee : e))
                            );
                            setEmployeeInfo(updatedEmployee);
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Modal de confirmação para deletar funcionário */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="max-w-sm p-8 bg-white rounded-lg shadow-lg">
                        <p className="mb-4 text-center text-gray-700">
                            Tem certeza que deseja deletar este funcionário?
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleDeleteEmployee}
                                className="px-4 py-2 text-white transition bg-red-500 rounded hover:bg-red-600"
                            >
                                Deletar
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-white transition bg-gray-500 rounded hover:bg-gray-600"
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

export default Employee;
