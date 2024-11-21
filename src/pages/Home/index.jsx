import React from 'react';
import { useEffect, useState } from "react";
import { getWeekDays, getRange, getWeekNumber, formatDateRange, getDateInFormat } from "../../utils/day";
import { deleteFullConstruction, getWorksByRange, getWorksDate, postWorks } from "../../service/apiService";

import ConstructionTable from "../../components/ConstructionTable";
import ArrowIcon from "../../assets/icons/arrow.svg"
import ModalConstruction from "../../components/ModalConstruction";
import ModalEmployee from "../../components/ModalEmployee";
import ModalEditDay from '../../components/ModalEditDay';
import TouchableButton from "../../components/TouchableButton"
import { motion } from "framer-motion"

import Calendar from 'react-calendar'
import useEmployeeModalStore from "../../stores/useEmployeeModalStore";
import useConstructionModalStore from "../../stores/useConstructionModalStore";
import useDateStore from "../../stores/useDateStore";

import Calendaricon from "../../assets/icons/calendar.svg"
import 'react-calendar/dist/Calendar.css';
import ModalImport from '../../components/ModalImport';
import useImportModalStore from '../../stores/useImportModalStore';
import useDeleteModalStore from '../../stores/useDeleteModalStore';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import toast from 'react-hot-toast';

