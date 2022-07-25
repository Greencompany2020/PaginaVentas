import React,{useState} from 'react';
import Image from 'next/image';
import { Formik, Form } from 'formik';
import { v4 } from 'uuid';
import * as Yup from 'yup'
import { TextInput,CheckBoxInput, SelectInput, RadioInput, RadioImageInput} from './FormInputs';
import { comboValues,  inputNames, comboNames,  checkboxLabels as label} from '../utils/data';

import tableIcon from '../public/icons/table.svg';
import statIcon from '../public/icons/stat.svg';
import statGroupIcon from '../public/icons/stat-group.svg';
import mobileTableIcon from '../public/icons/mobile-table.svg';


export default function NewForm({submit, userParams, dashbordParams}) {

  //Valor del año actual
  const currentYear = new Date(Date.now()).getFullYear();

  /**
 * Esta funcion retorna true si su valor es Y o false si es N
 * @param {*} val 
 * @returns 
 */
  const isTrue = val => (val == 'Y' ? true : false );

  /**
   * Esta funcion retorna Y si  val es true o N si es false
   * @param {*} val 
   * @returns 
   */
  const toYesNo = val => (val == true ? 'Y' : 'N');

  /**
   * Esta funcion se encarga de separar los años del comparativo,
   * revisa si el el valor en el array separado es un numero y lo convierte
   * de lo contrario retorna un falso
   * @param {*} val 
   * @returns 
   */
  const separate = val =>{
    if(val && typeof(val) == 'string'){
      const arrYears = val.split(',');
      return {
        val1: !isNaN(arrYears[0]) ? Number([arrYears[0]]) : false, 
        val2: !isNaN(arrYears[1]) ? Number([arrYears[1]]) : false
      }
    }
    return null;
  }

  //Obtiene el valor de los años comparativos del usuario, si no devuelve un objeto vacio
  const agnos = separate(userParams?.[comboNames.AGNOSCOMPARATIVOS]);

  /**
   * Evalua si la propiedad esta habilidata para  el acceso,
   * evalua los diferentes tipos de datos para retornar verdadero o falso
   * @param {*} param 
   * @returns 
   */
  const isDisabled = param => {
    switch(typeof(param)){
      case 'string':
        return (param == 'n' || param == 'N');
      case 'boolean':
        return param;
      case 'number':
        return (param == 0);
      case 'undefined':
        return true;
      default:
        return param;
    }
  }

  console.log(dashbordParams);
  
  /**
   * Establece el objeto de valores iniciales
   */
  const initialValues = {
    [comboNames.CBAGNOSCOMPARAR]: userParams?.[comboNames.CBAGNOSCOMPARAR] || comboValues.CBAGNOSCOMPARAR[0].value,
    [comboNames.CBINCREMENTO]: userParams?.[comboNames.CBINCREMENTO] || comboValues.CBINCREMENTO[0].value,
    [comboNames.CBMOSTRARTIENDAS]: comboValues.CBMOSTRARTIENDAS[0].value,
    [inputNames.NO_HORAS_VENTAS_PARCIALES]: isTrue(userParams?.[inputNames.NO_HORAS_VENTAS_PARCIALES]),
    [inputNames.TIPO_CAMBIO_TIENDAS]: isTrue(userParams?.[inputNames.TIPO_CAMBIO_TIENDAS]),
    [inputNames.CON_IVA]: isTrue(userParams?.[inputNames.CON_IVA]),
    [inputNames.ACUMULADO_SEMANAL]:  isTrue(userParams?.[inputNames.ACUMULADO_SEMANAL]),
    [inputNames.RESULTADOS_PESOS]:  isTrue(userParams?.[inputNames.RESULTADOS_PESOS]),
    [comboNames.CBAGNOSCOMPARAR_AGNOS.AGNO1]: agnos?.val1 || currentYear,
    [comboNames.CBAGNOSCOMPARAR_AGNOS.AGNO2]: agnos?.val2 || currentYear,
    [inputNames.CON_VENTAS_EVENTOS]:  isTrue(userParams?.[inputNames.CON_VENTAS_EVENTOS]),
    [inputNames.VISTA_DESKTOP]: userParams?.[inputNames.VISTA_DESKTOP] || 1,
    [inputNames.VISTA_MOBILE]: userParams?.[inputNames.VISTA_MOBILE] || 1
  };


  //Este estado guarda que controles estan activos o inactivos
  const [disables, setDisables] = useState({
    [comboNames.CBAGNOSCOMPARAR_AGNOS.AGNO2]: userParams?.[comboNames.CBAGNOSCOMPARAR] !== 2
  });


  /**
   * Esquema de validacion de YUP, solo aplica para algunos valores
   */
  const validationSchema = Yup.object().shape({
    [comboNames.CBAGNOSCOMPARAR_AGNOS.AGNO1]: 
      Yup
      .number()
      .integer()
      .typeError('El valor de año debe ser entero, los caracteres no son permitidos')
      .min(2013, 'El año debe ser mayor o igual a 2013')
      .max(currentYear, `El año debe ser menor o igual a ${currentYear}`),
    [comboNames.CBAGNOSCOMPARAR_AGNOS.AGNO2]: 
      Yup
      .number('El valor de año debe ser entero')
      .integer('El valor de año debe ser entero')
      .typeError('El valor de año debe ser entero, los caracteres no son permitidos')
      .min(2013, 'El año debe ser mayor o igual a 2013')
      .max(currentYear, `El año debe ser menor o igual a ${currentYear}`),
  });


  /**
   * Esta funcion remplaza los parametros del objeto segun el tipo de datos
   * @param {*} values 
   * @returns 
   */
  const validateValuesTypes = values =>{
    const valuesWithTypes = {}
    
    //Este for evalua los valores del objeto y segun el caso los cambia
    for(const item in values){

      //Obtiene el valo del objeto 
      const value = values[item];
      let temp = null;

      //Switch que evalua los tipos de valores
      switch (typeof(value)){

        //si son boleanos (checks) los cambia por 'Y' o 'N'
        case 'boolean':
          temp = toYesNo(value);
          break;

        //si es undefined lo marca como 'N'  
        case 'undefined':
          temp = 'N'
          break;

        //si no esta evaluado le deja su valor  
        default:
          temp = value;
      }
      Object.assign(valuesWithTypes, {[item]: temp});
    }
    return valuesWithTypes;
  }


  /**
   * Esta funcion se encarga de aplicar reglas especiales a los valores
   * @param {} values 
   */
  const appliedRules = values =>{
    const valuesWithRules = {}

    //Este for evalua los valores del objeto y aplica las reglas
    for(const item in  values){

      //Obtiene el valor del objeto 
      const value = values[item];

      //Si el combo de 'Años a comparar' es dos suma concatena los valores de agno1 y agno2
      if(item === comboNames.CBAGNOSCOMPARAR){
        const {agno1, agno2, ...rest} = values;
        if(value == 2){
          Object.assign(valuesWithRules, {[comboNames.AGNOSCOMPARATIVOS]: `${String(agno1).trim()},${String(agno2).trim()}`});
        }else{
          Object.assign(valuesWithRules, {[comboNames.AGNOSCOMPARATIVOS]: `${String(agno1).trim()}`});
        }
      }

      //Retira campos no necesarios agno1 y agno2
      else if(item !== comboNames.CBAGNOSCOMPARAR_AGNOS.AGNO1 || item !== comboNames.CBAGNOSCOMPARAR_AGNOS.AGNO2){
        const {agno1, agno2, ...rest} = values;
        Object.assign(valuesWithRules, {...rest});
      }

      //Si el campo no cumple ninguna condicion lo pasa
      else{
        Object.assign(valuesWithRules, {[item]:value});
      }

    }

    return valuesWithRules;
  }

  /**
  * Esta funcion recoge los valores que se estan cambiando
  * funciona para evaluar algunos casos especiales, por ejemplo el año comparativo 2
  * @param {*} evt 
  */
  const handleOnchange = evt => {
    const {name,value} = evt.target;
    //Evalua segun el nombre del control
    switch(name){

      //Si combo 'Años a compara' es 1 esntonces inhabilita el año 2
      case comboNames.CBAGNOSCOMPARAR:
        if(value == 1){
          setDisables(prev => ({...prev,[comboNames.CBAGNOSCOMPARAR_AGNOS.AGNO2]:true}))
        }else{
          setDisables(prev => ({...prev,[comboNames.CBAGNOSCOMPARAR_AGNOS.AGNO2]:false}))
        }
        break;
    }
  }

  /**
   * Esta funcion se ejecuta cuando onSubmit es activado
   * @param {*} values 
   */
  const handleOnSubmit = async values => {
    const temp = appliedRules(values);
    const params = validateValuesTypes(temp);
    await submit(params);
    //console.log(params);
  }


  return (
   <Formik initialValues={initialValues} onSubmit={handleOnSubmit} validationSchema={validationSchema}  enableReinitialize>
    <Form className='space-y-4 flex flex-col p-4' onChange={handleOnchange}>
      <section>
        <h4 className='font-bold mb-2'>Parametros</h4>
        <div className='space-y-4'>

          <fieldset className='space-y-2'>
            <SelectInput label={label.CBAGNOSCOMPARAR} name ={comboNames.CBAGNOSCOMPARAR} id={comboNames.CBAGNOSCOMPARAR}>
              {
                comboValues.CBAGNOSCOMPARAR.map((item, i)=>(
                  <option key={v4()} value={item.value}>{item.text}</option>
                ))
              }
            </SelectInput>
            <div className='w-full flex items-center space-x-2'>
              <div className='flex-1'>
                <TextInput 
                  type='number' 
                  label={label.CBAGNOSCOMPARAR_AGNOS.AGNO1} 
                  name={comboNames.CBAGNOSCOMPARAR_AGNOS.AGNO1} 
                  id={comboNames.CBAGNOSCOMPARAR_AGNOS.AGNO1}
                />
              </div>
              <div className='flex-1'>
                <TextInput 
                  type='number' 
                  label={label.CBAGNOSCOMPARAR_AGNOS.AGNO2} 
                  name={comboNames.CBAGNOSCOMPARAR_AGNOS.AGNO2} 
                  id={comboNames.CBAGNOSCOMPARAR_AGNOS.AGNO2}
                  disabled={disables[comboNames.CBAGNOSCOMPARAR_AGNOS.AGNO2]}
                />
              </div>
            </div>
            <SelectInput label={label.CBINCREMENTO} name={comboNames.CBINCREMENTO} id={comboNames.CBINCREMENTO}>
              {
                comboValues.CBINCREMENTO.map((item, i)=>(
                  <option key={v4()} value={item.value}>{item.text}</option>
                ))
              }
            </SelectInput>
            <SelectInput label={label.CBMOSTRARTIENDAS} name={comboNames.CBMOSTRARTIENDAS} id={comboNames.CBMOSTRARTIENDAS}>
              {
                comboValues.CBMOSTRARTIENDAS.map((item, i) =>(
                  <option key={v4()} value={item.value}>{item.text}</option>
                ))
              }
            </SelectInput>
          </fieldset>

          <fieldset className='space-y-1'>
          <CheckBoxInput label={label.INCLUIR_EVENTOS} name={inputNames.CON_VENTAS_EVENTOS} id={inputNames.CON_VENTAS_EVENTOS} />
            <CheckBoxInput label={label.NO_HORAS_VENTAS_PARCIALES} name={inputNames.NO_HORAS_VENTAS_PARCIALES} id={inputNames.NO_HORAS_VENTAS_PARCIALES}/>
            <CheckBoxInput label={label.TIPO_CAMBIO_TIENDAS} name={inputNames.TIPO_CAMBIO_TIENDAS} id={inputNames.TIPO_CAMBIO_TIENDAS}/>
          </fieldset>

        </div>
      </section>

      <section>
        <h4 className='font-bold mb-2'>Visualizar</h4>
        <div className='space-y-2'>
          <fieldset className='space-y-1'>
            <CheckBoxInput label={label.VENTAS_IVA} name={inputNames.CON_IVA} id={inputNames.CON_IVA} />
            <CheckBoxInput label={label.ACUMULADO_SEMANAL} name={inputNames.ACUMULADO_SEMANAL} id={inputNames.ACUMULADO_SEMANAL}/>
            <CheckBoxInput label={label.RESULTADO_PESOS} name={inputNames.RESULTADOS_PESOS} id={inputNames.RESULTADOS_PESOS}/>
          </fieldset>
          <fieldset className='space-y-1'>
            <legend className='text-sm font-bold'>Visualización de información en escritorio</legend>
            <RadioImageInput  
              label={'Vista de tabla'}  
              name={inputNames.VISTA_DESKTOP} 
              image={tableIcon} 
              value={1} 
              disabled = {isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])}
            />
            <RadioImageInput  
              label={'Vista por tarjetas'}  
              name={inputNames.VISTA_DESKTOP}
              image={statIcon} 
              value={2}
              disabled = {isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])} 
            />
            <RadioImageInput  
              label={'Vista de region'}  
              name={inputNames.VISTA_DESKTOP} 
              image={statGroupIcon} 
              value={3}
              disabled = {isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])}
            />
            <RadioImageInput  
              label={'Vista por seccion'}  
              name={inputNames.VISTA_DESKTOP} 
              image={mobileTableIcon} 
              value={4}
              disabled = {isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])}
            />
          </fieldset>
          <fieldset className='space-y-1'>
            <legend className='text-sm font-bold'>Visualización de información en móvil</legend>
            <RadioImageInput  
              label={'Vista de tabla'}  
              name={inputNames.VISTA_MOBILE} 
              image={tableIcon} 
              value={1}
              disabled = {isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])} 
            />
            <RadioImageInput  
              label={'Vista por tarjetas'}  
              name={inputNames.VISTA_MOBILE} 
              image={statIcon} 
              value={2}
              disabled = {isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])} 
            />
            <RadioImageInput  
              label={'Vista de region'}  
              name={inputNames.VISTA_MOBILE} 
              image={statGroupIcon} 
              value={3}
              disabled = {isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])} 
            />
            <RadioImageInput  
              label={'Vista por seccion'}  
              name={inputNames.VISTA_MOBILE} 
              image={mobileTableIcon} 
              value={4}
              disabled = {isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])} 
            />
          </fieldset>
        </div>
      </section>
        
      <input className='primary-btn w-20 self-end' type={'submit'} value={'Guardar'} />
    </Form>
   </Formik>
  )
}
