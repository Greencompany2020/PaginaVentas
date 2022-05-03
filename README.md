# Sitio de Ventas

- [Extension de VS Code recomendadas](#extension-de-vs-code-recomendadas)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Componentes](#componentes)
  - [**containers**](#containers)
  - [**inputs**](#inputs)
  - [**layout**](#layout)
  - [**table**](#table)
  - [**Otros**](#otros)
- [Importación de componentes](#importación-de-componentes)
- [Estructura básica de páginas](#estructura-básica-de-páginas)
- [Páginas](#páginas)
- [Data](#data)
  - [checkboxLabels](#checkboxlabels)
  - [inputNames](#inputnames)
  - [Relación CheckboxLabels e inputNames](#relación-checkboxLabels-e-inputNames)
  - [valores](#valores)
  - [enlacesMenuLateras](#enlacesmenulateras)

Aquí se añaden algunas recomendaciones para la estructura y trabajo del proyecto.

Para ejecutar el servidor de desarrollo:

```bash
npm run dev
# or
yarn dev
```

## Extension de VS Code recomendadas

- TailwindCSS
- indent-rainbow
- htmltagwrap
- ESLint
- Highlight Matching Tag
- ES7 React/Redux/GrapgQL/React Native snippets
- Prettier
- editorconfig
- Better Comments
- Error lens

## Estructura de carpetas

```
- components
- hooks
- pages
- public
- styles
- utils
  |- data
```

## Componentes

Los componentes relacionados entre sí se pueden acomodar en una carpeta base y crear un archivo `index.js` y añadir los `exports`.

Por ejemplo, se tiene la carpeta _buttons_ donde se encuentran los componentes `DashboardButton`, `DashboardButtonContainer` y `MinutasButton`, junto con un archivo `index.js` de la sig. manera:

```Javascript
  export { default as DashboardButton } from './DashboardButton';
  export { default as DashboardButtonContainer } from './DashboardButtonContainer';
  export { default as MinutasButton } from './MinutasButton';
```

Lo cual permite exportar varios componentes en una sola línea:

```Javascript
  import { DashboardButton, DashboardButtonContainer, } from '../../components/buttons';
```

De preferencia se recomienda que sean en inglés usando _Pascal Case_ ej. NombreLargo y que sean componentes funcionales.

### **containers**

Son los componentes usados _envolver_ y dar formato a los componentes hijos.

```
containers/
  |-Flex.jsx
  |-index.js
  |-Parametes.jsx
  |-Parameters.jsx
  |-ParametersContainer.jsx
  |-SmallContainer.jsx
```

`Flex` es un componente para acomodar elementos y otros componentes usando Flexbox. Recibe como props `className` y `children`.

`ParametersContainer` y `Parameters` se usan juntos para el componente de parámetros (los inputs para las tablas).

`SmallContainer` es para el texto pequeño en gris que se encuentra debajo de los parámetros.

### **inputs**

Son los componentes para los inputs en parámetros.

```
inputs/
  |- Checkbox.jsx
  |- index.js
  |- InputContainer.jsx
  |- InputDate.jsx
  |- InputDateRange.jsx
  |- InputToYear.jsx
  |- InputYear.jsx
  |- SelectMonth.jsx
  |- SelectPlazas.jsx
  |- SelectTiendas.jsx
  |- SelectTiendasGeneral.jsx
```

Todos los inputs deben ir dentro de un `InputContainer`. Cada un recibe como props `value` y `onChange`.

`InputDate`: para ingresar la fecha en formato DD-MM-AAAA en el campo _A la Fecha_.

`InputDateRange`: para ingresar un rango de fecha en los campos _Fecha Inicial_ y _Fecha Final_.

`InputToYear`: para ingresar el año en el campo _Al Año_.

`InputYear`: para ingresar el año en el campo _Del Año_.

`SelectMonth`: para seleccionar el mes en el campo _Del mes_.

`SelectToMonth`: para seleccionar el mes en el campo _Al mes_.

`SelectPlazas`: para seleccionar la plaza en el campo _Plaza_.

`SelectTiendas`: para seleccionar la tienda en el campo _Tienda_.

`SelectTiendasGeneral`: la diferencia con `SelectTiendas` es que solo posee las opciones: **Frogs**, **Skoro** y **Web**.

`Checkbox`: es cada checbox individual. Recibe como props `className`, `labelText`, `name` y `onChange`.
Los valores para `labelText` se obtienen de `checkboxLabels.js`.

`name` es necesario para obtener el valor del input. Los valores se obtienen de `inputName`

### **layout**

Es el componente que posee la barra de navegación, el menú lateral y el contendor para los parámetros y tablas.

```
layout/
  |- VentasLayout.jsx
```

### **table**

Componentes para estructurar tablas.

```
table/
  |- index.js
  |- TableBody.jsx
  |- TableHead.jsx
  |- VentasDiariasTableFooter.jsx
  |- VentasDiariasTableHead.jsx
  |- VentasTable.jsx
  |- VentasTableContainer.jsx
```

`VentasTableContainer`: el contenedor para las tablas.

`VentasTable`: es el componentes de tabla, es decir, la etiqueta `table` con estilos.

`TableHead`: es la etiqueta `thead` con estilos.

`TableBody`: es la etiqueta `tbody` con estilos.

`VentasDiariasTableFooter` y `VentasDiariasTableHead` son componentes solo para las tablas en `/diarias`.

### **Otros**

`BarChar`: es el componente de la gráfica de barras. Recibe como props `text` y `data`. `text` es el título de la gráfica y `data` es la información a graficar.

**labels** representa cada una de los grupos de barras verticales. Debe haber al menos un dataset para poder graficar los datos.

```Javascript
{
  labels: ['MZT', 'CAN', 'PV', 'ACA', 'ISM', 'CAB', 'PC'],
  datasets: [
    {
      id: 1,
      label: '2022',
      data: [5079, 1469, 1383, 4047, 344, 434, 881],
      backgroundColor: '#991b1b'
    },
    {
      id: 2,
      label: '2021',
      data: [8212, 2516, 2025, 5673, 814, 737, 2187],
      backgroundColor: '#9a3412'
    },
    {
      id: 3,
      label: '2020',
      data: [7196, 2067, 2377, 8228, 775, 883, 1888],
      backgroundColor: '#3f6212'
    },
    {
      id: 4,
      label: '2019',
      data: [5893, 1946, 2083, 7353, 845, 706, 1870],
      backgroundColor: '#065f46'
    },
    {
      id: 5,
      label: '2018',
      data: [5330, 1838, 2323, 5749, 791, 688, 1668],
      backgroundColor: '#155e75'
    },
  ]
}
```

## Importación de componentes

A la hora de importar componentes y archivos dentro de un componentes se recomienda seguir un cierto orden para mayor limpieza, el cual es el sig.

- **Componentes externos**: Son componentes del framework (ya sean de React o Next) o de otras librerías.
- **Componentes propios**: Son los componentes que hemos creado.
- **Funciones y hooks**: Las funciones y customs hooks que hemos creado.
- **recursos**: Los iconos, imágenes, archivos JS y estilos.

```Javascript
// componentes externos
// componentes propios
import VentasLayout from '../../components/layout/VentasLayout';
import {VentasTableContainer, VentasTable} from '../../components/table';
// funciones y hooks
// recursos (img, js, css)
import {reporteFechas} from '../../utils/data';
```

_Nota: no es necesario colocar los textos, pero funcionan de guía visual._

## Estructura básica de páginas

```Javascript
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { InputContainer, InputYear, SelectTiendasGeneral, Checkbox } from '../../components/inputs';
import { VentasTableContainer, VentasTable, TableHead, TableBody } from '../../components/table';

const Page = () => {
  return (
    <>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            ...
          </InputContainer>
        </Parameters>
        <SmallContainer>
          ...
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer>
        <VentasTable>
          <TableHead>
            ...
          </TableHead>
          <TableBody>
            ...
          </TableBody>
        </VentasTable>
      </VentasTableContainer>
    </>
  )
}

Page.getLayout = getVentasLayout;

export default Page;

```

## Páginas

Los nombres de las páginas van en minúsculas y en español, mientras que los de componentes
empiezan con mayúsculas. Ya que se está usando NextJS la estructura de las carpetas y archivos determina el routing.

Se recomienda crear una carpeta por cada submenú. Si existe una sola página para ese submenú se crea un archivo `index.js`.

## Data

En la carpeta `utils/data` están los archivos con información que son útiles para el maquetado.

Si se va agregar un nuevo archivo se debe también añadir su export en `index.js`.

Si dentro de archivo van a haber mas de una exportación en `index.js` se exporta de la sig. manera:

```Javascript
export { meses, tiendasGeneral, plazas, regiones, tiendas } from './valores';
```

### checkboxLabels

El nombre que se le asigna al prop `labelText` en el componente `Checkbox`.

```Javascript
const checkboxLabels = {
  VENTAS_IVA: 'Ventas c/Iva',
  VENTAS_EN_DLLS: 'Ventas en Miles Dlls',
  INCLUIR_VENTAS_EVENTOS: 'Incluir Ventas de Eventos',
  INCLUIR_TIENDAS_CERRADAS: 'Incluir Tiendas Cerradas',
  RESULTADO_PESOS: 'Resultados en Pesos',
  SEMANA_SANTA: 'Considerar Semana Santa',
  EXCLUIR_SIN_AGNO_VENTAS: 'Excluir Tiendas sin Año de Ventas',
  EXCLUIR_TIENDAS_SUSPENDIDAS: 'Excluir Tiendas Suspendidas',
  VENTAS_VS_COMPROMISO: 'Porcentaje Ventas VS Compromiso',
  NO_HORAS_VENTAS_PARCIALES: 'No considerar las horas de venta en parciales',
  TIPO_CAMBIO_TIENDAS: 'Utilizar tipo de Cambio en Tiendas',
  ACUMULADO_SEMANAL: 'Incluir Acumulado Semanal',
  INCLUIR_TOTAL: 'Incluir Total',
  VENTAS_AL_DIA_MES_ACTUAL: 'Ventas al Dia-Mes Actual',
  DETALLADO_POR_TIENDA: 'Detallado por Tienda',
  PORCENTAJE_VENTAS_VS_LOGRO: 'Porcentaje Ventas vs Logro',
  INCLUIR_FIN_DE_SEMANA_ANTERIOR: 'Incluir fin de semana anterior',
  INCLUIR_ACUMULADO: 'Incluir Acumulado',
  PRESENTAR_PERIODO_COMPLETO: 'Presentar Periodo Completo',
  CONCENTRADO: 'Concentrado',
  ACUMULATIVA: 'Acumulativa',
  GRAFICAR_TOTAL: 'Graficar Total',
  PORCENTAJE_VENTAS_VS_COMPROMISO: 'Porcentaje Ventas vs Compromiso',
  INCLUIR_EVENTOS: 'Incluir Eventos',
  PROMEDIO: 'Promedio',
  INTERCAMBIAR_SEMANA_SANTA: 'Intercambiar Semana Santa',
  PRESUPUESTO_EN_MESES_NO_EJERCIDOS: 'Presuesto en Meses no ejercidos',
  OPERACIONES_EN_MILES: 'Operaciones en Miles',
  PERIODO_COMPLETO: 'Presentar periodo completo'
}

```

### inputNames

El valor que se le asigna al prop `name` en el componente Checkbox.

```Javascript

const inputNames = {
  CON_IVA: 'conIva',  // Componente: Checkbox
  SEMANA_SANTA: 'semanaSanta', // Componente: Checkbox
  SIN_AGNO_VENTA: 'sinAgnoVenta', // Componente: Checkbox
  CON_VENTAS_EVENTOS: 'conVentasEventos', // Componente: Checkbox
  CON_TIENDAS_CERRADAS: 'conTiendasCerradas', // Componente: Checkbox
  SIN_TIENDAS_SUSPENDIDAS: 'sinTiendasSuspendidas', // Componente: Checkbox
  RESULTADOS_PESOS: 'resultadosPesos', // Componente: Checkbox
  VENTAS_MILES_DLLS: 'ventasMilesDlls', // Componente: Checkbox
  PORCENTAJE_COMPROMISO: 'porcentajeVentasCompromiso', // Componente: Checkbox
  NO_HORAS_VENTAS_PARCIALES: 'noHorasVentasParciales', // Componente: Checkbox
  ACUMULADO_SEMANAL: 'acumuladoSemanal', // Componente: Checkbox
  TIPO_CAMBIO_TIENDAS: 'tipoCambioTiendas', // Componente: Checkbox
  INCLUIR_TOTAL: 'incluirTotal',
  VENTAS_DIA_MES_ACTUAL: 'ventasDiaMesActual',
  DETALLADO_TIENDA: 'detalladoTienda',
  INCLUIR_FIN_SEMANA_ANTERIOR: 'incluirFinSemanaAnterior',
  CONCENTRADO: 'concentrado',
  ACUMULATIVA: 'acumulado',
  GRAFICAR_TOTAL: 'total',
  PROMEDIO: 'promedio',
  CON_EVENTOS: 'conEventos'
}

```
### Relación CheckboxLabels e inputNames.

El valor del prop `name` es necesario ya que define los valores que son enviados a la API para las consultas.

Al único componente al que se le pasa como prop `name` es `Checkbox`.

| texto | name | Checkbox Label | input Name|
|-------|------|----------------|-----------|
| Ventas c/Iva |conIva|   VENTAS_IVA   | CON_IVA   |
| Considerar Semana Santa |semanaSanta | SEMANA_SANTA | SEMANA_SANTA |
| Excluir Tiendas sin Año de Ventas |sinAgnoVenta | EXCLUIR_SIN_AGNO_VENTAS | SIN_AGNO_VENTA |
| Incluir Ventas de Eventos |conVentasEventos | INCLUIR_VENTAS_EVENTOS | CON_VENTAS_EVENTOS |
| Incluir Tiendas Cerradas | conTiendasCerradas | CON_TIENDAS_CERRADAS | INCLUIR_TIENDAS_CERRADAS |
| Excluir Tiendas Suspendidas |sinTiendasSuspendidas | SIN_TIENDAS_SUSPENDIDAS | EXCLUIR_TIENDAS_SUSPENDIDAS |
| Resultados en Pesos |resultadosPesos | RESULTADOS_PESOS | RESULTADOS_PESOS |
| Ventas en Miles Dlls |ventasMilesDlls | VENTAS_EN_DLLS | VENTAS_MILES_DLLS |
| Porcentaje Ventas vs Compromiso |porcentajeVentasCompromiso | VENTAS_VS_COMPROMISO | PORCENTAJE_COMPROMISO |
| No considerar las horas de venta en parciales |noHorasVentasParciales | NO_HORAS_VENTAS_PARCIALES | NO_HORAS_VENTAS_PARCIALES |
| Incluir Acumulado Semanal |acumuladoSemanal | ACUMULADO_SEMANAL | ACUMULADO_SEMANAL | 
| Utilizar tipo de Cambio en Tiendas |tipoCambioTiendas | TIPO_CAMBIO_TIENDAS | TIPO_CAMBIO_TIENDAS |
| Incluir Total |incluirTotal | INCLUIR_TOTAL | INCLUIR_TOTAL |
| Ventas al Dia-Mes Actual |ventasDiaMesActual | VENTAS_AL_DIA_MES_ACTUAL | VENTAS_DIA_MES_ACTUAL |
| Detallado por Tienda |detalladoTienda | DETALLADO_POR_TIENDA | DETALLADO_TIENDA |
| Incluir fin de semana anterior |incluirFinSemanaAnterior | INCLUIR_FIN_DE_SEMANA_ANTERIOR | INCLUIR_FIN_SEMANA_ANTERIOR |
| Concentrado | concentrado | CONCENTRADO | CONCENTRADO |
| Acumulativa |acumulado | ACUMULATIVA | ACUMULATIVA |
| GRAFICAR_TOTAL |total | GRAFICAR_TOTAL | GRAFICAR_TOTAL |
| Promedio | promedio | PROMEDIO | PROMEDIO |

### valores

Los valores de plazas, regiones, tiendas y tiendasGeneral.

### enlaces

En una array con los submenus y enlaces de la barra de navegación lateral. Aqui se agregan los submenus.

```Javascript
const enlaces = [
  {
    summaryText: 'Diarias',
    links: [
      {
        link: '/diarias/grupo',
        linkText: 'Del Grupo'
      },
      {
        link: '/diarias/plaza',
        linkText: 'Por Plaza'
      },
      {
        link: '/diarias/tienda',
        linkText: 'Por Tienda'
      },
      {
        link: '/diarias/simple',
        linkText: 'Tienda Simple'
      },
      {
        link: '/diarias/fechas',
        linkText: 'Verificar fechas'
      },
    ]
  },
  ...
]
```

## functions

Aqui van todas la funciones que se usan para generar títulos u obtener valores iniciales,
entre otras funciones.

## Handlers

Son las funciones que manejan el onChange de los inputs y actualizan el estado.

```Javascript
const handleChange = (evt, updateState) => {
  let value = 0;
  if (evt.target.hasOwnProperty('checked')) {
    value = evt.target.checked ? 1 : 0;
  } else if (evt.target.name === "tienda") {
    value = evt.target.value;
  } else if (evt.target.type === "date" || evt.target.type === "text") {
    value = evt.target.value;
  } else {
    value = Number(evt.target.value);
  }

  updateState(prev => ({
    ...prev,
    [evt.target.name]: value
  }));
}

```

## dateFunctions

Contiene todas las funciones de manejo de fechas (creación de rangos, fechas anterior, etc.)

##

## Servicios

Los servicios son los encargados de la comunicación con la API y de traer los datos. Es un servicio por cada submenú.

Todos los servicios usan `ApiProvider` para realizar las peticiones a la API.

Los servicios exportan funciones y se nombran usando _Camel Case_:

```Javascript
// AnualesService
import ApiProvider from "./ApiProvider";

export async function getAnualesPlazas(body) {
  try {
    const { data } = await ApiProvider.post("/anuales/plazas", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
  }
}
```

El nombre se forma empezando con _get_ seguido del nombre del submenú y
el enlace.
