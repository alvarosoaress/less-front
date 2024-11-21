import { useEffect, useState } from 'react';
import Select from 'react-select';
import './styles.css'
import { getConstruction, getEmployees, getFreeConstructionsByRange, getWorksByRange, postWorks } from '../../service/apiService';
import useDateStore from '../../stores/useDateStore';
import { formatDate, getDateInFormat, getWeekDays, getWeekNumber, getWeeks } from '../../utils/day';
import CustomModal from '../Modal';
import SelectEmployee from '../SelectEmployee';
import useImportModalStore from '../../stores/useImportModalStore';
import { shortName } from '../../utils/employee';
import moment from 'moment/moment';

const generateYears = (startYear) => {
    const currentYear = new Date().getFullYear();
    let years = [];

    for (let year = currentYear; year >= startYear; year--) {
        years.push({ value: year, label: year });
    }

    return years;
};

export default function ModalImport() {
    const top = window.scrollY

    const { openImportModal, toggleImportModal } = useImportModalStore();
    const { activeDay, activeWeek, refreshConstructions, activeWeekNum, constructions } = useDateStore();

    const [selectedConstruction, setSelectedConstruction] = useState(null);
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    const [weeksOptions, setWeeksOptions] = useState([]);
    const [constructionOptions, setConstructionOptions] = useState([]);
    
    const years = generateYears(2020);

    const [reportState, setReportState] = useState({
        construction: null,
        year: years[0],
        week: null,
    });

    function handleClose() {
        setSelectedConstruction(null),
        setSelectedEmployees(null)
        toggleImportModal();
    }

    function handleSelectConstruction(e) {
        setSelectedConstruction(e)
        setSelectedEmployees(e.works)
    }

    const customStyles = {
        // option = dropDown menu com as opções
        option: (defaultStyles, state) => ({
            ...defaultStyles,
            color: state.isSelected ? '#ffffff' : '#707070',
            backgroundColor: state.isSelected ? '#3b82f6' : '#ffffff',
            ':hover': {
                backgroundColor: '#707070',
                color: 'white',
            },
        }),

        // menu = menu em volta das opções (container)
        menu: (defaultStyles) => ({
            ...defaultStyles,
            margin: 0
        }),

        // control = input estático (sem foco)
        control: (defaultStyles) => ({
            ...defaultStyles,
            backgroundColor: '#ffffff',
            border: '1px solid gainsboro',
            boxShadow: 'none',
            minHeight: '40px',
            minWidth: '227px',
            color: '#000000',
            ':hover': {
                border: '1px solid black',
            },
        }),

        // singleValue = valor selecionado no input
        singleValue: (defaultStyles) => ({
            ...defaultStyles,
        }),
    };

    async function handleImportWork() {
        if (!selectedConstruction || !selectedEmployees.length) return

        let bodyPost = [];

        selectedEmployees.map((emp) => {
            emp.work_days.map((work) => {
                // adicionando 13 horas para não conflitar com fusos
                // sempre vem 0 de fuso, porém, com o fuso atual do pc
                // pode ficar para tras a data, ao adicionar 13 é normalizado para qualquer fuso
                let correspondingWeek = getWeekNumber(moment.utc(work.date).add(13, 'hours').toDate())
                let actualWeek = getWeekNumber(activeDay)

                let diff = (actualWeek - correspondingWeek) * 7

                let newDate = moment.utc(work.date).add(diff, 'd').format('yyyy-MM-DD') 

                let data = {
                    id_employee: emp.id_employee,
                    id_construction: selectedConstruction.value,
                    date: newDate,
                    work_value: Number(work.daily_value),
                    time_worked: Number(work.time_worked)
                }  

                bodyPost.push(data)
            })
        })

        try {
            const res = await postWorks(bodyPost);

            handleClose();
            refreshConstructions(activeWeek)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(!openImportModal) return

        const fetchWeeks = () => {
            const weeksArr = getWeeks(new Date(reportState.year.value, 0, 1).getFullYear());

            const formattedOptions = weeksArr.map(week => {
                const startDateFormatted = moment.utc(week.startDate).format('DD/MM') ;
                const endDateFormatted = moment.utc(week.endDate).format('DD/MM') ;

                return {
                    label: `Semana ${week.week} - ${startDateFormatted} a ${endDateFormatted}`,
                    value: { startDate: week.startDate, endDate: week.endDate },
                    weekNum: week.week
                };
            });

            setWeeksOptions(formattedOptions);

            setReportState(prevState => ({ ...prevState, week: formattedOptions.find((x) => x.weekNum == (activeWeekNum - 1)) }));
        };

        fetchWeeks();
    }, [reportState.year, openImportModal]);

    useEffect(() => {
        const fetchConstructions = async () => {
            if(!reportState.week || !openImportModal) return

            const constructionsArr = await getWorksByRange(
                getDateInFormat(reportState.week.value.startDate, "aaaa-mm-dd"),
                getDateInFormat(reportState.week.value.endDate, "aaaa-mm-dd")
            )

            const filteredConstructions = constructionsArr.filter((x) => !constructions.find((z) => z.id == x.id)) 

            const formattedOptions = filteredConstructions.map(construction => {
                return {
                    label: `${construction.code} - ${construction.name}`,
                    value: construction.id,
                    works: construction.works,
                };
            });

            setConstructionOptions(formattedOptions);
        };

        setSelectedConstruction(null)
        fetchConstructions();
    }, [reportState.week, openImportModal]);

    return (
        <CustomModal isOpen={openImportModal} maxHeight={'100dvh'} onRequestClose={handleClose} top={top} >
            <div className="w-full no-select">
                <label>Ano</label>
                <Select
                    className="selectComponent no-select"
                    styles={customStyles}
                    options={years}
                    value={reportState.year}
                    onChange={selected => setReportState(prev => ({ ...prev, year: selected }))}
                    isSearchable
                    placeholder="Selecione o ano"
                />
            </div>

            <div className="w-full no-select">
                <label>Semana</label>
                <Select
                    className="selectComponent no-select"
                    styles={customStyles}
                    options={weeksOptions}
                    value={reportState.week}
                    onChange={selected => setReportState(prev => ({ ...prev, week: selected }))}
                    placeholder="Selecione a semana"
                    isClearable
                />
            </div>
                
            <div className='w-full no-select'>
                <label>Obra:</label>
                <Select
                    name="construction"
                    className="selectComponent no-select"
                    options={constructionOptions}
                    styles={customStyles}
                    placeholder="Selecione..."
                    noOptionsMessage={() => 'Nenhum resultado'}
                    onChange={handleSelectConstruction}
                    value={selectedConstruction}
                    isClearable
                    required
                />
            </div>

            {selectedConstruction ? (
                <div className="w-full no-select">
                    <table className="tabelaFunc no-select">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Importar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedConstruction.works.map((employee, index) => (
                                <tr key={index}>
                                    <td >
                                        <div className="flex items-center gap-1 pl-1">
                                            <div
                                                className="flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full no-select"
                                                style={{
                                                    backgroundColor: employee.employee_color,
                                                    color: employee.employee_color_text,
                                                }}
                                            >
                                                {shortName(employee.name_employee)}
                                            </div>
                                            <p>{employee.name_employee}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <input 
                                            className="w-full size-4" 
                                            type="checkbox"
                                            id={employee.id_employee} 
                                            onChange={() => {
                                                let empInd = selectedEmployees.findIndex((work) => work.id_employee == employee.id_employee)
                                                let empWork = selectedConstruction.works.find((work) => work.id_employee == employee.id_employee)

                                                empInd >= 0 ? selectedEmployees.splice(empInd, 1) : selectedEmployees.push(empWork)

                                                console.log(selectedEmployees)
                                            }}
                                            defaultChecked
                                         />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : null}

            <button
                className="w-1/2 py-1 text-center text-white bg-blue-500 rounded-lg disabled:bg-slate-500 no-select"
                disabled={!(selectedConstruction && selectedEmployees?.length)}
                onClick={handleImportWork}
            >
                Importar
            </button>
        </CustomModal>
    );
}
