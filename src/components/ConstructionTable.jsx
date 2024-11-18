import { shortenedDay, getRange } from "../utils/day";
import WorkDay from "./WorkDay";

import useEmployeeModalStore from "../stores/useEmployeeModalStore";
import { deleteFullConstruction, getUnallocatedEmployeesByConstruction } from "../service/apiService";
import { shortName } from "../utils/employee";

import { motion } from "framer-motion";
import moment from "moment";

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

    async function handleDeleteWork(idConstruction) {
        try {
            const startDate = moment.utc(activeWeek[0]).format('yyyy-MM-DD');
            const endDate = moment.utc(activeWeek[activeWeek.length -1 ]).format('yyyy-MM-DD');
            const res = await deleteFullConstruction(idConstruction, startDate, endDate)

            return res;
        } catch (error) {
            console.log(error)
        }
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
                    <h2 className="font-semibold text-[16px] uppercase">{data.code}</h2>
                    <span className="font-medium italic text-[#BEC3D2] text-[13px] capitalize">{data.name}</span>
                    <button className="ml-auto" onClick={() => handleDeleteWork(data.id)}>X</button>
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
                                    const formattedDay = moment.utc(day).format('yyyy-MM-DD');
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
