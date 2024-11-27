import useConstructionModalStore from '../../stores/useConstructionModalStore';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import './styles.css'
import { getConstruction, getEmployees, getFreeConstructionsByRange, postWorks } from '../../service/apiService';
import useDateStore from '../../stores/useDateStore';
import { formatDate, getWeekDays } from '../../utils/day';
import CustomModal from '../Modal';
import SelectEmployee from '../SelectEmployee';

export default function ModalConstruction() {
    const { openConstructionModal, closeConstructionModal } = useConstructionModalStore();
    const { activeDay, activeWeek, refreshConstructions } = useDateStore();
    const top = window.scrollY

    const [constructions, setConstructions] = useState([])
    const [selectedConstruction, setSelectedConstruction] = useState(null);
    const [selectedEmployees, setSelectedEmployees] = useState([]);

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

    async function handleCreateWork() {
        if (!selectedConstruction || !selectedEmployees.length) return

        let bodyPost = [];

        const weekDays = getWeekDays(activeDay)

        selectedEmployees.map((emp) => {
            let data = {
                id_employee: emp.value,
                id_construction: selectedConstruction.value,
                date: new Date(),
                work_value: emp.work_value,
                time_worked: 0
            }

            weekDays.map((wd) => bodyPost.push({ ...data, date: formatDate(wd) }))
        })

        try {
            const res = await postWorks(bodyPost);

            closeConstructionModal()
            refreshConstructions(activeWeek)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const weekDays = getWeekDays(activeDay)

        async function fetchConstructions() {
            try {
                const res = await getFreeConstructionsByRange(weekDays[0], weekDays[weekDays.length - 1]);

                let resTreated = res.map((cons) => ({ value: cons.id, label: `${cons.code} ${cons.name}` }))

                resTreated.sort((a,b) => a.label > b.label)

                setConstructions(resTreated)
            } catch (error) {
                console.log(error)
            }
        }

        setSelectedEmployees(null)
        setSelectedConstruction(null)

        fetchConstructions();
    }, [openConstructionModal])

    return (
        <CustomModal isOpen={openConstructionModal} onRequestClose={closeConstructionModal} top={top} >
            <div className='w-full'>
                <label>Obra:</label>
                <Select
                    name="construction"
                    className="selectComponent"
                    options={constructions}
                    styles={customStyles}
                    placeholder="Selecione..."
                    noOptionsMessage={() => 'Nenhum resultado'}
                    onChange={setSelectedConstruction}
                    value={selectedConstruction}
                    isClearable
                    required
                />
            </div>

            <div className='w-full'>
                <label>Pessoa(s):</label>
                <SelectEmployee 
                    onChange={setSelectedEmployees} 
                    value={selectedEmployees} 
                    isMulti 
                />
            </div>

            <button
                className="w-1/2 py-1 text-center text-white bg-blue-500 rounded-lg disabled:bg-slate-500"
                onClick={handleCreateWork}
                disabled={!(selectedConstruction && selectedEmployees?.length)}>
                Confirmar
            </button>
        </CustomModal>
    );
}
