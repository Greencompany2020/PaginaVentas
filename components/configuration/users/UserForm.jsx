import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {TextInput, SelectInput, CheckBoxInput, PasswordViewInput} from "../../FormInputs";
import useToggle from "../../../hooks/useToggle";
import {PlusIcon, MinusIcon} from "@heroicons/react/outline";


export default function UserForm({
   item,
   groups,
   addNewUser,
   updateUser,
   handleToggle,
   digitalGroups,
   addUserToGroup,
   locatities,
   sapUsers,
   shops,
   setShopsToUser,
   userShops
}) {

  const LocalitiesSection = ({locality}) => {
    const [isOpen, setIsOpen] = useToggle();
    const placeShops = shops.find( item => item.codigoLocalidad === locality.Codigo)
    return (
      <li className="bg-gray-100 py-2 px-1 rounded-md">
        <div className="flex justify-between items-center cursor-pointer" onClick={setIsOpen}>
          <CheckBoxInput id={locality.Codigo} name={`[localidades.${locality.Localidad}]`} key={locality.Codigo} label={locality.Localidad} />
          {isOpen ? <MinusIcon width={18}/> : <PlusIcon width={18}/>}
        </div>
        <div className={`${isOpen ? 'h-fit  px-1 py-2' : 'hidden'}`}>
          <ul className="pl-4 space-y-1 bg-white rounded-md">
            {
              placeShops ?
                placeShops.almacenes.map(shop => (
                  <li key={shop.codigo} >
                    <CheckBoxInput id={shop.codigo} name={`[shops.${shop.codigo}]`} label={shop.codigo} disabled={!item}/>
                  </li>
                ))
              : null
            }
          </ul>
        </div>
      </li>
    )
  }
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


  const getUserShops = () => {
    const filteredUserShops = userShops.flatMap(item => item.almacenes.filter(flat => flat.selected)).map(flat => flat.codigo);
    const globalShops = shops.flatMap(item => item.almacenes.map(flat => flat.codigo)).reduce((obj, item) => Object.assign(obj, {[item]: filteredUserShops.includes(item)}), {});
    return globalShops;
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
    idGrupoDigital: item?.IdGrupoDigitalizacion || 0,
    localidades: getUserLocalitities(),
    UserSAP: item?.UserSAP || "null",
    PasswordSAP: item?.PasswordSAP || "null",
    parametros: {
      confirmShippingList: item?.Parametros?.confirmShippingList || "CB",
      confirmPackingList: item?.Parametros?.confirmPackingList || 'CL'
    },
    shops:  getUserShops()
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

  const getShopsFromValues = (data) => {
    let shopsIntrue = [];
    for(const property in data){
      if(data[property] === true) shopsIntrue = [...shopsIntrue, property];
    }
    return shopsIntrue;
  }

  const handleOnSubmit = async (values, { resetForm }) => {

    const { idGrupoDigital, localidades, shops, ...rest } = values;
    const localitities = getIdfromLocatitites(localidades);

    if (item) {
      const { password, ...params } = rest;
      const body = { ...params, localidades: localitities, idProyect: 1 }
      await updateUser(item?.Id, body);
      await addUserToGroup({
        idUser: item?.Id,
        idGrupo: idGrupoDigital
      });
       await setShopsToUser(item?.Id, getShopsFromValues(values.shops));
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
      <Form className="p-4 relative h-fit overflow-y-auto">
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
            <option value={0}>Elegir grupo</option>
            <DigitalGroups digitalGroups={digitalGroups} />
          </SelectInput>
        </fieldset>


        <fieldset className="mt-4">
          <legend className="font-semibold text-sm text-gray-600 mb-1">Localidades</legend>
          <ul className="space-y-2">
            {
              locatities &&
              locatities.map((item) => (
                  <LocalitiesSection key={item.Codigo} locality={item}/>
              ))
            }
          </ul>
        </fieldset>

        <fieldset className="mt-4">
          <SelectInput label='Usuario sap' name='UserSAP'>
            <option value={"null"}>Elegir usuarios</option>
            {sapUsers &&
              sapUsers.map(item => (
                <option key={item.UserCode}>{item.UserCode}</option>
              ))
            }
          </SelectInput>
        </fieldset>

        <div className="space-y-1 mt-4">
          <PasswordViewInput label='Contraseña SAP' name='PasswordSAP' />
        </div>

        <fieldset className="mt-4 space-y-2">
          <SelectInput label={"Metodo de confirmacion de embarque"} name='parametros.confirmShippingList'>
            <option value={"CM"}>Confirmacion manual</option>
            <option value={"CB"}>Confirmar por bulto</option>
            <option value={"CE"}>Confirmar por embarque</option>
          </SelectInput>
          <SelectInput label="Metodo de confirmacion de packing" name='parametros.confirmPackingList'>
            <option value={"CM"}>Confirmacion manual</option>
            <option value={"CL"}>Confirmar por linea</option>
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

