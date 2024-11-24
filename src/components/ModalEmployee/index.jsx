import { useState } from 'react';
import useEmployeeModalStore from '../../stores/useEmployeeModalStore';
import { shortName } from '../../utils/employee';
import CustomModal from '../Modal';
import { postWorks } from '../../service/apiService';
import useDateStore from '../../stores/useDateStore';
import moment from 'moment';

export default function ModalEmployee() {
    const { openEmployeeModal, employees, closeEmployeeModal} = useEmployeeModalStore();
    const [loading, setLoading] = useState(false);
    const { activeWeek, refreshConstructions } = useDateStore();
    const top = window.scrollY

    const addEmployee = async (employee) => {
        try {
            const array = activeWeek.map(day => ({
                id_employee: employee.id,
                id_construction: employee.id_construction,
                date: moment(day).format('YYYY-MM-DD'),
                time_worked: 0,
                work_value: employee.daily_value
            }))

            closeEmployeeModal();

            setLoading(true);
            await postWorks(array)
            setLoading(false);
    
            refreshConstructions(activeWeek);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <CustomModal
            isOpen={openEmployeeModal && !loading}
            onRequestClose={closeEmployeeModal}
            contentLabel="Escolha um funcionário"
            style={{
                content: {
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "65%",
                    width: "100%",
                    padding: 0
                },
                overlay: {
                    alignItems: "end",
                    top: top
                }
            }}
        >
            {employees.length ? employees.map(emp => {
                return (
                    <button
                        key={emp.id}
                        className="flex items-center w-full gap-2 py-3 border px-7 text-start no-select"
                        disabled={loading || !openEmployeeModal}
                        onClick={() => !openEmployeeModal ? null : addEmployee(emp)}
                    >
                        <div className="flex items-center justify-center text-xs font-bold rounded-full w-7 h-7 no-select"
                            style={{ backgroundColor: emp.color, color: emp.color_text }}>
                            {shortName(emp.name)}
                        </div>
                        <span>{emp.name}</span>
                    </button>
                );
            }) : (
                <h1 className="my-5 text-lg text-center font-500 no-select">Todos os funcionários já estão na obra</h1>
            )}
        </CustomModal>
    );
}
