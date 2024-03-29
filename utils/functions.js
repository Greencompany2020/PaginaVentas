import { getDay } from "date-fns";
import { concentradoPlazas, dias, meses, plazas, regiones, tiendas, regionesTiendas } from "./data";
import { getMonthByNumber, getMonthChars } from "./dateFunctions";

/**
 * Obtiene el nombre de la tienda a partir del identificador de la misma.
 * @param {string} tiendaId 
 * @returns {string} El nombre de la tienda.
 */
export const getTiendaName = (tienda, shops = []) => {
  if(shops.length > 0){
    const current =  shops.find(item => (item.EmpresaWeb + item.NoTienda) == tienda );
    return current.Descrip;
  }
  return 'No identificada';
  
}
/**
 * Obtiene el nomber de la plaza en base al identificador de la misma.
 * @param {number} plazaId 
 * @returns {string} El nombre de la plaza.
 */
export const getPlazaName = (plaza, places = []) => {
  if(places.length > 0 ) {
    const current = places.find(item => item.NoEmpresa == plaza);
    return current.DescCta;
  }
  return 'Sin indentificar'
}
/**
 * Obtiene los 2 últimos dígitos del años. Ej.
 * 
 * - 2021 -> 21
 * 
 * @param {number} date El año
 * @returns {string} String con los 2 dígitos.
 */
export const getLastTwoNumbers = (date) => {
  return date?.toString().slice(2);
}

/**
 * Obtiene el día de la semana y las iniciales del mes
 * a partir de la fecha ingresada.
 * @param {string} date fecha en formato yyyy-MM-dd
 * @returns {string} El día de las semana y las iniciales del mes.
 */
export const getDayWeekName = (date) => {
  const dateParts = date?.split("-");
  const month = getMonthChars(getMonthByNumber(dateParts[1]));
  return `${dateParts[2]}-${month}`;
}
/**
 * Crear un texto de título a partir del rango de fechas ingresado. Ej.
 * - beginDate: 2022-02-14
 * - endDate: 2022-02-20
 * - string: del 14 de Feb del 2022 Al 20 de Feb del 2022
 * @param {string} beginDate Fecha de inicio de rango
 * @param {string} endDate Fecha de fin de rango
 * @returns {string}
 */
export const dateRangeTitle = (beginDate, endDate) => {
  let beginTextDate = "";
  let endTextDate = "";

  let beginDateParts = beginDate.split("-");
  let endDateParts = endDate.split("-");

  let beginMonth = getMonthByNumber(beginDateParts[1]);
  beginMonth = getMonthChars(beginMonth);

  let endMonth = getMonthByNumber(endDateParts[1]);
  endMonth = getMonthChars(endMonth);

  beginTextDate = `${beginDateParts[2]} de ${beginMonth} del ${beginDateParts[0]}`;
  endTextDate = `${endDateParts[2]} de ${endMonth} del ${endDateParts[0]}`;

  return `del ${beginTextDate} Al ${endTextDate}`;
}

/**
 * Valida si las fechas tienen el formato adecuado y si la fecha de inicio es
 * menor a la fecha de fin.
 * @param {string} beginDate Fecha de inicio del rango
 * @param {string} endDate Fecha de fin del rango
 * @returns {boolean} false si las fechas no tienen el formato adecuado.
 */
export const validateInputDateRange = (beginDate, endDate) => {
  const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
  return (dateRegex.test(beginDate) && dateRegex.test(endDate) && (Date.parse(beginDate) < Date.parse(endDate)))
};
/**
 * Valida si la fecha tiene el formato yyyy-MM-dd.
 * @param {string} date String de la fecha
 * @returns {boolean} false si la fecha no tiene el formato adecuado.
 */
export const validateDate = (date) => {
  const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
  return dateRegex.test(date);
}

/**
 * Obtiene el valor de la tienda que estará por defecto.
 * @returns {object[]} El identificador de la tienda
 */
export const getInitialTienda = (tiendas) => {
  if(tiendas){
    return `${tiendas[0]?.EmpresaWeb}${tiendas[0]?.NoTienda}`;
  }
  return false;
}
/**
 * Obtiene el valor de la plaza que estará por defecto.
 * @returns {number} El identificador de la plaza
 */
