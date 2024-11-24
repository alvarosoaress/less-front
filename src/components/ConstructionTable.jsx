import { shortenedDay, getRange } from "../utils/day";
import WorkDay from "./WorkDay";

import useEmployeeModalStore from "../stores/useEmployeeModalStore";
import { deleteFullConstruction, getUnallocatedEmployeesByConstruction } from "../service/apiService";
import { shortName } from "../utils/employee";

import TrashIcon from "../assets/icons/trash.svg"

import { motion } from "framer-motion";
import moment from "moment";
import useDeleteModalStore from "../stores/useDeleteModalStore";
import { useState } from "react";

const tableVariants = {
    initial: {
        opacity: 0
    },
    active: {
        opacity: 1
    },
    exit: {
        opacity: 0
    },
};

export default function ConstructionTable({ data, activeWeek }) {
    const { toggleEmployeeModal, setEmployees, openEmployeeModal } = useEmployeeModalStore()
    const { toggleDeleteModal, openDeleteModal, setDeleteID } = useDeleteModalStore()
    const [initialY, setInitialY] = useState(0)

    const handleAddEmployee = async () => {
        if(openEmployeeModal) return

        toggleEmployeeModal()

        const { first, last } = getRange(activeWeek)

        const result = await getUnallocatedEmployeesByConstruction({
            startDate: first,
            endDate: last,
            id_construction: data.id
        })

        result.sort((a, b) => b.name < a.name)

        setEmployees(result);
    }

    let timer;
    let touchDuration = 650;

    function onLongTouch() {
        timer = null;
        if(window.scrollY != initialY || openDeleteModal) return
        if(window.screen.width < 600 ) navigator.vibrate(100);
        setDeleteID(data.id);
        toggleDeleteModal();
    }

    function touchstart(e) {
        e.preventDefault();
        setInitialY(window.scrollY);

        if (!timer) {
            timer = setTimeout(onLongTouch, touchDuration);
        }
    }

    function touchend() {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    }

    // previne o menu de contexto padrão ao segurar o toque
    function handleContextMenu(e) {
        e.preventDefault();
    }

    return (
        <motion.div
            className="flex flex-col border-[1px] border-[#555555] rounded-[3px] bg-white"
            variants={tableVariants}
            initial="initial"
            animate="active"
            exit="exit"
            transition={{ duration: 0.25 }}
        >
            <div className="flex items-center justify-between p-2">
                <div className="flex items-center w-full gap-2">
                    <button
                        onTouchStart={touchstart}
                        onTouchEnd={touchend}
                        onContextMenu={handleContextMenu}
                    >
                        <h2 className="font-semibold text-[16px] uppercase">{data.code}</h2>
                    </button>
                    <span className="font-medium italic text-[#BEC3D2] text-[13px] capitalize">{data.name}</span>
                    {/* <img width={15} src={TrashIcon} className="ml-auto cursor-pointer" onClick={() => handleDeleteWork(data.id)}/> */}
                </div>
            </div>
            <table className="w-full border-collapse table-auto">
                <thead>
                    <tr>
                        <th className="w-20 h-10"></th>
                        {activeWeek.map((day, index) => (
                            (new Date(day).getDay() !== 0) ? (
                                <th className="w-20 h-10 px-2 py-1" key={index}>
                                    {shortenedDay(day).toUpperCase()}
                                </th>
                            ) : null
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* <tr>
                        <th className="w-20 h-10 border"></th>
                        {activeWeek.map((day, index) =>
                            (new Date(day).getDay() !== 0) ? (
                                <td className="w-20 h-10 px-2 py-1 italic font-light text-center text-gray-300 border" key={index}>
                                    {day.getDate()}
                                </td>
                            ) : null
                        )}
                    </tr> */}
                    {data && data.works.map(employee => (
                        <tr key={employee.id_employee} className="odd:bg-[#F6F6F6]">
                            <td className="w-20 h-10 px-2 text-center">
                                <div style={{ backgroundColor: employee.employee_color, color: employee.employee_color_text }} className="flex items-center justify-center text-xs font-bold rounded-full w-7 h-7">
                                    {shortName(employee.name_employee)}
                                </div>
                            </td>
                            {activeWeek.map(day => {
                                if ((new Date(day).getDay() !== 0)) {
                                    const formattedDay = moment(day).format('yyyy-MM-DD');
                                    const workDay = employee.work_days.find(wd => moment.utc(wd.date).format('yyyy-MM-DD') === formattedDay);

                                    return (
                                        <WorkDay
                                            key={day}
                                            workDayData={workDay}
                                            timeWorkedExists={workDay ? true : false}
                                            day={day}
                                            employeeID={employee.id_employee}
                                            constructionID={data.id}
                                        />
                                    );
                                }
                            })}
                        </tr>
                    ))}
                    <tr>
                        <th colSpan="7" className="w-full h-10 border-none outline-none cursor-pointer" onClick={handleAddEmployee}>
                            +
                        </th>
                    </tr>
                </tbody>
            </table>
        </motion.div>
    )
}
