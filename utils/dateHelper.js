import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc'
import weekday from 'dayjs/plugin/weekday';
import duration from 'dayjs/plugin/duration';
import { semanaSanta } from './dateFunctions';


const WEEK_DAYS = Object.freeze({
    0: 'Domingo',
    1: 'Lunes',
    2: 'Martes',
    3: 'Miercoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sabado',
});

const MONTHS = Object.freeze({
    0: 'Enero',
    1: 'Febrero',
    2: 'Marzo',
    3: 'Abril',
    4: 'Mayo',
    5: 'Junio',
    6: 'Julio',
    7: 'Agosto',
    8: 'Septiembre',
    9: 'Octubre',
    10: 'Noviembre',
    11: 'Diciembre',
});

export default function DateHelper() {


    dayjs.extend(utc);
    dayjs.extend(weekday);
    dayjs.extend(duration)

    /**
     * Esta funcion se encarga de validar si el formato de fecha es valido y regresar la fecha
     * si no lo es crea una nueva fecha
     * @param {*} date 
     * @returns 
     */
    const validDate = date => {
        if (dayjs(date, 'YYYY-MM-DD', true).isValid()) return dayjs(date).utc();
        else return dayjs().utc().local().format('YYYY-MM-DD');
    }

    const getYesterdayDate = () => (dayjs.utc().subtract(1, 'day').format('YYYY-MM-DD'));

    const getToday = () => (dayjs.utc().local().format('YYYY-MM-DD'));

    const getWeekDate = date => {
        const current = validDate(date);
        return `${WEEK_DAYS[current.day()]} ${current.date()} - ${MONTHS[current.month()]}`;
    }

    const getDayName = date => {
        const current = validDate(date);
        return `${current.day()}`;
    }

    const getMonthName = date => {
        const current = validDate(date);
        return `${MONTHS[current.month()]}`;
    }

    const getCurrentYear = date => {
        const current = validDate(date);
        return current.year();
    }

    const getcurrentMonth = date => {
        const current = validDate(date);
        return current.month() + 1;
    }

    const getNextMonth = date => {
        const current = validDate(date);
        return current.add(1, 'month').month() + 1;
    }

    const getPreviousMonth = date => {
        const current = validDate(date);
        return current.subtract(1, 'month').month() + 1;
    }

    const getCurrentDate = date => {
        const current = validDate(date);
        return current.date();
    }

    const getweekRange = (date) => {
        const current = validDate(date);
        const begin = current.weekday(1).utc();
        return `SEMANA DEL ${begin.date()}-${MONTHS[begin.month()]} AL ${current.date()}-${MONTHS[current.month()]}`;
    }

    const getYesterday = () => {
        return dayjs().utc().local().subtract(1, 'day').format('YYYY-MM-DD')
    }

    const getCurrent = () => {
        return dayjs().utc().local().format('YYYY-MM-DD')
    }

    const getMinusCurrent = (years = 1) => {
        return dayjs().utc().local().subtract(years, 'year').year();
    }

    const getEasterDayWeek = (date) => {
        if (dayjs(date, 'YYYY-MM-DD', true).isValid()) {
            const current = validDate(date);
            return `${WEEK_DAYS[current.day()]}-${current.date()}-${MONTHS[current.month()].substring(0, 3)}`
        }
        return date
    }

    const getDayFromEasterWeek = (date) => {
        if (dayjs(date, 'YYYY-MM-DD', true).isValid()) {
            const current = validDate(date);
            return WEEK_DAYS[current.day()]
        }
        return date
    }

    const getYearFromEasterWeek = (date) => {
        if (dayjs(date, 'YYYY-MM-DD', true).isValid()) {
            const current = validDate(date);
            return current.year()
        }
        return date
    }

    return {
        getYesterdayDate,
        getToday,
        getWeekDate,
        getDayName,
        getMonthName,
        getCurrentYear,
        getcurrentMonth,
        getCurrentDate,
        getweekRange,
        getPreviousMonth,
        getNextMonth,
        getYesterday,
        getEasterDayWeek,
        getCurrent,
        getDayFromEasterWeek,
        getYearFromEasterWeek,
        getMinusCurrent
    }
}