export const getInitialPlaza = (plazas) => {;
  if(plazas){
    return plazas[0]?.NoEmpresa;
  }
  return false;
};
/**
 * Crea los array de etiquetas y de dato para la gráfica de barras.
 * El objeto debe poseer las siguiete estructura:
 * 
 * - DescGraf
 * - Venta2022
 * - Venta2021
 * - Venta2020
 * 
 * El nombre los campos de ventas son dinámicos, por ello se utilizan
 * el año de inicio y de fin para obtener los datos.
 * 
 * @param {object[]} data Los datos para crear el dataset
 * @param {numbe} fromYear El año de inicio del intervalo
 * @param {number} toYear El año de fin del intervalo
 * @param {Dispatch<SetStateAction<any[]>>} updateLabels setState para las etiquetas
 * @param {Dispatch<SetStateAction<any[]>>} updateDatasets setState para el dataset
 */
export const createDatasets = (data, fromYear, toYear, updateLabels, updateDatasets) => {
  const colors = ['#991b1b', '#9a3412', '#3f6212', '#065f46', '#155e75'];

  if (data?.length !== 0) {
    let labels = [];
    labels = data.map(item => item.DescGraf);
    updateLabels(labels);

    let datasets = [];
    let colorIndex = 0;
    let dataSetIndex = 1;
    for (let i = toYear; i >= fromYear; i--) {

      datasets.push({
        id: dataSetIndex,
        label: `${i}`,
        data: data.map(item => item[`Venta${i}`]),
        backgroundColor: colors[colorIndex]
      });

      colorIndex++;
      dataSetIndex++;

      if (colorIndex === colors.length) {
        colorIndex = 0;
      }
    }

    updateDatasets(datasets);
  } else {
    updateLabels([]);
    updateDatasets([]);
  }
}

/**
 * Crea los array de etiquetas y de dato para la gráfica de barras.
 * El objeto debe poseer las siguiete estructura:
 * 
 * - Descrip
 * - Ventas
 * 
 * @param {object[]} data Los datos base para crear el dataset
 * @param {Dispatch<SetActionState<any[]>>} updateLabels setState para las etiquetas
 * @param {Dispatch<SetActionState<any[]>>} updateDataset setState para el dataset
 */
export const createSimpleDatasets = (data, updateLabels, updateDataset) => {
  if (data?.length !== 0) {
    let labels = data?.map(item => item.Descrip);
    let datasetItem = {};
    let datasets = [];

    datasetItem.id = 1;
    datasetItem.label = '';
    datasetItem.data = data?.map(item => item.Ventas);
    datasetItem.backgroundColor = '#155e75';

    datasets.push(datasetItem);

    updateLabels(labels);
    updateDataset(datasets);
  } else {
    updateLabels([]);
    updateDataset([]);
  }
}
/**
 * Obtiene el titulo de la tabla en base al nombre del campo.
 * @param {string} name El nombre del campo
 * @returns El componente de titulo del nombre de la tabla
 */
export const getTableName = (name) => {
  if (name?.toLowerCase().includes("frogs") && !name?.toLowerCase().includes("proyectos")) {
    return (<h2 className='text-center text-sm font-bold'>Tiendas Frogs</h2>);
  } else if (name?.toLowerCase().includes("web")) {
    return (<h2 className='text-center text-sm font-bold'>Tienda en Línea</h2>);
  } else if (name?.toLowerCase().includes("proyectos")) {
    return (<h2 className='text-center text-sm font-bold'>Tiendas Frogs - Proyectos</h2>);
  } else if (name?.toLowerCase().includes("skoro")) {
    return (<h2 className='text-center text-sm font-bold'>Tiendas Skoro</h2>);
  }
}
/**
 * Valida que los años sean de 4 número (2000) y que el year1
 * sea menor year2
 * @param {number} year1 El primer año a validar
 * @param {number} year2 El segundo año a validar
 * @returns {boolean} Si lo años son validos
 */
export const validateYearRange = (year1, year2) => {
  return (year1?.toString().length === 4 && year2?.toString().length === 4) && year1 < year2;
}
/**
 * Valida que los meses no sean 0 y que el mes 1 es menor al mes 2.
 * @param {number} month1 El número del primer mes a validar
 * @param {number} month2 El número del segundo mes a validar
 * @returns {boolean}
 */
