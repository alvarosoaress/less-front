import { useEffect, useState } from "react";
import { putWork } from "../service/apiService";
import useEmployeeModalStore from "../stores/useEmployeeModalStore";

export default function WorkDay({ workDayData, timeWorkedExists, day, employeeID, constructionID}) {
    const [timeWorked, setTimeWorked] = useState(timeWorkedExists ? Number(workDayData.time_worked) : 0);
    const times = [0, 1, 0.5, 2];

    const { setEmployeeEdit, toggleEditDayModal } = useEmployeeModalStore();

    const handleSetTimeWorked = async () => {
        const currentIndex = times.indexOf(timeWorked);
        const nextIndex = (currentIndex + 1) % times.length;
        const newTimeWorked = times[nextIndex];
        setTimeWorked(newTimeWorked);

        try {
            await putWork(workDayData.id_work, newTimeWorked);
            workDayData.time_worked = newTimeWorked;
        } catch (err) {
            console.log("houve um erro ao salvar os dados ", err);
        }
    };

    useEffect(() => {
        setTimeWorked(timeWorkedExists ? Number(workDayData.time_worked) : 0);
    }, [workDayData])
    

    let timer;
    let touchDuration = 300;

    function onLongTouch() {
        timer = null;
        setEmployeeEdit({workDayData, employeeID, constructionID, day});
        toggleEditDayModal();
    }

    function touchstart(e) {
        e.preventDefault();
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
        <td
            className="px-2 py-1 text-center cursor-pointer"
            onClick={handleSetTimeWorked}
            onTouchStart={touchstart}
            onTouchEnd={touchend}
            onContextMenu={handleContextMenu}
        >
            {timeWorked ? timeWorked : ""}
        </td>
    );
}
