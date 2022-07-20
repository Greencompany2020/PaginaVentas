import { saveAs } from "file-saver";
import * as Excel from 'exceljs';

/**
 * Default values
 * @const {string} FILE_EXTENSION extencion por defecto de los archivos
 * @const {string} DEFAULT_FILENAME nombre por defecto del archivo
 * @const {string} DEFAULT_COLUMN columna inicial por defecto
 */
const FILE_EXTENSION = '.xlsx';
const DEFAULT_FILENAME = 'workbook';
const DEFAULT_COLUMN = 'A'

/**
 * 
 * @param {*} fileName nombre del archivo generado
 * @param {array} headers array de objetos para header personalizado
 * @param {array} columns array de objetos para columnas simples
 * @param {array} rows arra de objetos que contiene la informacion
 *  
 */
export default  function exportExcel(fileName, headers, columns, rows){
    //Crea un nuevo archivo de excel 
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet('new sheet');

    customHeader();
    createRows();

    function createRows(){
        if(rows){
            rows.forEach(row => {
                const values = Object.values(row);
                ws.addRow(values);
            });
        }
    }

    /**
     * Esta funcion crea cabeceras personalizada
     * 
     */
    function customHeader(){
        if(headers){
            let initialRow = 1;
            headers.forEach(head => {
                const props = getProps(head);
                if(props){
                    const subProps = getProps(head?.styles);
                    const cell = ws.getCell(head?.cell || DEFAULT_COLUMN + initialRow);
            
                    props.forEach(prop => {
                        cell[prop] = head[prop];
                    });

                    if(subProps){
                        subProps.forEach(prop => {
                            cell[prop] = head.styles[prop];
                        });
                    }
                    if(hasProp(head, 'merge')) ws.mergeCells(head.merge);
                }
            });
        }
    }

    /**
     * Esta funcion evalua si el objeto tiene una propiedad especifica
     * @param {object} obj  objeto a evaluar
     * @param {string} prop propiedad a comparar
     * @returns retorna verdadero o false
     */
    function hasProp(obj, prop){
        if(obj && prop) return Object.hasOwn(obj, prop);
        return false;
    }

    /**
     * Esta funcion obtiene todos las propiedades de un objeto
     * @param {object} obj objeto donde se tienen las propiedades
     * @returns retorna un array con las propiedades
     */
    function getProps(obj){
        if(obj) return Object.getOwnPropertyNames(obj);
        return null;
    }

    /**
     * Escribe el buffer del arivho y lo descarga para el cliente
     * si el archivo no tiene nombre usara el nombre por defecto
     */
    wb.xlsx.writeBuffer().then(buffer => {
        saveAs(new Blob([buffer], {type:'application/octet-stream'}),`${fileName || DEFAULT_FILENAME}${FILE_EXTENSION}`)
    }).catch(err => {
        console.error(err);
    });

}