export const validateMonthRange = (month1, month2) => (month1 <= month2) && (month1 !== 0 && month2 !== 0);
/**
 * Crea los array de etiquetas y de dato para la gráfica de barras.
 * 
 * @param {object[]} data Los datos para crear el dataset
 * @param {numbe} fromYear El año de inicio del intervalo
 * @param {number} toYear El año de fin del intervalo
 * @param {Dispatch<SetStateAction<any[]>>} updateLabels setState para las etiquetas
 * @param {Dispatch<SetStateAction<any[]>>} updateDatasets setState para el dataset
 */
export const createMesesAgnosGrupoDataset = (data, fromYear, toYear, updateDataset, updateLabels) => {
  const colors = ['#006400', '#daa520', '#6495ed', '#ff7f50', '#98fb98'];

  if (data?.length !== 0) {
    let labels = [];
    labels = data.map(item => item?.Mes ? getMonthByNumber(item.Mes) : item.titulo);
    updateLabels(labels);

    let datasets = [];
    let colorIndex = 0;
    let dataSetIndex = 1;
    for (let i = toYear; i >= fromYear; i--) {
      let ventas = data.map(item => item[`Ventas${i}`]);
      let ventasPrev = data.map(item => item[`Ventas${i - 1}`] ?? 0)

      datasets.push({
        id: dataSetIndex,
        label: `${i} ${calculateCrecimiento(ventas, ventasPrev)}%`,
        data: data.map(item => Math.floor(item[`Ventas${i}`])),
        backgroundColor: colors[colorIndex]
      });

      colorIndex++;
      dataSetIndex++;

      if (colorIndex === colors.length) {
        colorIndex = 0;
      }
    }

    updateDataset(datasets);
  } else {
    updateLabels([]);
    updateDataset([]);
  }
}

/**
 * Calcula el crecimiento de ventas o presupuestos.
 * 
 * @see {@link calculatePromedio}
 * @param {number[]} currentData Lista de datos del año actual.
 * @param {number[]} prevData Lista de datos del año anterior.
 */
export const calculateCrecimiento = (currentData, prevData) => {
  const sumTotal = currentData.reduce((acc, curr) => acc + curr);
  const sumTotalPrev = prevData.reduce((acc, curr) => acc + curr);

  const porcentaje = calculatePromedio(sumTotal, sumTotalPrev);

  return porcentaje;
}
/**
 * Calcula el promedio en base a la fórmula:
 * 
 * - (cant1 / cant2 - 1) * 100
 * 
 * @param {number} cant La cantidad sobre la que se va a calcular el promedio.
 * @param {number} baseCant La cantidad base para el cálculo del promedio.
 * @returns {string} Un string con el premedio con decimales
 */
export const calculatePromedio = (cant, baseCant) => {
  if (baseCant === 0) return 0;
  return ((cant / baseCant - 1) * 100).toFixed(1);
}

export const validateYear = (year) => year > 1999 && year.toString().length === 4;
/**
 * Obtiene el nombre del dia, número y mes a partir de la fecha ingresada. Ej.
 * 
 * - 2022-04-08 -> Viernes 08-Abr
 * 
 * @param {string} date La fecha en formato yyyy-MM-dd
 * @returns {string} Un string con el nombre, número y mes.
 */
export const getDayName = (date) => {
  if (!validateDate(date)) return date;
  const weekDay = getDayWeekName(date)
  const dayName = dias.find(dia => dia.value === getDay(Date.parse(date)));
  return `${dayName?.text} ${weekDay}`
}
/**
 * Añade el color de fondo de la fila en base si el nombre
 * es de una plaza o de la región.
 * @param {object} item Objeto con el campo tienda
 * @returns {string} La clase de tailwind del color de fondo.
 */
export const rowColor = (item) => {
  if (concentradoPlazas.findIndex(plaza => plaza === item.tienda) !== -1) {
    return "bg-gray-200 font-semibold";
  }
  if (regiones.includes(item.tienda)) {
    return "bg-gray-300 font-bold";
  }
  return ""
}

/**
 * 
 * @param {*} item 
 * @returns 
 */

export const rowRegion = item => {
  if(plazas.findIndex(plaza => plaza.text === item ) !== -1){
    return "bg-gray-200 font-semibold";
  }
  if(regiones.includes(item)){
    return "bg-gray-300 font-bold";
  }
}

/**
 * Regresa si la linea actual es de una plaza
 * @param {*} item 
 * @returns 
 */
