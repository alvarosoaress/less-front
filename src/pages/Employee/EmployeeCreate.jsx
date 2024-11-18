import { useState } from "react";
import { supabase } from "../../../supabaseClient";
import { motion } from 'framer-motion';
import ArrowIcon from "../../assets/icons/arrow.svg"
import TouchableButton from "../../components/TouchableButton"
import { generatePastelColor, shortName, toCurrency } from "../../utils/employee";

const EmployeeCreate = ({ onClose, onEmployeeCreated }) => {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [daily_value, setDaily_value] = useState("");
    const [color, setColor] = useState("black");
    const [textColor, setTextColor] = useState("white");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase
            .from("employee")
            .insert([{ name, role, daily_value: parseFloat(daily_value) }], {
                returning: "minimal",
            });

        console.log(data, error);
        if (error) {
            console.error("Error inserting data:", error.message);
        } else {
            onEmployeeCreated();
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
                <h2 className="text-lg font-bold">Cadastrar Funcionário</h2>
                <span className='w-[30px]' />
            </header>
            <form onSubmit={handleSubmit} className='flex flex-col h-full gap-4 pt-5'>
                <div>
                    <label className="block text-gray-700">Nome *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 mt-1 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Especialidade</label>
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-2 mt-1 border border-gray-300 rounded"
                    />
                </div>
                <div>
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
                <span className='w-full h-full'/>
                <button
                    type="submit"
                    className="w-full py-2 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
                >
                    Cadastrar
                </button>
            </form>
            <button
                onClick={onClose}
                className="w-full py-2 mt-3 text-white transition-colors bg-gray-500 rounded hover:bg-gray-600"
            >
                Cancelar
            </button>
        </motion.div>
    );
};

export default EmployeeCreate;
