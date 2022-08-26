import { data } from 'autoprefixer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import weekday from 'dayjs/plugin/weekday';


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

export default function DateHelper(){
    
    
    dayjs.extend(utc);
    dayjs.extend(weekday);

    /**
     * Esta funcion se encarga de validar si el formato de fecha es valido y regresar la fecha
     * si no lo es crea una nueva fecha
     * @param {*} date 
     * @returns 
     */
    const validDate = date => {
        if (dayjs(date, 'YYYY-MM-DD', true).isValid()) return dayjs(date).utc();
        else return dayjs().utc();
    }

    const getYesterdayDate = () => (dayjs.utc().subtract(1, 'day').format('YYYY-MM-DD'));

    const getToday = () => (dayjs.utc().format('YYYY-MM-DD'));

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
        return current.month();
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

    return{
        getYesterdayDate,
        getToday,
        getWeekDate,
        getDayName,
        getMonthName,
        getCurrentYear,
        getcurrentMonth,
        getCurrentDate,
        getweekRange
    }
}
