import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, SelectInput } from "../../FormInputs";

export default function UserForm({item, groups, addNewUser, updateUser, handleToggle}) {

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

  const handleOnSubmit = async (values, {resetForm}) => {
    if(item){
      const {password, ...body} = values;
      await updateUser(item?.Id, body);
    }
    else{
      await addNewUser(values);
    }
    resetForm({})
    handleToggle();
  }


  return(
   <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={handleOnSubmit} enableReinitialize>
      <Form className="p-4">
        <div className="space-y-1">
        <TextInput label='No. Empleado' name='NoEmpleado' type='number' elementwidth='w-36'/>
        <TextInput label='Nombre' name='Nombre'/>
        <TextInput label='Apellidos' name='Apellidos'/>
        </div>

        <div className="space-y-1 mt-4">
          <TextInput label='Usuario' name='UserCode'/>
          <TextInput label='Correo' name='Email' type='email'/>
          { !item && <TextInput label='Password' name='password' type='password'/>}
          <div className="flex flex-row justify-evenly">
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
             <Listgroups groups={groups}/>
            </SelectInput>
          </div>
        </div>
        <div className="flex flex-row justify-end space-x-2 mt-6">
          <input type='reset' value='Cancelar' className="secondary-btn w-28" onClick={handleToggle}/>
          <input type='submit' value='Guardar' className="primary-btn w-28"/>
        </div>
      </Form>
   </Formik>
  )
}

function Listgroups({groups}) {
  if(!groups) return <option value={0}>Sin grupos</option>
  const Items = groups.map((item, index) => (
    <option key={index} value={item.Id}>{item.Nombre}</option>
  ));
  return Items;
}

