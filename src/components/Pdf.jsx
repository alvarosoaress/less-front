import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { saveAs } from "file-saver"; // Importando file-saver

import Button from "../components/Button"
import Loading from "./Loading";

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import { getWorksByRange } from "../service/apiService";
import { getWeekNumber } from "../utils/day";
import moment from "moment";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export default function Pdf({ startDate, endDate }) {
    const [numPages, setNumPages] = useState()
    const [pageNumber, setPageNumber] = useState(1)
    const [hasData, setHasData] = useState(false)

    const [isLoaded, setIsLoaded] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)

    let file = `${import.meta.env.VITE_API_URL}/weeklyReport?startDate=${startDate}&endDate=${endDate}`

    if(import.meta.env.VITE_PRODUCTION) {
        file = `${import.meta.env.VITE_REPORT_URL}startDate=${startDate}&endDate=${endDate}`
    }

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages)
        setIsLoaded(true)
    }

    const handleDownload = async () => {
        setIsDownloading(true);

        setTimeout(async () => {
            try {
                const response = await fetch(file);
                if (!response.ok) {
                    throw new Error("Erro ao baixar o arquivo");
                }
                const blob = await response.blob();
                saveAs(blob, `EQUIPE - SEMANA ${getWeekNumber(moment.utc(startDate).toDate())}.pdf`);
            } catch (err) {
                alert("Erro ao baixar o PDF");
            } finally {
                setIsDownloading(false);
            }
        }, 300); // atraso para garantir a atualização do estado
    };

    useEffect(() => {
        async function fetchData() {
            setPageNumber(1)

            try {
                const res = await getWorksByRange(startDate, endDate);
                setHasData(res.length > 0);
            } catch (err) {
                setHasData(false);
            }
        }

        fetchData();
        setIsLoaded(false)
        setIsDownloading(false)
    }, [startDate, endDate]);

    return hasData ? (
        <>
            {isDownloading && <Loading text="Baixando PDF" />}
            <div className="flex flex-col gap-1 py-2 border-2">
                <Document
                    className="px-3"
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<div className="text-center">Carregando Relatório...</div>}
                >
                    <Page pageNumber={pageNumber} width={window.innerWidth * .83} />
                </Document>
                {
                    numPages > 1 &&
                    <div className="flex">
                        <motion.div
                            className="flex items-center justify-center w-full h-full p-2"
                            whileTap={{ backgroundColor: "#fafafa" }}
                            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                        >
                            {'\u21D0'}
                        </motion.div>
                        <div className="flex items-center justify-center w-full h-full p-2">
                            {`${pageNumber}/${numPages}`}
                        </div>
                        <motion.div
                            className="flex items-center justify-center w-full h-full p-2"
                            whileTap={{ backgroundColor: "#fafafa" }}
                            onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
                        >
                            {'\u21D2 '}
                        </motion.div>
                    </div>
                }
                <Button
                    title="Baixar"
                    enabled={isLoaded}
                    onClick={handleDownload}
                />
            </div>
        </>
    ) : (
        <div className="italic text-center">Não existem dados para a semana selecionada</div>
    );
}
