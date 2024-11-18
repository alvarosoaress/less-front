import React from 'react';
import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { motion } from 'framer-motion';
import TouchableButton from '../../components/TouchableButton';
import ArrowIcon from "../../assets/icons/arrow.svg"

const ConstructionEdit = ({ constructionId, onClose, onConstructionUpdated }) => {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        const fetchConstruction = async () => {
            const { data, error } = await supabase
                .from("construction")
                .select("*")
                .eq("id", constructionId)
                .single();
            if (data) {
                setCode(data.code);
                setName(data.name);
                setAddress(data.address);
            }
            if (error) console.error("Erro ao buscar a obra:", error.message);
        };

        fetchConstruction();
    }, [constructionId]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const { error, data } = await supabase
            .from("construction")
            .update({ code, name, address })
            .eq("id", constructionId);

        if (error) {
            console.error("Erro ao atualizar a obra:", error.message);
        } else if (data && data.length > 0) {
            onConstructionUpdated(data[0]); // Supabase pode retornar um array, então selecionamos o primeiro item
            onClose();
        } else {
            console.error("...");
            onClose();
        }
    };

    const handleDelete = async () => {
        const { error } = await supabase.from("construction").delete().eq("id", constructionId);

        if (error) {
            console.error("Erro ao deletar a obra:", error.message);
        } else {
            onConstructionUpdated(); // Atualiza a lista de obras após a exclusão
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
                <h2 className="text-lg font-bold">Editar Obra</h2>
                <span className='w-[30px]' />
            </header>
            <form onSubmit={handleUpdate} className='flex flex-col h-full gap-4 pt-5'>
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
                    Atualizar
                </button>
            </form>
            <button
                onClick={() => onClose()}
                className="w-full py-2 mt-2 text-white transition-colors bg-gray-500 rounded hover:bg-gray-600"
            >
                Cancelar
            </button>
        </motion.div>
    );
};

export default ConstructionEdit;