export const isPlaza = (item) => {
  if (concentradoPlazas.findIndex(plaza => plaza === item.tienda) !== -1) {
    return true;
  }
  return false;
}
/**
 * Hace un splice de la data por regiones,
 * funciona si la data esca contenida dentro de un objeto
 * @param {*} data 
 * @returns 
 */
export const spliceByRegion = (data) => {
  const replaced = {};
  Object.entries(data ?? {})?.map(([key,value]) => {
    let initial = 0;
    regiones.forEach (region => {
      const final = value.findIndex(el => el.tienda == region);
      if(final != -1){
        const temp = value.slice(initial, final + 1);
        if(temp.length > 0) Object.assign(replaced, {[region]: temp});
        initial = final + 1;
      }
    });

  });

  Object.assign(replaced, {"TOTAL": getTotalsFromShops(data)});
  return replaced;
}

/**
 * Obtiene el total de la plazas, se ejecuta junto con spliceByRegion
 * @param {*} data 
 * @returns 
 */
const getTotalsFromShops = data => {
  const replaced = {};
  Object.entries(data ?? {})?.map(([key, value]) => {
    if(value){
      const temp = value.find( row => row.tienda == 'TOTAL');
      Object.assign(replaced, {[key]: temp})
    }
  });
  return replaced;
}
/**
 * Obtiene el nombre de la tienda segun la region
 * @param {*} region 
 * @returns 
 */
export const getShopNameByRegion = region => {
  switch (region){
    case "REGION I":
      return "Tiendas frogs";
    case "REGION II":
      return "Tiendas frogs";
    case "REGION III":
      return "Tiendas frogs";
    case "WEB":
      return "Web";
    default:
      return "Tiendas Frogs"
  }
}

/**
 * Oobtiene la data ya la regresa en regiones
 * esta funcion solo funciona si la data esta contenida en un array
 * @param {*} data 
 * @returns 
 */
export const spliceByRegionShops = data =>{
  const replaced = {};
  if(Array.isArray(data)){
    let initial = 0;
    regionesTiendas.forEach(region=>{
      const final = data.findIndex(item => item.plaza === region);
      if(final !== -1){
        const temp = data.slice(initial, final + 1);
        if(temp.length > 0) Object.assign(replaced, {[region]: temp});
        initial = final + 1;
      }
    });
  }
  return replaced;
}
/**
 * Crear un texto de título a partir del rango de fechas ingresado. Ej.
 * - beginDate: 2022-04-08
 * - endDate: 2022-04-11
 * - string: Del Viernes 08-Abr al Lunes 11-Abr 
 * @param {string} beginDate La fecha de incio del rango
 * @param {string} endDate La fecha de fin de rango
 * @returns {string}
 */
export const dateRangeTitleSemanaSanta = (beginDate, endDate) => {
  const beginWeekDay = getDayName(beginDate);
  const endWeekDay = getDayName(endDate);

  return `Del ${beginWeekDay} al ${endWeekDay}`;
}
/**
 * Crea los array de etiquetas y de datos para la gráfica de barras en presupuestos.
 * 
 * @param {object[]} data Los datos base para crear el dataset
 * @param {number} agno El Año para las etiquetas.
 * @param {Dispatch<SetActionState<any[]>>} updateLabels setState para las etiquetas
 * @param {Dispatch<SetActionState<any[]>>} updateDataset setState para el dataset
 */
export const createPresupuestoDatasets = (data, agno, updateLabels, updateDataset) => {
  const colors = ['#047857', '#0E7490', '#1D4ED8'];

  if (data?.length !== 0) {
    const labels = [];
    const ventasDataset = [];

    const ventasActual = data?.map((venta) => venta.ventaActual);
    const presupuestos = data?.map((venta) => venta.presupuesto);
    const ventasAnterior = data?.map((venta) => venta.ventaAnterior);

    for (let venta of data) {
      const month = meses.find((mes) => mes.value === venta.mes)?.text ?? "ACUM";

      const label = `${month} ${venta.porcentaje}%`;

      labels.push(label);
    }

    const ventasActualesData = {
      label: `Ventas ${agno}`,
      data: ventasActual,
      backgroundColor: colors[0]
    };

    ventasDataset.push(ventasActualesData);

    const presupuesto = {
      label: 'Presupuesto',
      data: presupuestos,
      backgroundColor: colors[1]
    };
    ventasDataset.push(presupuesto);

    const ventasAnteriorData = {
      label: `Ventas ${agno - 1}`,
      data: ventasAnterior,
      backgroundColor: colors[2]
    };

    ventasDataset.push(ventasAnteriorData)

    updateDataset(ventasDataset)
    updateLabels(labels);
  } else {
    updateDataset([]);
    updateLabels([]);
  }
}
/**
 * Crea los array de etiquetas y de datos para la gráfica de barras para operaciones.
 * 
 * @param {object[]} data Los datos base para crear el dataset
 * @param {number} agno El Año para las etiquetas.
 * @param {Dispatch<SetActionState<any[]>>} updateLabels setState para las etiquetas
 * @param {Dispatch<SetActionState<any[]>>} updateDataset setState para el dataset
 */
