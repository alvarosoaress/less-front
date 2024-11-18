import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

import { motion } from 'framer-motion';
import ArrowIcon from "../../assets/icons/arrow.svg"
import TouchableButton from "../../components/TouchableButton"
import { generatePastelColor, shortName, toCurrency } from "../../utils/employee";

const EmployeeEdit = ({ employeeId, onClose, onEmployeeUpdated }) => {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [daily_value, setDaily_value] = useState("");
    const [color, setColor] = useState("black");
    const [textColor, setTextColor] = useState("white");

    useEffect(() => {
        const fetchEmployee = async () => {
            const { data, error } = await supabase
                .from("employee")
                .select("*")
                .eq("id", employeeId)
                .single();
            if (data) {
                setName(data.name);
                setRole(data.role);
                setDaily_value(data.daily_value);
                setColor(data.color);
                setTextColor(data.color_text);
            }
            if (error) console.error("Erro ao buscar o funcionário:", error.message);
        };
        fetchEmployee();
    }, [employeeId]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!employeeId) {
            console.error("ID do funcionário não encontrado!");
            return;
        }

        const { error, data } = await supabase
            .from("employee")
            // arrumar campos update
            .update({ name, role, daily_value: daily_value, color, color_text: textColor })
            .eq("id", employeeId);

        if (error) {
            console.error("Erro ao atualizar a obra:", error.message);
        } else if (data && data.length > 0) {
            onEmployeeUpdated(data[0]); // Supabase pode retornar um array, então selecionamos o primeiro item
            onClose();
        } else {
            console.error("...");
            onClose();
        }
    };

    const handlePriceChange = (e) => {
        const value = e.currentTarget.value;
        const numericValue = parseFloat(value.replace(/\D/g, '')) / 100;
        setDaily_value(Math.min(numericValue, 999999.99))
    };

    return (
        <motion.div
            className="absolute top-0 left-0 flex flex-col w-full h-screen p-5 bg-white"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'tween' }}
        >
            <header className='flex items-center justify-between'>
                <TouchableButton onClick={onClose}>
                    <img className='rotate-180' width={30} src={ArrowIcon} />
                </TouchableButton>
                <h2 className="text-lg font-bold">Editar Funcionário</h2>
                <span className='w-[30px]' />
            </header>
            <form onSubmit={handleUpdate} className='flex flex-col h-full gap-4 pt-5'>
                <div className="mb-4">
                    <label className="block text-gray-700">Nome *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 mt-1 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Especialidade</label>
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-2 mt-1 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-12">
                    <label className="block text-gray-700">Diária *</label>
                    <input 
                        value={toCurrency(daily_value)} 
                        onChange={handlePriceChange} 
                        className="w-full p-2 mt-1 border border-gray-300 rounded"
                        type="text" 
                        inputMode="numeric" 
                    />
                </div>
                <div className="inline-flex flex-col items-center gap-2 mx-auto text-center">
                    <span>Ícone</span>
                    <div 
                        className="flex items-center justify-center w-24 h-24 text-4xl font-bold rounded-full no-select"
                        style={{ backgroundColor: color, color: textColor }}
                        onClick={() => {
                            let {backgroundColor, textColor} = generatePastelColor();
                            setColor(backgroundColor);
                            setTextColor(textColor);
                        }}
                    >
                        {shortName(name)}
                    </div>
                </div>
                <span className='w-full h-full' />
                <button
                    type="submit"
                    className="w-full py-2 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
                >
                    Atualizar
                </button>
            </form>
            <button
                onClick={onClose}
                className="w-full py-2 mt-2 text-white transition-colors bg-gray-500 rounded hover:bg-gray-600"
            >
                Cancelar
            </button>
        </motion.div>
    );
};

export default EmployeeEdit;
