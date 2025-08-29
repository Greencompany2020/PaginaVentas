// components/NewForm2.jsx
import React from 'react'
import { Formik, Form } from 'formik'
import { CheckBoxInput, RadioImageInput } from './FormInputs'
import { inputNames, checkboxLabels as label } from '../utils/data'
import tableIcon from '../public/icons/table.svg'
import statIcon from '../public/icons/stat.svg'
import statGroupIcon from '../public/icons/stat-group.svg'
import mobileTableIcon from '../public/icons/mobile-table.svg'

const toBool = (v) => v === 'Y'
const toYN  = (b) => (b ? 'Y' : 'N')

const isDisabled = (param) => {
  switch (typeof param) {
    case 'string':  return param === 'n' || param === 'N'
    case 'boolean': return param
    case 'number':  return param === 0
    case 'undefined': return true
    default: return param
  }
}

/**
 * @param {{
 *  submit: (params:any)=>Promise<void>|void,
 *  userParams?: { conVentasEventos?:'Y'|'N', incluirWeb?:'Y'|'N' },
 *  dashbordParams?: Record<string, any>
 * }} props
 */
export default function NewForm2({ submit, userParams = {}, dashbordParams = {} }) {
  const initialValues = {
    conVentasEventos: toBool(userParams.conVentasEventos),
    incluirWeb: toBool(userParams.incluirWeb),
  }

  const handleSubmit = async (values) => {
    await submit({
      conVentasEventos: toYN(values.conVentasEventos),
      incluirWeb: toYN(values.incluirWeb),
    })
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      <Form className="space-y-4 flex flex-col p-4">
        <section className="space-y-4">
          <h4 className="font-bold">Filtros de búsqueda</h4>
          <div className="space-y-2">
            <CheckBoxInput label="Incluir ventas de eventos" name="conVentasEventos" id="conVentasEventos" />
            <CheckBoxInput label="Incluir venta en línea" name="incluirWeb" id="incluirWeb" />
          </div>
        </section>

        <section>
          <h4 className="font-bold mb-2">Visualizar</h4>
          <div className="space-y-2">
            <fieldset className="space-y-1">
              <legend className="text-sm font-bold">Visualización de información en escritorio</legend>
              <RadioImageInput label="Vista de tabla"    name={inputNames.VISTA_DESKTOP} image={tableIcon} value={1} disabled={isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])}/>
              <RadioImageInput label="Vista por tarjetas" name={inputNames.VISTA_DESKTOP} image={statIcon}  value={2} disabled={isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])}/>
              <RadioImageInput label="Vista de region"    name={inputNames.VISTA_DESKTOP} image={statGroupIcon} value={3} disabled={isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])}/>
              <RadioImageInput label="Vista por seccion"  name={inputNames.VISTA_DESKTOP} image={mobileTableIcon} value={4} disabled={isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])}/>
            </fieldset>

            <fieldset className="space-y-1">
              <legend className="text-sm font-bold">Visualización de información en móvil</legend>
              <RadioImageInput label="Vista de tabla"    name={inputNames.VISTA_MOBILE} image={tableIcon} value={1} disabled={isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])}/>
              <RadioImageInput label="Vista por tarjetas" name={inputNames.VISTA_MOBILE} image={statIcon}  value={2} disabled={isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])}/>
              <RadioImageInput label="Vista de region"    name={inputNames.VISTA_MOBILE} image={statGroupIcon} value={3} disabled={isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])}/>
              <RadioImageInput label="Vista por seccion"  name={inputNames.VISTA_MOBILE} image={mobileTableIcon} value={4} disabled={isDisabled(dashbordParams?.[inputNames.VISTA_DESKTOP])}/>
            </fieldset>
          </div>
        </section>

        <input className='primary-btn w-20 self-end' type={'submit'} value={'Guardar'} />
      </Form>
    </Formik>
  )
}
