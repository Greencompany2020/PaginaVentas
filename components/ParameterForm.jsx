import React,{useState, useEffect} from 'react';
import { checkboxLabels, inputNames  } from '../utils/data';
import Checkbox from './inputs/Checkbox';

export default function ParameterForm({submit, savedParameters, onlySelect = true, includedParameters}) {
    const [values, setValues] = useState({});
    const [hasValues, setHasValues] = useState(true);

    const handleChange = evt =>{
        const {name, checked} = evt.target;
        setValues(prev => ({
            ...prev,
            [name]:checked
        }))
    }
    
    const handleOnSubmit = async evt => {
        evt.preventDefault(); 
        const formatedValues = {}
        for(const item in values){
            let value = values[item] == true ? 'Y' : 'N';
            Object.assign(formatedValues, {[item]:value});
        }
        await submit(formatedValues);
    }

    useEffect(()=>{
        (async()=>{
            const initialValues = {}
            for(const item in inputNames){
                let key = inputNames[item];
                let value = savedParameters?.[key] == 'Y' ? true : false;
                Object.assign(initialValues, {[key]: value });
            }
            setValues(initialValues);
        })()
    },[savedParameters, includedParameters])

    return(
            <form className='p-4' onSubmit={handleOnSubmit}>
                {console.log(onlySelect && includedParameters?.[inputNames.CON_IVA] != 'Y')}
                <div className='space-y-1'>
                    <Checkbox 
                        name={inputNames.CON_IVA}  
                        labelText={checkboxLabels.VENTAS_IVA} 
                        checked={values[inputNames.CON_IVA] || ''}
                        onChange={handleChange}
                        disabled={onlySelect && includedParameters?.[inputNames.CON_IVA] != 'Y'}
                    />

                    <Checkbox 
                        name={inputNames.SEMANA_SANTA} 
                        labelText={checkboxLabels.SEMANA_SANTA} 
                        checked={values[inputNames.SEMANA_SANTA] || ''}
                        onChange={handleChange}
                        disabled={onlySelect && includedParameters?.[inputNames.SEMANA_SANTA] != 'Y'}
                    />
                    
                    <Checkbox 
                        name={inputNames.SIN_AGNO_VENTA} 
                        labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS} 
                        checked={values[inputNames.SIN_AGNO_VENTA] || ''}
                        onChange={handleChange}
                        disabled={onlySelect && includedParameters?.[inputNames.SIN_AGNO_VENTA] != 'Y'}
                    />
                    
                    <Checkbox 
                        name={inputNames.CON_VENTAS_EVENTOS} 
                        labelText={checkboxLabels.INCLUIR_EVENTOS} 
                        checked={values[inputNames.CON_VENTAS_EVENTOS] || ''}
                        onChange={handleChange}
                        disabled={onlySelect && includedParameters?.[inputNames.CON_VENTAS_EVENTOS] != 'Y'}
                    />
                    
                    <Checkbox 
                        name={inputNames.CON_TIENDAS_CERRADAS} 
                        labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS} 
                        checked={values[inputNames.CON_TIENDAS_CERRADAS] || ''}
                        onChange={handleChange}
                        disabled={onlySelect && includedParameters?.[inputNames.CON_TIENDAS_CERRADAS] != 'Y'}
                    />
                
                    <Checkbox 
                        name={inputNames.SIN_TIENDAS_SUSPENDIDAS} 
                        labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS} 
                        checked={values[inputNames.SIN_TIENDAS_SUSPENDIDAS] || ''}
                        onChange={handleChange}
                        disabled={onlySelect && includedParameters?.[inputNames.SIN_TIENDAS_SUSPENDIDAS] != 'Y'}
                    />
                    
                    <Checkbox 
                        name={inputNames.RESULTADOS_PESOS} 
                        labelText={checkboxLabels.RESULTADO_PESOS} 
                        checked={values[inputNames.RESULTADOS_PESOS] || ''}
                        onChange={handleChange}
                        disabled={onlySelect && includedParameters?.[inputNames.RESULTADOS_PESOS] != 'Y'}
                    />

                    <Checkbox 
                        name={inputNames.VENTAS_MILES_DLLS} 
                        labelText={checkboxLabels.OPERACIONES_EN_MILES} 
                        checked={values[inputNames.VENTAS_MILES_DLLS] || ''}
                        onChange={handleChange}
                        disabled={onlySelect && includedParameters?.[inputNames.VENTAS_MILES_DLLS] != 'Y'}
                    />

                    <Checkbox 
                        name={inputNames.PORCENTAJE_COMPROMISO} 
                        labelText={checkboxLabels.PORCENTAJE_VENTAS_VS_COMPROMISO} 
                        checked={values[inputNames.PORCENTAJE_COMPROMISO] || ''}
                        onChange={handleChange}
                        disabled={onlySelect && includedParameters?.[inputNames.PORCENTAJE_COMPROMISO] != 'Y'}
                    />
                    
                    <Checkbox 
                        name={inputNames.NO_HORAS_VENTAS_PARCIALES} 
                        labelText={checkboxLabels.NO_HORAS_VENTAS_PARCIALES} 
                        checked={values[inputNames.NO_HORAS_VENTAS_PARCIALES] || ''}
                        onChange={handleChange}
                        disabled={onlySelect && includedParameters?.[inputNames.NO_HORAS_VENTAS_PARCIALES] != 'Y'}
                    />

                    <Checkbox 
                        name={inputNames.ACUMULADO_SEMANAL} 
                        labelText={checkboxLabels.ACUMULADO_SEMANAL} 
                        checked={values[inputNames.ACUMULADO_SEMANAL] || ''}
                        onChange={handleChange}
                        disabled={onlySelect && includedParameters?.[inputNames.ACUMULADO_SEMANAL] != 'Y'}
                    />
                
                    <Checkbox 
                        name={inputNames.TIPO_CAMBIO_TIENDAS} 
                        labelText={checkboxLabels.TIPO_CAMBIO_TIENDAS} 
                        checked={values[inputNames.TIPO_CAMBIO_TIENDAS] || ''}
                        onChange={handleChange}
                        disabled={onlySelect && includedParameters?.[inputNames.TIPO_CAMBIO_TIENDAS] != 'Y'}
                    />
                    
                    <Checkbox 
                        name={inputNames.INCLUIR_TOTAL} 
                        labelText={checkboxLabels.INCLUIR_TOTAL} 
                        checked={values[inputNames.INCLUIR_TOTAL] || ''}
                        onChange={handleChange}
                        disabled={onlySelect && includedParameters?.[inputNames.INCLUIR_TOTAL] != 'Y'}
                    />
        
                    <Checkbox 
                        name={inputNames.VENTAS_DIA_MES_ACTUAL} 
                        labelText={checkboxLabels.VENTAS_AL_DIA_MES_ACTUAL} 
                        checked={values[inputNames.VENTAS_DIA_MES_ACTUAL] || ''}
                        onChange={handleChange}
                        disabled={onlySelect && includedParameters?.[inputNames.VENTAS_DIA_MES_ACTUAL] != 'Y'}
                    />
            
                    <Checkbox 
                        name={inputNames.DETALLADO_TIENDA} 
                        labelText={checkboxLabels.DETALLADO_POR_TIENDA} 
                        checked={values[inputNames.DETALLADO_TIENDA] || ''}
                        onChange={handleChange}
                        disabled={onlySelect && includedParameters?.[inputNames.DETALLADO_TIENDA] != 'Y'}
                    />
                    
                    <Checkbox 
                        name={inputNames.INCLUIR_FIN_SEMANA_ANTERIOR} 
                        labelText={checkboxLabels.INCLUIR_FIN_DE_SEMANA_ANTERIOR} 
                        checked={values[inputNames.INCLUIR_FIN_SEMANA_ANTERIOR] || ''}
                        onChange={handleChange}
                        disabled={onlySelect && includedParameters?.[inputNames.INCLUIR_FIN_SEMANA_ANTERIOR] != 'Y'}
                    />
                    
                    <Checkbox 
                        name={inputNames.CONCENTRADO} 
                        labelText={checkboxLabels.CONCENTRADO} 
                        checked={values[inputNames.CONCENTRADO] || ''}
                        onChange={handleChange}
                        disabled={onlySelect && includedParameters?.[inputNames.CONCENTRADO] != 'Y'}
                    />
                    
                    <Checkbox 
                        name={inputNames.ACUMULATIVA} 
                        labelText={checkboxLabels.ACUMULATIVA} 
                        checked={values[inputNames.ACUMULATIVA] || ''}
                        onChange={handleChange}
                        disabled={onlySelect && includedParameters?.[inputNames.ACUMULATIVA] != 'Y'}
                    />
                    
                    <Checkbox 
                        name={inputNames.CON_EVENTOS} 
                        labelText={checkboxLabels.INCLUIR_EVENTOS} 
                        checked={values[inputNames.CON_EVENTOS] || ''}
                        onChange={handleChange}
                        disabled={onlySelect && includedParameters?.[inputNames.CON_EVENTOS] != 'Y'}
                    />
                    
                    <Checkbox 
                        name={inputNames.PROMEDIO} 
                        labelText={checkboxLabels.PROMEDIO} 
                        checked={values[inputNames.PROMEDIO] || ''}
                        onChange={handleChange}
                        disabled={onlySelect && includedParameters?.[inputNames.PROMEDIO] != 'Y'}
                    />
                </div>
                <div className='flex flex-row justify-end mt-4'>
                    <input type="submit" value="Guardar" className='primary-btn w-20'/>
                </div>
            </form>
    )
}
