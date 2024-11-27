import { motion } from "framer-motion";
import { shortName, toCurrency } from "../../utils/employee";

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

function SummaryWrapper({ title, children }) {
    return (
        <motion.div
            className="flex flex-col border-[1px] w-full border-[#555555] rounded-[3px] bg-white"
            variants={tableVariants}
            initial="initial"
            animate="active"
            exit="exit"
            transition={{ duration: 0.25 }}
        >
            <div className="flex items-center justify-between p-2">
                <div className="flex items-center w-full gap-2">
                    <h2 className="font-semibold text-[16px]">{title}</h2>
                    {/* <span className="font-medium italic text-[#BEC3D2] text-[13px] capitalize">{construction.name}</span> */}
                </div>
            </div>
            <table className="w-full border-collapse table-auto">
                <thead>
                </thead>
                <tbody>
                    {children}
                </tbody>
            </table>
        </motion.div>
    )
}

function calculateTotals(data) {
    const totalsConstructions = [];
    const totalsEmployee = [];

    data.forEach(group => {
        group.works.forEach(employee => {
            const total = employee.work_days.reduce(
                (sum, day) => sum + parseFloat(day.daily_value || 0) * parseFloat(day.time_worked || 0),
                0
            );

            const empInd = totalsEmployee.findIndex((x) => employee.id_employee == x.id);
            const consInd = totalsConstructions.findIndex((x) => group.id == x.id);

            if (empInd >= 0) {
                totalsEmployee[empInd].total_value += total;
            } else {
                totalsEmployee.push({
                    id: employee.id_employee,
                    name: employee.name_employee,
                    color: employee.employee_color,
                    color_text: employee.color_text,
                    total_value: total
                });
            }

            if (consInd >= 0) {
                totalsConstructions[consInd].total_value += total;
            } else {
                totalsConstructions.push({
                    id: group.id,
                    name: group.name,
                    code: group.code,
                    total_value: total
                });
            }
        });
    });

    return [totalsConstructions, totalsEmployee];
};

export default function Summary({ data }) {
    const formattedData = data.map((x) => ({ works: x.works, id: x.id, name: x.name, code: x.code }))
    const [constructions, employees] = calculateTotals(formattedData)

    return (
        <div className="flex justify-around gap-2">
            <SummaryWrapper title={"Obras"} children={(
                <>
                    {constructions.sort((a, b) => a.code > b.code).map(cons => (
                        <tr key={cons.id} className="odd:bg-[#F6F6F6]">
                            <td className="w-20 h-10 px-2 text-center">
                                <div className="flex items-center justify-center text-xs font-bold rounded-full w-7 h-7">
                                    {cons.code}
                                </div>
                            </td>
                            <td className={`px-2 py-1 text-center`}>
                                {toCurrency(cons.total_value)}
                            </td>
                        </tr>
                    ))}

                    <tr>
                        <td className="pl-2 text-sm font-bold">Total</td>
                        <td className="text-sm font-bold p-2 text-center">
                            {toCurrency(constructions.reduce((acc, cons) => acc + Number(cons.total_value), 0))}
                        </td>
                    </tr>
                </>
            )
            } />

            <SummaryWrapper title={"Pessoas"} children={(
                <>
                    {employees.sort((a, b) => a.name > b.name).map(employee => (
                        <tr key={employee.id} className="odd:bg-[#F6F6F6]">
                            <td className="w-20 h-10 px-2 text-center">
                                <div style={{ backgroundColor: employee.color, color: employee.color_text }}
                                    className="flex items-center justify-center text-xs font-bold rounded-full w-7 h-7">
                                    {shortName(employee.name)}
                                </div>
                            </td>
                            <td className={`px-2 py-1 text-center`}>
                                {toCurrency(employee.total_value)}
                            </td>
                        </tr>
                    ))}

                    <tr>
                        <td className="pl-2 text-sm font-bold">Total</td>
                        <td className="text-sm font-bold p-2 text-center">
                            {toCurrency(employees.reduce((acc, emp) => acc + Number(emp.total_value), 0))}
                        </td>
                    </tr>
                </>
            )
            } />
        </div>
    )
}