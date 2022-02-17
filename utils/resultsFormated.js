export const formatNumber = (num) => {
  let numberText = "";
  if (num <= 0) {
    numberText = `(${Math.abs(num)})`;
    return (<td className='text-red-900 font-bold'>{numberText}</td>)
  } else {
    numberText = `${Math.abs(num)}`;
    return (<td className='text-green-900 font-bold'>{numberText}</td>)
  }
}

export const numberWithCommas = (num) => {
  return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
