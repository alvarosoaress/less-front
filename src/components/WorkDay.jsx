import { useEffect, useState } from "react";
import { putWork } from "../service/apiService";
import useEmployeeModalStore from "../stores/useEmployeeModalStore";
import useDateStore from "../stores/useDateStore";

export default function WorkDay({ workDayData, timeWorkedExists, day, employeeID, constructionID}) {
    const [timeWorked, setTimeWorked] = useState(timeWorkedExists ? Number(workDayData.time_worked) : 0);
    const [initialY, setInitialY] = useState(0)
    const [loading, setLoading] = useState(false)
    const times = [0, 1, 0.5];

    const { setEmployeeEdit, toggleEditDayModal, openEditDayModal} = useEmployeeModalStore();
    const { activeWeek, refreshConstructions } = useDateStore();

    const handleSetTimeWorked = async () => {
        if(loading) return

        const currentIndex = times.indexOf(timeWorked);
        const nextIndex = (currentIndex + 1) % times.length;
        const newTimeWorked = times[nextIndex];
        setTimeWorked(newTimeWorked);

        try {
            setLoading(true);
            await putWork(workDayData.id_work, newTimeWorked);
            workDayData.time_worked = newTimeWorked;
            setLoading(false);
            refreshConstructions(activeWeek);
        } catch (err) {
            console.log("houve um erro ao salvar os dados ", err);
            setLoading(false)
        }
    };

    useEffect(() => {
        setTimeWorked(timeWorkedExists ? Number(workDayData.time_worked) : 0);
    }, [workDayData])
    

    let timer;
    let touchDuration = 1200;

    function onLongTouch() {
        timer = null;
        if(window.scrollY != initialY || openEditDayModal) return
        if(window.screen.width < 600 ) navigator.vibrate(100);
        setEmployeeEdit({workDayData, employeeID, constructionID, day});
        toggleEditDayModal();
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
        <td
            className={`${loading ? 'opacity-20' : ''} px-2 py-1 text-center cursor-pointer`}
            onClick={handleSetTimeWorked}
            onTouchStart={touchstart}
            onTouchEnd={touchend}
            onContextMenu={handleContextMenu}
        >
            {timeWorked ? timeWorked : ""}
        </td>
    );
}