export const createOperacionesDatasets = (data, agno, updateLabels, updateDataset) => {
  const colors = ['#047857', '#0E7490', '#1D4ED8'];

  if (data?.length !== 0) {
    const labels = [];
    const operacionesDataset = [];

    const operacionesActual = data?.map((operacion) => operacion.operacionesActual);
    const operacionesAnterior = data?.map((operacion) => operacion.operacionesAnterior);

    for (let operacion of data) {
      const month = meses.find((mes) => mes.value === operacion.mes)?.text ?? "ACUM";

      const label = `${month} ${operacion.porcentaje}%`;

      labels.push(label);
    }

    const operacionesActualesData = {
      label: agno,
      data: operacionesActual,
      backgroundColor: colors[0]
    };

    operacionesDataset.push(operacionesActualesData);

    const operacionesAnteriorData = {
      label: agno - 1,
      data: operacionesAnterior,
      backgroundColor: colors[1]
    };

    operacionesDataset.push(operacionesAnteriorData)

    updateDataset(operacionesDataset)
    updateLabels(labels);
  } else {
    updateDataset([]);
    updateLabels([]);
  }
}
/**
 * Crea los array de etiquetas y de datos para la gráfica de barras en rango de ventas.
 * 
 * @param {object[]} data Los datos base para crear el dataset
 * @param {Dispatch<SetActionState<any[]>>} updateLabels setState para las etiquetas
 * @param {Dispatch<SetActionState<any[]>>} updateDataset setState para el dataset
 */
export const createRangoVentasDataset = (data, updateLabels, updateDataset) => {
  const bgColors = [
    'rgba(255, 100, 94, 0.5)',
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(0, 128, 128, 0.2)',
    'rgba(106, 90, 205, 0.2)',
    'rgba(205, 133, 63, 0.2)',
    'rgba(107, 142, 35, 0.2)',
  ];

  const borderColor = [
    'rgba(255, 100, 94, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(0, 128, 128, 1)',
    'rgba(106, 90, 205, 1)',
    'rgba(205, 133, 63, 1)',
    'rgba(107, 142, 35, 1)',
  ]

  if (data && data?.length !== 0) {
    const labels = [];
    const rangosVentas = [];

    labels = data?.map((rango) => rango.rango);

    let dataItem = {
      data: data?.map((rango) => rango.venta),
      backgroundColor: bgColors.slice(0, data?.length),
      borderColor: borderColor.slice(0, data?.length),
      borderWidth: 1
    }

    rangosVentas.push(dataItem)

    updateLabels(labels);
    updateDataset(rangosVentas);
  } else {
    updateLabels([]);
    updateDataset([]);
  }
}
/**
 * Comprueba que el objecto pasado sea una instancia de
 * Error.
 * @param {object} obj El objeto a verificar
 * @returns {boolean}
 */
export const isError = (obj) => obj instanceof Error;

/**
 * Agrupa los arreglo de objetos
 * @param {object} object 
 * @param {string}} key 
 * @returns {object} 
 */
export const groupBykey = (object, key) => {
  return object.reduce((pre, next) => {
    (pre[next[key]] = pre[next[key]] || []).push(next);
    return pre;
  },[]);
}

/**
 * Pagina los resultados
 * @param {*} data Data que se va a paginar
 * @param {*} show  Total de registros a mostrar por pagina
 * @param {*} current Pagina actual
 * @returns 
 */

