import { useState, useEffect } from "react";
import { getWeeks, getDateInFormat } from "../../utils/day";
import Select from "react-select";
import Pdf from "../../components/Pdf";
import moment from "moment";
import useDateStore from "../../stores/useDateStore";

const generateYears = (startYear) => {
    const currentYear = new Date().getFullYear();
    let years = [];

    for (let year = currentYear; year >= startYear; year--) {
        years.push({ value: year, label: year });
    }

    return years;
};

const selectTypes = [
    { value: "weekly", label: "Relatório Semanal" },
    { value: "service_per_work", label: "Relatório Serviço Por Obra" },
];

export default function Report() {
    const { activeDay } = useDateStore();

    const years = generateYears(2020, activeDay);

    const [reportState, setReportState] = useState({
        reportType: selectTypes[0],
        year: years[0],
        week: null,
    });

    const [weeksOptions, setWeeksOptions] = useState([]);

    useEffect(() => {
        const fetchWeeks = () => {
            const weeksArr = getWeeks(new Date(reportState.year.value, 0, 1).getFullYear());

            const formattedOptions = weeksArr.map(week => {
                const startDateFormatted = moment.utc(week.startDate).format('DD/MM') ;
                const endDateFormatted = moment.utc(week.endDate).format('DD/MM') ;

                return {
                    label: `Semana ${week.week} - ${startDateFormatted} a ${endDateFormatted}`,
                    value: { startDate: week.startDate, endDate: week.endDate },
                };
            });

            setWeeksOptions(formattedOptions);
        };

        setReportState(prevState => ({ ...prevState, week: null }));
        fetchWeeks();
    }, [reportState.year]);

    return (
        <div className="flex flex-col justify-between w-full h-full gap-2 p-3">
            <div className="flex flex-col w-full h-full gap-3 px-3">
                <div className="flex flex-col gap-2">
                    <label>Tipo de Relatório</label>
                    <Select
                        className="z-30"
                        options={selectTypes}
                        value={reportState.reportType}
                        onChange={selected => setReportState(prev => ({ ...prev, reportType: selected }))}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label>Ano</label>
                    <Select
                        className="z-20"
                        options={years}
                        value={reportState.year}
                        onChange={selected => setReportState(prev => ({ ...prev, year: selected }))}
                        isSearchable
                        placeholder="Selecione o ano"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label>Semana</label>
                    <Select
                        className="z-10"
                        options={weeksOptions}
                        value={reportState.week}
                        onChange={selected => setReportState(prev => ({ ...prev, week: selected }))}
                        placeholder="Selecione a semana"
                        isClearable
                    />
                </div>

                {reportState.week && (
                    <Pdf
                        startDate={getDateInFormat(reportState.week.value.startDate, "aaaa-mm-dd")}
                        endDate={getDateInFormat(reportState.week.value.endDate, "aaaa-mm-dd")}
                    />
                )}
            </div>
        </div>
    );
}
