import React from 'react';
import { useState } from "react";
import { supabase } from "../../../supabaseClient";
import ArrowIcon from "../../assets/icons/arrow.svg"
import { motion } from 'framer-motion';
import TouchableButton from "../../components/TouchableButton"

const ConstructionCreate = ({ onClose, onConstructionCreated }) => {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase
            .from("construction")
            .insert([{ code, name, address }], { returning: "minimal" });
        console.log(data, error);

        if (error) {
            console.error("Error inserting data:", error.message);
        } else {
            onConstructionCreated();
            onClose();
        }
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
                <h2 className="text-lg font-bold">Cadastrar Obra</h2>
                <span className='w-[30px]' />
            </header>
            <form onSubmit={handleSubmit} className='flex flex-col h-full gap-4 pt-5'>
                <div>
                    <label htmlFor="apelido" className="block text-gray-700">Nome *</label>
                    <input
                        id="apelido"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 mt-1 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="codigo" className="block text-gray-700">Código *</label>
                    <input
                        id="codigo"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full p-2 mt-1 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="endereco" className="block text-gray-700">Endereço</label>
                    <input
                        id="endereco"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-2 mt-1 border border-gray-300 rounded"
                    />
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
                onClick={() => onClose()}
                className="w-full py-2 mt-4 text-white transition-colors bg-gray-500 rounded hover:bg-gray-600"
            >
                Cancelar
            </button>
        </motion.div>
    );
};

export default ConstructionCreate;
