import useEmployeeModalStore from '../../stores/useEmployeeModalStore';
import { shortName } from '../../utils/employee';
import CustomModal from '../Modal';

export default function ModalEmployee({ addEmployee }) {
    const { openEmployeeModal, toggleEmployeeModal, employees } = useEmployeeModalStore();
    const top = window.scrollY

    return (
        <CustomModal
            isOpen={openEmployeeModal}
            onRequestClose={toggleEmployeeModal}
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
                        onClick={() => addEmployee(emp)}
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
