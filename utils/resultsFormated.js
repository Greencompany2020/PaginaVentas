/**
 * Formatea el número separando las unidades por comas, y
 * le añade la clase de resaltado si el valor es menor o mayor a 0.
 * @param {number} num El valor a formatear
 * @returns {JSX.Element} La etiqueta <td> con el valor formateado.
 */
export const formatNumber = (num) => {
  let numberText = "";
  if (num < 0) {
    numberText = `(${Math.abs(num)})`;
    return (<td style={{
      color: "rgb(220 38 38)",
      fontWeight: 700,
      textAlign: "center",
    }}>{numberWithCommas(numberText)}</td>)
  } else {
    numberText = `${Math.abs(num)}`;
    return (<td style={{
      color: "rgb(5 150 105)",
      fontWeight: 700,
      textAlign: "center"
    }}>{numberWithCommas(numberText)}</td>)
  }
}
/**
 * Formatea el número separando las unidades por comas.
 * @param {number} num El valor a formatear
 * @returns {string} El valor formateado
 */
export const numberWithCommas = (num) => {
  return num?.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