export const sliceFilter = (data, show ,current) =>{
  const dataLength = data.length;
  const pages = Math.ceil(dataLength / show);
  const limit = current * show;
  const offset = (current == 1) ? 0 : limit - show;
  const slicer = data.slice(offset, limit);
  return {
      slicer,
      pages
  }
}

/**
 * Genera una llave key con timestamp
 * @param {*} pre 
 * @returns 
 */
export const generateLivKey = (pre) => {
  return `${pre}_${Date.now()}`
}

/**
 * Retorna una objeto divido por las llaves que el usuario le indique
 * @param {*} data 
 * @param {*} keys 
 * @returns 
 */
export const spliceData = (data, keys) => {
  const replaced = {};
  if(Array.isArray(data) && data.length > 0 && keys){
    let initial = 0;
    keys.forEach(key =>{
      const final = data.findIndex(item => item.plaza === key);
      if(final !== -1){
        const temp = data.slice(initial, final + 1);
        if(temp.length > 0) Object.assign(replaced, {[key]: temp});
        initial = final + 1;
      }
    });
    return replaced;
  }
  return null;
}

export const spliceDataObject = (data, keys, unifiedKey = null) => {
  const replaced = {};
  if(Object.keys(data).length > 0 && keys){
    Object.entries(data ?? {})?.map(([key,value]) => {
      keys.forEach (itemKey => {
        const final = value.findIndex(el => el.plaza == itemKey);
        if(final != -1){
          const temp = value.slice(final ,final + 1);
          if(temp.length > 0) Object.assign(replaced, {[itemKey]: temp});
        }
      });
    });
    if( unifiedKey) Object.assign(replaced, {[unifiedKey]: getTotalFromDataObject(data, unifiedKey)});
    return replaced;
  }
  return null;
}

const getTotalFromDataObject = (data, unifiedKey) => {
  const replaced = {};
  Object.entries(data ?? {})?.map(([key, value]) => {
    if(value){
      const temp = value.find( row => row.plaza == unifiedKey);
      Object.assign(replaced, {[key]: temp})
    }
  });
  return replaced;
}

export const getValueFromObject = (data, findKey=null) => {
  if(Object.keys(data).length > 0 && findKey){
    const temp= Object.entries(data?? {})?.map(([key,value]) => (value.map(item => item[findKey])));
    const tempFlat = temp.flat();
    const unique = [... new Set(tempFlat)];
    return unique;
  }
  return null;
}

export const spliteArrDate = (arr, cb = 1) => {
  const currentYear = new Date(Date.now()).getFullYear() - 1;
  if(arr){
    const arrTemp = arr.split(',');
    if(arrTemp.length == 1) arrTemp.push(arrTemp[0] - 1)
    return arrTemp;
  }
  else{
    const arrTemp = [currentYear - 1 ,currentYear - 2];
    return arrTemp;
  }

}

export const isSecondDateBlock = cb => {
  if(cb == 1) return true
  else return false;
}

/**
 * Convierte valores con Y a booleans
 * @param {*} val 
 * @returns 
 */
export const parseStringToBoolean = val => (String(val).toUpperCase === 'Y');

/**
 * Convierte valores booleanos a strings
 * @param {*} val 
 * @returns 
 */
export const parseBooleanToString = val => (val ? 'Y' : 'N');

/**
 * Convierte valores booleanos o strings a numeros
 * @param {*} val 
 * @returns 
 */
export const parseToNumber = val => {
  switch (typeof val){
    case 'boolean':
      return val ? 1  : 0;
    case 'string':
      return  parseStringToBoolean(val) ? 1 : 0;
    default:
      return 0;
  }
}

/**
 * Convierte valores numericos a booleanos
 * @param {*} val 
 * @returns 
 */
export const parseNumberToBoolean = val => (val == 1 ? true : false);


/**
 * Convierte los parametros en el tipo de dato solicitado
 * @param {*} params 
 */
export const parseParams = params => {
  const parse = {};
  for (const param  in params){
    const value = params[param];
    let newValue;
    switch(typeof value){

      case 'string':
        if(value.toUpperCase == 'N' || value.toLocaleUpperCase == 'Y'){
          newValue = parseToNumber(value);
        }else{
          newValue = value;
        }
        break;

      case 'boolean':
        newValue = parseToNumber(value);
        break;
      
      default:
        newValue = value;
    }
    Object.assign(parse, {[param]:newValue});
  }
  return parse;
}
