import moment from "moment";

export function getWeekDays(date) {
    const weekdays = [];
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();


    startOfWeek.setDate(startOfWeek.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));


    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + i);
        weekdays.push(currentDay);
    }

    return weekdays;
}


export function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


export function getRange(datesArray) {
    if (datesArray.length === 0) {
        return null;
    }


    datesArray.sort((a, b) => a - b);


    const firstDate = datesArray[0];
    const lastDate = datesArray[datesArray.length - 1];


    return {
        first: formatDate(firstDate),
        last: formatDate(lastDate)
    };
}


export function shortenedDay(date) {
    const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    return days[date.getDay()];
}


export function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    // Return array of year and week number
    return weekNo;
}


export function getWeeks(yearInput) {
    const year = (typeof yearInput === 'string' || typeof yearInput === 'number') ? parseInt(yearInput) : yearInput.getFullYear();

    const weeks = [];
    let startDate = new Date(year, 0, 1); // 1º de janeiro

    if (startDate.getUTCDay != 0) {
        startDate = moment(startDate).day("Monday").toDate()
    }

    do {
        const start = new Date(startDate);
        const end = new Date(startDate);

        // define o final da semana (sábado)
        end.setDate(end.getDate() + 6);

        const dates = [];
        for (let i = 0; i < 6; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            const formattedDate = date.toISOString().split('T')[0];
            dates.push(formattedDate);
        }

        const startWeekNormalized = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()));
        startWeekNormalized.setUTCDate(start.getUTCDate() + 4 - (start.getUTCDay() || 7));

        if (startWeekNormalized.getUTCFullYear().toString() == year) {
            weeks.push({
                week: weeks.length + 1,
                year: startWeekNormalized.getUTCFullYear().toString(),
                dates: dates,
                startDate: start,
                endDate: end,
                weekNum: getWeekNumber(start),
            });
        }

        startDate.setDate(startDate.getDate() + 7);
    } while (startDate.getUTCFullYear().toString() == yearInput)   

    return weeks;
}


export function formatDateRange(dates) {
    if (!dates.length) return "";

    const sortedDates = dates.sort((a, b) => a - b);

    const firstDate = sortedDates[0];
    const lastDate = sortedDates[sortedDates.length - 1];


    return `${formatDate(firstDate)} a ${formatDate(lastDate)}`;
}

export function getFirstAndLast(weeks, targetWeek, targetYear) {

    const weekEntry = weeks.find(week => week.week === targetWeek && week.year === targetYear);

    if (weekEntry) {
        const firstDay = weekEntry.dates[0];
        const lastDay = weekEntry.dates[weekEntry.dates.length - 1];

        return {
            firstDay,
            lastDay
        };
    } else {
        return null;
    }
}

export function getDateInFormat(inputDate, format) {
    // Verifica se inputDate é uma string e converte para objeto Date se necessário
    let date;
    if (typeof inputDate === 'string') {
        date = new Date(inputDate);
    } else if (inputDate instanceof Date) {
        date = inputDate;
    } else {
        throw new Error("Input deve ser um objeto Date ou uma string no formato 'aaaa-mm-dd'.");
    }

    // Extraindo os componentes da data
    const day = String(date.getDate()).padStart(2, '0'); // Dia com dois dígitos
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês com dois dígitos
    const year = String(date.getFullYear()); // Ano

    // Substituindo os placeholders no formato
    return format
        .replace('dd', day)
        .replace('mm', month)
        .replace('aaaa', year);
}