import { saveAs } from "file-saver";
import * as Excel from 'exceljs';

/**
 * Valores por defecto
 * @const {string} FILE_EXTENSION Extencion de los arvhivos por defecto
 * @const {string} DEFAULT_FILENAME Nombre default del archivo
 * @const {string} DEFAULT_SHEETNAME Nombre default de la tab
 * @const {string} INITIAL_COL Columna inicial del reporte
 */

const FILE_EXTENSION = '.xlsx';
const DEFAULT_FILENAME = 'Workbook';
const DEFAULT_SHEETNAME = 'Sheet 1';
const INITIAL_COL = 'A'

/**
 * Funcion principal del exportador
 * @param {*} filename 
 * @param {*} columns 
 * @param {*} rows 
 * @param {*} sheetNames 
 * @param {*} format 
 */
export default function exportExcel(filename, columns, rows, format, sheetNames){
    try {
        //Se crea el objeto principal de excel
        const wb = new Excel.Workbook();
        const arr = arrType(rows);
        
        if(arr === 'plain'){
            addSheet(wb, columns, rows, '1', format);
        }else if(arr === 'nested'){
            Object.entries(rows ?? {}).forEach(([key, value]) => {
                addSheet(wb, columns, value, key, format);
            });
        }

        //Esta promesa escribe el archivo de lo decarga
        wb.xlsx.writeBuffer().then(buffer => {
            saveAs(new Blob([buffer], {type:'application/octet-stream'}),`${filename || DEFAULT_FILENAME}${FILE_EXTENSION}`)
        }).catch(err => {
            console.error(err);
        });

    } catch (error) {
        throw error;
    }
}


/**
 * Obtiene los atributos de los objetos
 * @param {*} obj Objeto 
 * @returns 
 */
const getAttributes = obj => {
    if(typeof(obj) === 'object'){
        return  Object.getOwnPropertyNames(obj);
    }else{
        return null;
    }
}

/**
 * Evalua si el objeto tiene la propiedad indicada
 * @param {*} obj Objeto a evaluar
 * @param {*} attr Propiedad indicada
 * @returns 
 */
const hasAttribute = (obj, attr) => {
    if(typeof(obj) === 'object'){
        return Object.hasOwn(obj, attr)
    }else{
        return null;
    }
}

/**
 * Evalua el tipo dato de un valor
 * @param {*} val Valor a evaluar
 * @returns 
 */
const getTypeof = val => {
    switch(typeof(val)){
        case 'string':
            return 'text';

        //Si el tipo numero tiene un - al inicio es negativo y si tiene solo un . es decimal si no es entero
        case 'number':
            if(String(val).includes('-')) return 'negative';
            else if(String(val).includes('.')) return 'decimal'
            else return 'number'
        
        //si el tipo de dato no se encuantre especificado, retorna como valor general
        default:
            return 'general'
    }
}

/**
 * Evalua el tipo de objeto
 * @param {*} obj objeto a evaluar
 * @returns Si el objeto es un array retorna plain, 
 * si es un objeto con array de primer niver retorna nested,
 * si el objeto no cumple con ninguna de esas condiciones retorna notArr
 */
const arrType = obj => {
    if(Array.isArray(obj)) return 'plain';
    else if(Object.entries(obj).every(([key]) => Array.isArray(obj[key]))) return 'nested';
    else return 'notArr'
}


/**
 * Esta funcion se encarga aplicar los estilos y atributos de la plantilla
 * @param {*} format formato de la platilla
 * @param {*} ws worksheet actual
 * @param {*} cell celada actual
 */
const setFormat = (format, ws, cell) => {
    if(format){
        const attributes = getAttributes(format);
        const {address, value} = cell;
        
        if(attributes){
            attributes.forEach(attr => {
                switch(attr){
                    case 'styles':
                        cell.style = {...format.styles};
                        break;
                    case 'merge':
                        ws.mergeCells(format.merge)
                        break;
                    case 'cellFormat':
                        const currentCellFormat = getTypeof(value);
                        if(hasAttribute(format.cellFormat, currentCellFormat)) cell.numFmt = format.cellFormat[currentCellFormat];
                        break;
                    case 'cols':
                       const colsAttr = getAttributes(format.cols);
                       colsAttr.forEach(col => {
                            if(address.match(col, 'ig')) cell.style = {...format.cols[col].styles};
                       });
                       break;
                }   
            });
        }
    }
}

/**
 * Esta funcion se encarga de agregar una nueva sheet 
 * @param {*} wb workbook actual
 * @param {*} columns columnas 
 * @param {*} rows filas
 * @param {*} sheetname nombre de la sheet
 * @param {*} format formatos
 */
const addSheet  = (wb, columns, rows , sheetname, format) =>{
    const ws = wb.addWorksheet(sheetname);

    columns.forEach(col => {
        const attributes = getAttributes(col);
        if(attributes){
            const cell = ws.getCell(col.cell);
            cell.value = col.value;
            setFormat(col, ws, cell);
        }
    });

    rows.forEach(row => {
        const rowValues = Object.values(row);
        ws.addRow(rowValues);
        const currentRows = ws.getRow(ws.actualRowCount);
        if(format) currentRows.eachCell( cell => setFormat (format, ws, cell));
    });
}
