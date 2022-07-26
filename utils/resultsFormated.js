/**
 * Formatea el número separando las unidades por comas, y
 * le añade la clase de resaltado si el valor es menor o mayor a 0.
 * @param {number} num El valor a formatear
 * @returns {JSX.Element} La etiqueta <td> con el valor formateado.
 */
export const formatNumber = (num, isLast=false) => {
  let numberText = '';
  if (num < 0) {
    numberText = Math.abs(num).toLocaleString('en-US');
    if(isNaN(numberText)) numberText = 0;
    return (<td style={{
      color: isLast ? "white" : "rgb(220 38 38)",
      fontWeight: 700,
      textAlign: "right",
      fontSize: 12
    }}>{`(${numberText})`}</td>)
  } else {
    numberText = Math.abs(num).toLocaleString('en-US');
    if(isNaN(numberText)) numberText = 0;
    return (<td style={{
      color: isLast ? "white" : "rgb(5 150 105)",
      fontWeight: 700,
      textAlign: "right",
      fontSize: 12
    }}>{numberText}</td>)
  }
}

export const stringFormatNumber = (num, isLast=false) => {
  let numberText = '';
  if (num < 0) {
    numberText = Math.abs(num).toLocaleString('en-US');
    if(isNaN(numberText)) numberText = 0;
    return (<span style={{
      color: isLast ? "black" : "rgb(220 38 38)",
      fontWeight: 700,
      textAlign: "right",
      fontSize: 12
    }}>{`(${numberText})`}</span>)
  } else {
    numberText = Math.abs(num).toLocaleString('en-US');
    if(isNaN(numberText)) numberText = 0;
    return (<span style={{
      color: isLast ? "black" : "rgb(5 150 105)",
      fontWeight: 700,
      textAlign: "right",
      fontSize: 12
    }}>{numberText}</span>)
  }
}

export const tdFormatNumber = (num, isLast=false, font=12) => {
  let numberText = '';
  if (num < 0) {
    numberText = Math.abs(num).toLocaleString('en-US');
    if(isNaN(numberText)) numberText = 0;
    return (<td style={{
      color: isLast ? "black" : "rgb(220 38 38)",
      fontWeight: 700,
      textAlign: "right",
      fontSize: font
    }}>{`(${numberText})`}</td>)
  } else {
    numberText = Math.abs(num).toLocaleString('en-US');
    if(isNaN(numberText)) numberText = 0;
    return (<td style={{
      color: isLast ? "black" : "rgb(5 150 105)",
      fontWeight: 700,
      textAlign: "right",
      fontSize: font
    }}>{numberText}</td>)
  }
}
/**
 * Formatea el número separando las unidades por comas.
 * @param {number} num El valor a formatear
 * @returns {string} El valor formateado
 */
export const numberWithCommas = (num) => {
  if(num) return num.toLocaleString('en-US');
  return 0;
}
