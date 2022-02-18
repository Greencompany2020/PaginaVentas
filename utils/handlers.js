export const handleChange = (evt, updateState) => {
  let value = 0;
  if (evt.target.hasOwnProperty('checked')) {
    value = evt.target.checked ? 1 : 0;
  } else if (evt.target.type === "date") {
    value = evt.target.value;
  } else {
    value = Number(evt.target.value);
  }

  updateState(prev => ({
    ...prev,
    [evt.target.name]: value
  }));
}
