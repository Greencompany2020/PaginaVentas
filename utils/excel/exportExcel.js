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
 * @param {array} columns array de objetos para header personalizado
 * @param {array} rows arra de objetos que contienen la informacion
 * @param {*} fileName nombre del archivo generado
 *  
 */
export default  function exportExcel(fileName, columns,  rows, styles){
    //Crea un nuevo archivo de excel 
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet('new sheet');


    AddColumns();
    Addrows();


    /**
     * Esta funcion se encarga de crear las columnas
     * ademas de agregar las propiedades de las mismas
     */
    function AddColumns(){
        if(columns){
            let initialRow = 1;
            columns.forEach(head => {
                const props = getProps(head);
                if(props){
                    const subProps = getProps(head?.styles);
                    const cell = ws.getCell(head?.cell || DEFAULT_COLUMN + initialRow);
            
                    //agrega el value y cualquier otra propiedad que no este relacionada al style
                    props.forEach(prop => {
                        cell[prop] = head[prop];
                    });

                    //agrega el stylo de la plantilla 
                    if(subProps){
                        subProps.forEach(prop => {
                            cell[prop] = head.styles[prop];
                        });
                    }

                    //si la paltilla tiene merge se lo asigna
                    if(hasProp(head, 'merge')) ws.mergeCells(head.merge);
                }
            });
        }
    }

    /**
     * Esta funcion se encarga de crear las filas
     * 
     */
     function Addrows(){
        if(rows){
            rows.forEach(row => {
                const values = Object.values(row);
                ws.addRow(values);
                const currentRow = ws.getRow(ws.actualRowCount);
                currentRow.eachCell(cell => {
                    appliedCellStyle(cell);
                });
            });
        }
    }

    /**
     * Esta funcion evalua si el objeto tiene una propiedades especifica
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
     * Esta funcion regresa el tipo de dato del valor
     * @param {*} value valor a evaluar el tipo de dato
     * @returns 
     */
    function getTypeof(value){
        switch(typeof(value)){

            case 'string':
                return 'text';

            //realiza una evaluacion del tipo number, si tiene un - es negativo, si contiene . es un decimal
            case 'number':
                if(String(value).includes('-')) return 'negative'
                else if(String(value).includes('.')) return 'decimal'
                else return 'number'
            
            //Regresa el valor por defacto del valor si este no tiene ninguna evaluacion
            default:
                return typeof(value);
        }
    }


    /**
     * Esta funcion agrega los estylos y formatos de celda
     * Ojo primero se le aplica un formato base a la celda y despues
     * si la plantilla tiene formatos personalizados se los aplica.
     * @param {*} cell celda actual de reporte
     */
    function appliedCellStyle(cell) {
        if(styles){
            const props = getProps(styles);
            const {address, value} = cell;
            if(props){

                props.forEach(prop => {
                    switch(prop){

                        case 'format':
                            const cellFormat = getTypeof(value);
                            if(hasProp(styles[prop], cellFormat)) cell.numFmt = styles[prop][cellFormat];
                            break;


                        case 'cells':
                            const cellProps = getProps(styles[prop]);
                            cellProps.forEach(cellProp => {
                               if(address.match(cellProp, 'ig')) cell.style = {...styles[prop][cellProp]};
                            });
                            
                        default:
                            break;
                    }

                });
            }
        }
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






