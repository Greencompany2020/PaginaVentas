import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, ToggleInput } from "../../FormInputs";

/**
 * @typedef {Object} NotificationFormItem
 * @property {number} [id] - The notification ID (if editing)
 * @property {string} [nombre] - The notification name
 * @property {string} [medio] - The notification medium
 * @property {number} [activa] - The notification status
 */

/**
 * @typedef {Object} NotificationFormProps
 * @property {NotificationFormItem|null} item - The notification item to edit, if any
 * @property {(id: number, values: { nombre: string, medio: string }) => Promise<void>} updateNotification - Function to update an existing notification
 * @property {(values: { nombre: string, medio: string }) => Promise<void>} addNewNotification - Function to create a new notification
 * @property {() => void} handleModal - Function to close the modal
 */

/**
 * Form for creating or updating a notification.
 * @param {NotificationFormProps} props - The component props
 * @returns {JSX.Element} The rendered form
 */
export default function NotificationForm(props) {
  const { item, updateNotification, addNewNotification, handleModal } = props;

  const initialValues = {
    nombre: item?.nombre || "",
    medio: item?.medio || "",
    activa: !!item?.activa,
  };

  const validateSchema = Yup.object().shape({
    nombre: Yup.string().required("Requerido"),
    medio: Yup.string().required("Requerido"),
  });

  const handleOnsubmit = async (values, { resetForm }) => {
    const payload = { ...values, activa: values.activa ? 1 : 0 };
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
      <Form className="p-4">
        <div className="space-y-1">
          <TextInput label='Nombre' name='nombre' />
          <TextInput label='Medio' name='medio' />
          <div className="pt-2">
            <ToggleInput label="Activa" name="activa" />
          </div>
        </div>
        <div className="flex flex-row justify-end space-x-2 mt-6">
          <input type='reset' value='Cancelar' className="secondary-btn w-28" onClick={handleModal} />
          <input type='submit' value='Guardar' className="primary-btn w-28" />
        </div>
      </Form>
    </Formik>
  );
}
