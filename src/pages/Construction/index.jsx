import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import ConstructionCreate from '../Construction/ConstructionCreate';
import ConstructionEdit from '../Construction/ConstructionEdit';
import ConstructionCard from '../../components/ConstructionCard';
import { AnimatePresence } from 'framer-motion';

import Button from "../../components/Button"
import toast from 'react-hot-toast';

const Construction = () => {
    // Gerenciamento de construction e paginação
    const [constructions, setConstructions] = useState([]);

    const [showConstructionCreate, setShowConstructionCreate] = useState(false);
    const [showEditConstruction, setShowEditConstruction] = useState(false);
    const [constructionInfo, setConstructionInfo] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [reload, setReload] = useState(0)

    useEffect(() => {
        const fetchConstructions = async () => {
            const { data, error } = await supabase.from('construction').select('*');
            if (error) console.error('Erro ao buscar obras:', error.message);
            else {
                let sortedData = data.sort((a,b) => a.name > b.name)
                setConstructions(sortedData)
            };
        };
        fetchConstructions();
    }, [reload]);

    const handleDeleteConstruction = async () => {
        if (!constructionInfo) return;

        const { error } = await supabase
            .from('construction')
            .delete()
            .eq('id', constructionInfo.id);

        if (error) {
            setConstructionInfo(null);
            setShowDeleteModal(false);
            toast.error('Existem dados relacionados à obra.')
        } else {
            setConstructions((prev) =>
                prev.filter((construction) => construction.id !== constructionInfo.id).sort((a,b) => a.name > b.name)
            );
            setConstructionInfo(null);
            setShowDeleteModal(false);
        }
    };

    const updateConstructionInfo = (updatedConstruction) => {
        if (!updatedConstruction) {
            console.error("updatedConstruction é null ou indefinido");
            return;
        }
        setConstructions((prev) =>
            prev.map((construction) =>
                construction.id === updatedConstruction.id ? updatedConstruction : construction
            ).sort((a,b) => a.name > b.name)
        );
        setConstructionInfo(updatedConstruction);
        setReload(reload + 1);
    };

    return (
        <div className="flex flex-col items-center w-full h-full p-2 overflow-y-scroll">
            <div className='flex flex-col w-full h-full gap-3 overflow-y-scroll'>
                <AnimatePresence>
                    {constructions.map(cons =>
                        <ConstructionCard
                            key={cons.id}
                            data={cons}
                            onClick={() => {
                                setConstructionInfo(cons)
                                setShowEditConstruction(true)
                            }}
                            onDelete={() => {
                                setConstructionInfo(cons)
                                setShowDeleteModal(true)
                            }}
                        />
                    )}
                </AnimatePresence>
            </div>
            <div className='w-full p-3'>
                <Button
                    title="+"
                    enabled={true}
                    className="w-full py-2 font-extrabold rounded-md"
                    onClick={() => setShowConstructionCreate(true)}
                />
            </div>

            {/* Modal para criar nova obra */}
            <AnimatePresence>
                {showConstructionCreate && (
                    <ConstructionCreate
                        onClose={() => setShowConstructionCreate(false)}
                        onConstructionCreated={() => {
                            setShowConstructionCreate(false)
                            setTimeout(() => {
                                setReload(reload + 1)
                            }, 300);
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Modal para editar obra */}
            <AnimatePresence>
                {showEditConstruction && (
                    <ConstructionEdit
                        constructionId={constructionInfo?.id}
                        onClose={() => {
                            setShowEditConstruction(false)
                            setReload(reload + 1);
                        }}
                        onConstructionUpdated={updateConstructionInfo} // Passando a função para atualizar
                    />
                )}
            </AnimatePresence>

            {/* Modal de confirmação para deletar obra */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="max-w-sm p-6 bg-white rounded-lg shadow-lg">
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
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-white transition bg-gray-500 rounded hover:bg-gray-600"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Construction;
