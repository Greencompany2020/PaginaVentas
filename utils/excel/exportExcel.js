import { saveAs } from "file-saver";
import * as Excel from 'exceljs';

/**
 * Valores por defecto
 * @const {string} FILE_EXTENSION Extencion de los arvhivos por defecto
 * @const {string} DEFAULT_FILENAME Nombre default del archivo
 * @const {string} DEFAULT_SHEETNAME Nombre por defecto de la hoja
 * @const {object} DEFAULT_CONFIG Objeto de configuracion
 */

const FILE_EXTENSION = '.xlsx';
const DEFAULT_FILENAME = 'Workbook';
const DEFAULT_SHEETNAME = 'Sheet 1';
const DEFAULT_CONFIG = {
    ignoreAutoMargin: false, 
    margin:5
}


/**
 * Funcion principal del exportador
 * @param {*} filename - Nombre del archivo de excel 
 * @param {*} columns  - Columnas o encabezado del documento
 * @param {*} rows  - filas del documento
 * @param {*} format  - objeto de configuracion de estilos y formatos
 * @param {*} sheetNames - Nombres de las hojas del excel,
 * @param {object} config - objeto de configuracion
 * @param {boolean} config.ignoreAutoMargin - ignorar el maring automatico de las celdas,
 * @param {number} config.margin - margin adicional en pixeles
 */
export default function exportExcel(filename, columns, rows, format, sheetNames = DEFAULT_SHEETNAME, config = {...DEFAULT_CONFIG }){
    try {
        //Se crea el objeto principal de excel
        const wb = new Excel.Workbook();
        const arr = arrType(rows);
        
        if(arr === 'plain'){
            const sheet = Array.isArray(sheetNames) ? sheetNames[0] : sheetNames;
            addSheet(wb, columns, rows, sheet, format, config);
        }
        else if(arr === 'nested'){
            Object.entries(rows ?? {}).forEach(([key, value], i) => {
                const sheet = Array.isArray(sheetNames) ? sheetNames[i] : `${sheetNames} ${i}`;
                addSheet(wb, columns, value, sheet, format, config);
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
                    case 'format':
                        const currentCellFormat = getTypeof(value);
                        if(hasAttribute(format.format, currentCellFormat)) cell.numFmt = format.format[currentCellFormat];
                        break;
                    case 'cols':
                       const colsAttr = getAttributes(format.cols);
                       colsAttr.forEach(col => {
                            if(address.match(col, 'ig')) cell.style = {...format.cols[col]};
                       });
                       break;
                }   
            });
        }
    }
}

/**
 * Esta funcio agrega un margin a las columnas
 * @param {*} ws workbook actual 
 * @param {*} initialDataRow primera fila de datos
 * @param {*} margin margin en pixceles
 */
const setAutoMargin = (ws, initialDataRow, margin) => {
    for(let colNumber = 1; ws.actualColumnCount > colNumber; colNumber ++){
        const currentCol = ws.getColumn(colNumber);
        const cellValues = [];
        currentCol.eachCell((cell, row) => {
          if(row > initialDataRow)cellValues.push(String(cell.value || 0).length)
        });
        const  maxWidth = Math.max(...cellValues);
        currentCol.width = maxWidth + margin;
    }
}


/**
 * Esta funcion se encarga de agregar una nueva sheet 
 * @param {*} wb workbook actual
 * @param {*} columns columnas 
 * @param {*} rows filas
 * @param {*} sheetname nombre de la sheet
 * @param {*} format formatos
 * @param {object} config Objeto de configuracion
 */
const addSheet  = (wb, columns, rows , sheetname, format, config) =>{
    const ws = wb.addWorksheet(sheetname);
    let initialDataRow = 0;

    //Agrega las columnas al documento
    columns.forEach(col => {
        const attributes = getAttributes(col);
        if(attributes){
            const cell = ws.getCell(col.cell);
            cell.value = col.value;
            setFormat(col, ws, cell);
        }
    });

    //Agrega las filas al documento
    rows.forEach(row => {
        const rowValues = Object.values(row);
        ws.addRow(rowValues);
        const currentRows = ws.getRow(ws.actualRowCount);
        if(format) currentRows.eachCell( cell => {
            setFormat (format, ws, cell);
        });
        if(initialDataRow == 0) initialDataRow = ws.actualRowCount;
    });

    if(config.ignoreAutoMargin == false) setAutoMargin(ws, initialDataRow, config.margin);
    
}
