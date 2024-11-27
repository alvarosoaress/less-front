import { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css'
import useEmployeeModalStore from '../../stores/useEmployeeModalStore';
import { deleteEmpWork, getEmployee, getUnallocatedEmployeesByConstruction, putEmpWork, putWorkFull } from '../../service/apiService';
import CustomModal from '../Modal';
import { toCurrency } from '../../utils/employee';
import SelectEmployee from '../SelectEmployee';
import { getRange } from '../../utils/day';
import useDateStore from '../../stores/useDateStore';

export default function ModalEditDay() {
    const { openEditDayModal, toggleEditDayModal, employeeEdit } = useEmployeeModalStore();
    const { activeWeek, refreshConstructions } = useDateStore();
    const { workDayData, constructionID, employeeID, day } = employeeEdit;
    const top = window.scrollY

    const [employees, setEmployees] = useState([]);
    const [price, setPrice] = useState(workDayData?.daily_value || 0);
    const [workDay, setWorkDay] = useState(workDayData?.time_worked || 0);
    const [selectedEmployee, setSelectedEmployee] = useState();

    useEffect(() => {
        if (workDayData) {
            setPrice(workDayData.daily_value || 0);
            setWorkDay(workDayData.time_worked || 0);
            setSelectedEmployee(employees.find((x) => x.value == employeeID))
        }

        if(constructionID){
            async function fetchEmployees() {
                try {
                    const { first, last } = getRange(activeWeek)
        
                    const result = await getUnallocatedEmployeesByConstruction({
                        startDate: first,
                        endDate: last,
                        id_construction: constructionID
                    })

                    result.sort((a,b) => b.name < a.name)
            
                    let resTreated = result.map((emp) => ({ 
                        value: emp.id, label: emp.name, work_value: emp.daily_value, color: emp.color, textColor: emp.color_text 
                    }))
                    
                    setEmployees(resTreated)
                } catch (error) {
                    console.log(error)
                }
            }

            async function fetchEmployee() {
                try {
                    const result = await getEmployee({
                        employeeID 
                    })

                    let resTreated = { 
                        value: result.id, label: result.name, work_value: result.daily_value, color: result.color, textColor: result.color_text 
                    }

                    setSelectedEmployee(resTreated)
                } catch (error) {
                    console.log(error)
                }
            }

            fetchEmployees();
            fetchEmployee();
        }
    }, [workDayData, openEditDayModal]);

    const handleWorkDayChange = (e) => {
        const value = e.currentTarget.value;
        const numericValue = Number(value.replace(/\D/g, '')) / 100;
        setWorkDay(numericValue >= 365 ? 365 : numericValue.toFixed(2));
    };

    const handlePriceChange = (e) => {
        const value = e.currentTarget.value;
        const numericValue = parseFloat(value.replace(/\D/g, '')) / 100;
        setPrice(Math.min(numericValue, 999999.99));
    };

    async function handleConfirm() {
        try {
            if(employeeID !== selectedEmployee){
                await putEmpWork(selectedEmployee.value, employeeID, day, constructionID);
            }

            await putWorkFull(workDayData.id_work, price, workDay)

            refreshConstructions(activeWeek)
            toggleEditDayModal();
        } catch (error) {
            console.log(error.message);
        }
    }

    async function handleDelete() {
        try {
            await deleteEmpWork(employeeID, day, constructionID)

            refreshConstructions(activeWeek)
            toggleEditDayModal();
        } catch (error) {
            console.log(error.message);
        }
    }

    const total = price * workDay;

    return (
        <CustomModal isOpen={openEditDayModal} onRequestClose={toggleEditDayModal} top={top} >
            <div>
                <p className='no-select'>Pessoas</p>
                <SelectEmployee 
                    employees={employees} 
                    onChange={setSelectedEmployee} 
                    value={selectedEmployee} 
                />
            </div>
            <div>
                <p className='no-select'>Dia trabalhado</p>
                <input
                    value={workDay}
                    onChange={handleWorkDayChange}
                    className="modal-input"
                    type="text"
                    inputMode="numeric"
                />
            </div>
            <div>
                <p className='no-select'>Valor Diária</p>
                <input value={toCurrency(price)} onChange={handlePriceChange} className="modal-input" type="text" inputMode="numeric" />
            </div>
            <div className="modal-footer">
                <p>Valor total: {toCurrency(total)}</p>
                <div className='flex gap-5'>
                    <button 
                        onClick={handleDelete} 
                        className="justify-center px-4 py-1 text-center text-white bg-red-500 rounded-lg align-center"
                        >
                        Excluir
                    </button>
                    <button 
                        onClick={handleConfirm} 
                        className="justify-center px-4 py-1 text-center text-white bg-blue-500 rounded-lg align-center"
                        >
                        Confirmar
                    </button>
                </div>
            </div>
        </CustomModal>
    );
}