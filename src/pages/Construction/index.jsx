import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import ConstructionCreate from '../Construction/ConstructionCreate';
import ConstructionEdit from '../Construction/ConstructionEdit';
import { useNavigate } from "react-router-dom";
import ConstructionCard from '../../components/ConstructionCard';
import { AnimatePresence } from 'framer-motion';

import Button from "../../components/Button"

const Construction = () => {
    // Gerenciamento de construction e paginação
    const [constructions, setConstructions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const constructionsPerPage = 7;

    const [showConstructionCreate, setShowConstructionCreate] = useState(false);
    const [showEditConstruction, setShowEditConstruction] = useState(false);
    const [selectedConstruction, setSelectedConstruction] = useState(null);
    const [constructionInfo, setConstructionInfo] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [reload, setReload] = useState(0)

    useEffect(() => {
        const fetchConstructions = async () => {
            const { data, error } = await supabase.from('construction').select('*');
            if (error) console.error('Erro ao buscar obras:', error.message);
            else setConstructions(data);
        };
        fetchConstructions();
    }, [reload]);

    const indexOfLastConstruction = currentPage * constructionsPerPage;
    const indexOfFirstConstruction = indexOfLastConstruction - constructionsPerPage;
    const currentConstructions = constructions.slice(indexOfFirstConstruction, indexOfLastConstruction);

    const totalPages = Math.ceil(constructions.length / constructionsPerPage);
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleDeleteConstruction = async () => {
        if (!constructionInfo) return;

        const { error } = await supabase
            .from('construction')
            .delete()
            .eq('id', constructionInfo.id);

        if (error) {
            console.error('Erro ao deletar a obra:', error.message);
        } else {
            setConstructions((prev) =>
                prev.filter((construction) => construction.id !== constructionInfo.id)
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
            )
        );
        setConstructionInfo(updatedConstruction);
    };

    return (
        <div className="flex flex-col h-full w-full items-center p-2 overflow-y-scroll">
            <div className='flex flex-col gap-3 w-full h-full overflow-y-scroll'>
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
                    className="w-full py-2 rounded-md font-extrabold"
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
                        onClose={() => setShowEditConstruction(false)}
                        onConstructionUpdated={updateConstructionInfo} // Passando a função para atualizar
                    />
                )}
            </AnimatePresence>

            {/* Modal de confirmação para deletar obra */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
                        <p className="text-center text-gray-700 mb-4">
                            Tem certeza que deseja deletar esta obra?
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleDeleteConstruction}
                                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                            >
                                Deletar
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
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
