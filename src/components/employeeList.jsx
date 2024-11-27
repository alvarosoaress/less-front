import React from 'react';

const SelectEmployee = ({ employees, onSelect }) => {
    return (
        <select onChange={(e) => {
            const selectedId = Number(e.target.value); // Converta para número
            const selectedEmployee = employees.find(emp => emp.id === selectedId);
            onSelect(selectedEmployee);
        }}>
            <option value="">Selecione uma pessoa</option>
            {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                    {employee.name}
                </option>
            ))}
        </select>
    );
};

export default SelectEmployee;
