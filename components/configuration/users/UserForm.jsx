import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, SelectInput, CheckBoxInput } from "../../FormInputs";

export default function UserForm({ item, groups, addNewUser, updateUser, handleToggle, digitalGroups, addUserToGroup, locatities , sapUsers}) {

  const getUserLocalitities = () => {
    const localidades = locatities.reduce((obj, item) => Object.assign(obj, { [item.Localidad]: "" }), {})

    if (item) {
      const userLocalidades = item.Localidades.flatMap(item => item.Codigo);
      const userLocalidadesFilter = locatities.filter(item => userLocalidades.includes(item.Codigo));
      const userPlaces = userLocalidadesFilter.flatMap(item => item.Localidad);
      if (userPlaces) {
        const newLocalidades = {}
        for (let property in localidades) {
          if (userPlaces.includes(property)) {
            Object.assign(newLocalidades, { [property]: true });
          } else {
            Object.assign(newLocalidades, { [property]: false });
          }
        }
        return newLocalidades
      }
    }
    return localidades
  }

  const initialValues = {
    UserCode: item?.UserCode || "",
    Email: item?.Email || "",
    NoEmpleado: item?.NoEmpleado || "",
    Level: item?.Level || 1,
    Clase: item?.Clase || 1,
    Nombre: item?.Nombre || "",
    Apellidos: item?.Apellidos || "",
    password: "",
    idGrupo: item?.IdGrupo || groups[0]?.Id,
    idGrupoDigital: item?.IdGrupoDigitalizacion || digitalGroups[0]?.Id,
    localidades: getUserLocalitities(),
    UserSAP: item?.UserSAP || "null"
  }



  const validationSchema = Yup.object().shape({
    UserCode: Yup.string().required("Requerido"),
    Email: Yup.string().email("Ingrese un email con formato valido @example.com").required("Requerido"),
    NoEmpleado: Yup.number().transform((v) => parseInt(v)).required("Requerido"),
    Level: Yup.number().transform((v) => parseInt(v)),
    Clase: Yup.number().transform((v) => parseInt(v)),
    Nombre: Yup.string().required("Requerido"),
    Apellidos: Yup.string().required("Requrido"),
    password: !item && Yup.string().required("Requerido"),
    idGrupo: Yup.number().transform((v) => parseInt(v)),
  });


  const getIdfromLocatitites = (data) => {
    let places = [];
    for (let property in data) {
      if (data[property] == true) places = [...places, property];
    }
    if (places) {
      const filter = locatities.filter(val => places.includes(val.Localidad));
      const placesFilter = filter.flatMap(val => val.Codigo);
      return placesFilter;
    }
    return [];
  }

  const handleOnSubmit = async (values, { resetForm }) => {

    const { idGrupoDigital, localidades, ...rest } = values;
    const localitities = getIdfromLocatitites(localidades);

    if (item) {
      const { password, ...params } = rest;
      const body = { ...params, localidades: localitities, idProyect: 1 }
      await updateUser(item?.Id, body);
      await addUserToGroup({
        idUser: item?.Id,
        idGrupo: idGrupoDigital
      });
    }
    else {
      const body = { ...rest, localidades: localitities }
      await addNewUser(body);
    }
    resetForm({})
    handleToggle();
  }


  return (
    <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={handleOnSubmit} enableReinitialize>
      <Form className="p-4 relative">
        <div className="space-y-1">
          <TextInput label='No. Empleado' name='NoEmpleado' type='number' elementwidth='w-36' />
          <TextInput label='Nombre' name='Nombre' />
          <TextInput label='Apellidos' name='Apellidos' />
        </div>

        <div className="space-y-1 mt-4">
          <TextInput label='Usuario' name='UserCode' />
          <TextInput label='Correo' name='Email' type='email' />
          {!item && <TextInput label='Password' name='password' type='password' />}
          <div className="flex flex-row space-x-1">
            <SelectInput label='Clase' name='Clase'>
              <option value={0}>0</option>
              <option value={1}>1</option>
            </SelectInput>
            <SelectInput label='Level' name='Level'>
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={10}>10</option>
              <option value={11}>11</option>
              <option value={20}>20</option>
            </SelectInput>
            <SelectInput label='Grupo' name='idGrupo'>
              <Listgroups groups={groups} />
            </SelectInput>
          </div>
        </div>

        <fieldset className="mt-4">
          <SelectInput label="Rol digitalizado" name='idGrupoDigital' disabled={!item ? true : false}>
            <DigitalGroups digitalGroups={digitalGroups} />
          </SelectInput>
        </fieldset>


        <fieldset className=" overflow-auto h-32 mt-4">
          <legend className="font-semibold text-sm text-gray-600 mb-1">Localidades</legend>
          {
            locatities &&
            locatities.map((item, index) => (
              <CheckBoxInput id={item.Codigo} name={`[localidades.${item.Localidad}]`} key={item.Codigo} label={item.Localidad} />
            ))
          }
        </fieldset>

        <fieldset className="mt-4">
        <SelectInput label='Usuario sap' name='UserSAP'>
              <option value={"null"}>Elegir usuarios</option>
              { sapUsers &&
                sapUsers.map(item => (
                  <option key={item.UserCode}>{item.UserCode}</option>
                ))
              }
            </SelectInput>
        </fieldset>


        <div className="flex flex-row justify-end space-x-2 mt-6 ">
          <input type='reset' value='Cancelar' className="secondary-btn w-28" onClick={handleToggle} />
          <input type='submit' value='Guardar' className="primary-btn w-28" />
        </div>

      </Form>
    </Formik>
  )
}

function Listgroups({ groups }) {
  if (!groups) return <option value={0}>Sin grupos</option>
  const Items = groups.map((item, index) => (
    <option key={index} value={item.Id}>{item.Nombre}</option>
  ));
  return Items;
}

function DigitalGroups({ digitalGroups }) {
  if (!digitalGroups) return <option value={0}>Sin grupo</option>
  const Items = digitalGroups.map((item, index) => (
    <option key={index} value={item.Id}>{item.Nombre}</option>
  ));
  return Items;
}

