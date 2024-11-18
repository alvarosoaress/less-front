import Select, { components } from 'react-select';
import { shortName } from '../../utils/employee';
import { useEffect, useState } from 'react';
import { getEmployees } from '../../service/apiService';

export default function SelectEmployee({defaultValue, onChange, value, employees, ...props}) {
    const [defaultEmployees, setDefaultEmployees] = useState([]);

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

    const Option = ({ children, ...props }) => (
        <components.Option {...props}>
            <div className='inline-flex items-center gap-2'>
                <div 
                    className="flex items-center justify-center text-xs font-bold rounded-full w-7 h-7 no-select"
                    style={{ backgroundColor: props.data.color, color: props.data.textColor }}
                >
                    {shortName(props.data.label)}
                </div>
                <span>{children}</span>
            </div>
        </components.Option>
    );

    useEffect(() => {
        if(!employees) {
            async function fetchEmployees() {
                try {
                    const res = await getEmployees();
                    
                    let resTreated = res.map((emp) => ({ value: emp.id, label: emp.name, work_value: emp.daily_value, color: emp.color, textColor: emp.color_text }))
                    
                    resTreated.sort((a, b) => b.label < a.label)
                    
                    setDefaultEmployees(resTreated)
                } catch (error) {
                    console.log(error)
                }
            }   
            
            fetchEmployees();
        }
    }, []);

    return(
        <Select
            name="employees"
            className="selectComponent"
            components={{Option}}
            options={employees || defaultEmployees}
            styles={customStyles}
            placeholder="Selecione..."
            noOptionsMessage={() => 'Nenhum resultado'}
            onChange={onChange}
            value={value}
            blurInputOnSelect={false}
            defaultValue={defaultValue}
            required
            {...props}
        />
    )
}