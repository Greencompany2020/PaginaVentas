/**
 * Maneja las entradas de información y actuliza los parámetros.
 * 
 * @param {ChangeEvent<HTMLInputElement>} evt El evento del elemento
 * @param {Dispatch<SetStateAction<any>>} updateState setState de los parámetros
 */
export const handleChange = (evt, updateState) => {
  let value = '';
  if (evt.target.hasOwnProperty('checked')) {
    value = evt.target.checked ? 1 : 0;
  } else if (evt.target.name === "tienda") {
    value = evt.target.value;
  } else if (evt.target.type === "date" || evt.target.type === "text") {
    value = evt.target.value;
  } else if(evt.target.type === "number"){
    const newValue = (evt.target.value === "") ? 2000 : evt.target.value;    
    value = Number(newValue);
  }
  else{
    value = Number(evt.target.value);
  }


  updateState(prev => ({
    ...prev,
    [evt.target.name]: value
  }));
}