function App() {
    const { toggleEmployeeModal } = useEmployeeModalStore();
    const { toggleConstructionModal, openConstructionModal } = useConstructionModalStore();
    const { toggleImportModal, openImportModal } = useImportModalStore();
    const { activeDay, setActiveDay, activeWeek, setActiveWeek, setActiveWeekNum, constructions, setConstructions, refreshConstructions } = useDateStore();
    const { openDeleteModal, toggleDeleteModal, deleteConstructionId } = useDeleteModalStore();

    const [loading, setLoading] = useState(false);
    const [works, setWorks] = useState([]);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [initialY, setInitialY] = useState(0)

    const toggleWeek = (interval) => {
        const newDate = new Date(activeDay);
        newDate.setDate(newDate.getDate() + interval);
        setActiveDay(newDate);
    };

    const addEmployee = async (employee) => {
        const array = activeWeek.map(day => ({
            id_employee: employee.id,
            id_construction: employee.id_construction,
            date: day,
            time_worked: 0,
            work_value: employee.daily_value
        }))

        await postWorks(array)

        const newDate = new Date(activeDay)
        setActiveDay(newDate)

        toggleEmployeeModal()
    }

    function handleDrag(info) {
        const threshold = 100
        const dragX = info.offset.x

        if (dragX > threshold) toggleWeek(-7);
        if (dragX < -threshold) toggleWeek(7);
    }

    // Atualiza a semana quando o activeDay muda
    useEffect(() => {
        setActiveWeek(getWeekDays(activeDay));
        setActiveWeekNum(getWeekNumber(activeDay))
    }, [activeDay]);

    // Busca os dados quando activeWeek muda
    useEffect(() => {
        const fetchWorks = async () => {
            setLoading(true);
            const { first, last } = getRange(activeWeek);
            const result = await getWorksByRange(first, last);
            result.sort((a, b) => a.name < b.name)
            setConstructions(null);
            setConstructions(result);
            setLoading(false);
        };

        const fetchWorksDates = async () => {
            setLoading(true);
            const result = await getWorksDate();
            setWorks(result);
            setLoading(false);
        };

        if (activeWeek) {
            fetchWorks();
            fetchWorksDates();
        }
    }, [activeWeek]);

    let timer;
    let touchDuration = 500;

    function onLongTouch() {
        timer = null;
        if(window.scrollY != initialY || openImportModal) return
        if(window.screen.width < 600 ) navigator.vibrate(100);
        toggleImportModal();
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

    async function handleDeleteConstruction() {
        try {
            const startDate = moment(activeWeek[0]).format('yyyy-MM-DD');
            const endDate = moment(activeWeek[activeWeek.length -1 ]).format('yyyy-MM-DD');
            const res = await deleteFullConstruction(deleteConstructionId, startDate, endDate)
            toggleDeleteModal();
            refreshConstructions(activeWeek);
            
            toast.success('Obra deletada.')
            return res;
        } catch (error) {
            console.log(error)
        }
    }

    const location = useLocation();

    useEffect(() => {
        // Adiciona uma nova entrada no histórico quando o modal abre
        if (openDeleteModal) {
            window.history.pushState(null, '', location.pathname);
            document.body.classList.toggle('stop-scrolling');
        } else {
            document.body.classList.toggle('stop-scrolling');
        }

        const handlePopState = () => {
            if (openDeleteModal) {
                toggleDeleteModal();
            }
        };

        // Escuta o evento "popstate" para capturar o botão de "voltar"
        window.addEventListener('popstate', handlePopState);

        // Remove o listener ao desmontar ou quando o modal fecha
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [openDeleteModal, toggleDeleteModal, location.pathname]);

    return (
        <>
            <ModalEmployee addEmployee={addEmployee} />

            <ModalConstruction />

            <ModalEditDay />

            <ModalImport />

            <div className="flex flex-col w-full gap-5 px-3 main">
                <div className="flex items-center gap-2">
                    <TouchableButton onClick={() => setCalendarOpen((state) => !state)}>
                        <img src={Calendaricon} className="h-7 no-select" />
                    </TouchableButton>
                    <h2 className="text-lg font-bold text-center no-select">Semana {getWeekNumber(activeDay)}</h2>
                    <h3 className="text-sm font-medium text-[#908C8C] no-select">
                        {`${getDateInFormat(activeWeek[0], "dd/mm")} a ${getDateInFormat(activeWeek[activeWeek.length - 1], "dd/mm")}`}
                    </h3>
                </div>
                <motion.div
                    className='flex flex-col w-full min-h-[100dvh] gap-5'
                    drag={openDeleteModal ? false : "x"}
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => handleDrag(info)}
                >
                    <Calendar
                        tileClassName={
                            ({ activeStartDate, date }) =>
                                works.findIndex((x) => String(x).split('T')[0] == new Date(date).toISOString().split('T')[0]) >= 0 ?
                                    '!bg-[#d2d2d2]'
                                    : null
                        }
                        onClickDay={((date) => {
                            activeWeek.some((x) => x.getTime() === date.getTime()) ? null : setActiveDay(date)
                            setCalendarOpen(false)
                        })}
                        defaultActiveStartDate={activeDay}
                        value={activeDay}
                        className={calendarOpen ? 'calendarOpen' : 'calendarClosed'}
                        next2Label={null}
                        prev2Label={null}
                        showWeekNumbers
                    />
                    {loading ? (
                        <p>Carregando dados...</p>  // Indicador de carregamento
                    ) : (
                        constructions.length != 0 ? constructions.map((data) => (
                            <ConstructionTable key={data.code} data={data} activeWeek={activeWeek} />
                        )) :
                        <div>Nenhuma Obra para esta semana</div>
                    )}
                    {/* <div className='fixed bottom-0 w-full py-2 m-auto bg-white'>
                    <button 
                    className="justify-center w-[95%] py-1 font-bold text-center text-white bg-blue-500 rounded-lg align-center" 
                    onClick={() => toggleConstructionModal()}
                    >
                    +
                    </button>
                    </div> */}

                    <div className='flex items-center justify-center w-full p-2 bg-white no-select'>
                        <button
                            className={`bg-[#3777E6] w-10 h-10 rounded-full text-white no-select ${loading ? 'opacity-0' : 'opacity-100'}`}
                            onClick={() => openConstructionModal ? null : toggleConstructionModal()}
                            onTouchStart={touchstart}
                            onTouchEnd={touchend}
                            onContextMenu={handleContextMenu}
                        >
                            +
                        </button>
                    </div>

                    {openDeleteModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="max-w-sm p-8 bg-white rounded-lg shadow-lg">
                                <p className="mb-4 text-center text-gray-700">
                                    Tem certeza que deseja deletar esta obra?
                                </p>
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={handleDeleteConstruction}
                                        className="px-4 py-2 text-white transition bg-red-500 rounded hover:bg-red-600"
                                    >
                                        Deletar
                                    </button>
                                    <button
                                        onClick={() => toggleDeleteModal()}
                                        className="px-4 py-2 text-white transition bg-gray-500 rounded hover:bg-gray-600"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </>
    );
}

export default App;
