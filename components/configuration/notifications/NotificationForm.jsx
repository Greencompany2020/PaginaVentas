import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, ToggleInput, CheckBoxInput } from "../../FormInputs";

/**
 * @typedef {Object} NotificationFormItem
 * @property {number} [id] - The notification ID (if editing)
 * @property {string} [nombre] - The notification name
 * @property {string} [medio] - The notification medium
 * @property {number} [activa] - The notification status
 * @property {Array<any>} [localidades] - The assigned locations
 */

/**
 * @typedef {Object} NotificationFormProps
 * @property {NotificationFormItem|null} item - The notification item to edit, if any
 * @property {(id: number, values: { nombre: string, medio: string, activa: number, localidades: Array<number> }) => Promise<void>} updateNotification - Function to update an existing notification
 * @property {(values: { nombre: string, medio: string, activa: number, localidades: Array<number> }) => Promise<void>} addNewNotification - Function to create a new notification
 * @property {() => void} handleModal - Function to close the modal
 * @property {Array<any>} locations - The available locations list
 */

/**
 * Form for creating or updating a notification.
 * @param {NotificationFormProps} props - The component props
 * @returns {JSX.Element} The rendered form
 */
export default function NotificationForm(props) {
  const { item, updateNotification, addNewNotification, handleModal, locations } = props;

  const getNotificationLocations = () => {
    const localidades = locations ? locations.reduce((obj, loc) => Object.assign(obj, { [loc.Localidad]: "" }), {}) : {};

    if (item) {
      const notificationLocalidades = (item.Localidades || item.localidades || []).flatMap((loc) =>
        typeof loc === "object" ? loc.Codigo || loc.codigo : loc
      );
      const notificationLocalidadesFilter = locations ? locations.filter((loc) => notificationLocalidades.includes(loc.Codigo)) : [];
      const notificationPlaces = notificationLocalidadesFilter.flatMap((loc) => loc.Localidad);
      if (notificationPlaces) {
        const newLocalidades = {};
        for (let property in localidades) {
          if (notificationPlaces.includes(property)) {
            Object.assign(newLocalidades, { [property]: true });
          } else {
            Object.assign(newLocalidades, { [property]: false });
          }
        }
        return newLocalidades;
      }
    }
    return localidades;
  };

  const getIdFromLocations = (data) => {
    let places = [];
    for (let property in data) {
      if (data[property] === true) places = [...places, property];
    }
    if (places && locations) {
      const filter = locations.filter((val) => places.includes(val.Localidad));
      const placesFilter = filter.flatMap((val) => val.Codigo);
      return placesFilter;
    }
    return [];
  };

  const initialValues = {
    nombre: item?.nombre || "",
    medio: item?.medio || "",
    activa: !!item?.activa,
    localidades: getNotificationLocations(),
  };

  const validateSchema = Yup.object().shape({
    nombre: Yup.string().required("Requerido"),
    medio: Yup.string().required("Requerido"),
  });

  const handleOnsubmit = async (values, { resetForm }) => {
    const { localidades, ...rest } = values;
    const localitions = getIdFromLocations(localidades);
    const payload = { ...rest, activa: values.activa ? 1 : 0, localidades: localitions };
    if (item && item.id) {
      await updateNotification(item.id, payload);
    } else {
      await addNewNotification(payload);
    }
    handleModal();
    resetForm({});
  }

  return (
    <Formik initialValues={initialValues} validationSchema={validateSchema} onSubmit={handleOnsubmit} enableReinitialize>
      <Form className="p-4 relative h-fit overflow-y-auto">
        <div className="space-y-1">
          <TextInput label='Nombre' name='nombre' />
          <TextInput label='Medio' name='medio' />
          <div className="pt-2">
            <ToggleInput label="Activa" name="activa" />
          </div>
        </div>

        <fieldset className="mt-4">
          <legend className="font-semibold text-sm text-gray-600 mb-2">Localidades</legend>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border p-2 rounded-md bg-gray-50">
            {locations &&
              locations.map((loc) => (
                <div key={loc.Codigo} className="p-1">
                  <CheckBoxInput
                    id={loc.Codigo}
                    name={`[localidades.${loc.Localidad}]`}
                    label={loc.Localidad}
                  />
                </div>
              ))}
          </div>
        </fieldset>

        <div className="flex flex-row justify-end space-x-2 mt-6">
          <input type='reset' value='Cancelar' className="secondary-btn w-28" onClick={handleModal} />
          <input type='submit' value='Guardar' className="primary-btn w-28" />
        </div>
      </Form>
    </Formik>
  );
}

