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

```Javascript
const checkboxLabels = {
  VENTAS_IVA: 'Ventas c/Iva',
  VENTAS_EN_DLLS: 'Ventas en Miles Dlls',
  INCLUIR_VENTAS_EVENTOS: 'Incluir Ventas de Eventos',
  INCLUIR_TIENDAS_CERRADAS: 'Incluir Tiendas Cerradas',
  RESULTADO_PESOS: 'Resultados en Pesos',
  SEMANA_SANTA: 'Considerar Semana Santa',
  EXCLUIR_TIENDAS_VENTAS: 'Excluir tiendas s/años de Ventas',
  EXCLUIR_TIENDAS_SUSPENDIDAS: 'Excluir Tiendas Suspendidas',
  VENTAS_VS_COMPROMISO: 'Porcetaje Ventas VS Compromiso',
  NO_HORAS_VENTAS_PARCIALES: 'No considerar las horas de venta en parciales',
  TIPO_CAMBIO_TIENDAS: 'Utilizar tipo de cambio en tiendas',
  ACUMULADO_SEMANAL: 'Incluir acumulado semanal'
}

```

### inputNames

```Javascript

const inputNames = {
  CON_IVA: "conIva",  // Componente: Checkbox
  SEMANA_SANTA: "semanaSanta", // Componente: Checkbox
  SIN_AGNO_VENTA: "sinAgnoVenta", // Componente: Checkbox
  CON_VENTAS_EVENTOS: "conVentasEventos", // Componente: Checkbox
  CON_TIENDAS_CERRADAS: "conTiendasCerradas", // Componente: Checkbox
  SIN_TIENDAS_SUSPENDIDAS: "sinTiendasSuspendidas", // Componente: Checkbox
  RESULTADOS_PESOS: "resultadosPesos", // Componente: Checkbox
  FECHA_INICIO: "fechaInicio", // Componente: InputDateRange
  FECHA_FIN: "fechaFin", // Componente: InputDateRange
  VENTAS_MILES_DLLS: "ventasMilesDlls", // Componente: Checkbox
  PORCENTAJE_COMPROMISO: "porcentajeVentasCompromiso", // Componente: Checkbox
  NO_HORAS_VENTAS_PARCIALES: "noHorasVentasParciales", // Componente: Checkbox
  ACUMULADO_SEMANAL: "acumuladoSemanal", // Componente: Checkbox
  TIPO_CAMBIO_TIENDAS: "tipoCambioTiendas" // Componente: Checkbox
}

```

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

Aqui van todas la funciones que se usan para generat títulos u obtener valores iniciales,
entre otras funciones.

### Lista de funciones

`getTiendaName(tiendaId: number)`: Obtiene el nombre de la tienda a partir del identificador de la misma.

`getPlazaName(plazaId: number)`: Obtiene el nomber de la plaza en base al identificador de la misma.

`getLastTwoNumbers(data: number)`: Obtiene los 2 últimos dígitos del años. Ej. 2021 -> 21.

`dateRangeTitle(beginDate: string, endDate: string)`: Crea un texto
de título a partir del rango de fechas ingresado. Ej.

```
beginDate: 2022-02-14
endDate: 2022-02-20
result: del 14 de Feb del 2022 Al 20 de Feb del 2022
```

`validateInputDateRange(beginDate: string, endDate: string)`: Verifica que las fechas sean válidas (Mejorar).

`getInitialTienda`: Obtiene el valor de la tienda que estará por defecto.

`getInitialPlaza`: Obtiene el valor de la plaza que estará por defecto.

En las funciones anteriores el valor está declarado dentro de la función,
por lo tanto si se quiere cambiar el valor, se tiene que ir directamente a
la declaración.

`createDatasets(data, fromYear, toYear, updateLabels, updateDatasets)`: Crea los array de etiquetas y de datos para la gráfica de barras. Los objetos deben poseer los campo **DescGraf** y **Ventas[number]**, donde
_[number]_ es un año dentro del rango especificado, en otras palabras,
es un campo con nombre dinámico.

**Parámetros**

- `data: object[]`: El array de la respuesta del servicio.
- `fromYear: number`: El año de inicio del intervalo de fechas.
- `toYear: number`: El año de fin del intervalo de fechas
- `updateLabels: Dispatch<SetActionState<any[]>>`: Es el `setState` para las etiquetas
- `updateDatasets: Dispatch<SetActionState<any[]>>`: : Es el `setState` para el dataset

`createSimpleDataset(data, updateLabels, updateDatasets)`: Crea los array de etiquetas y de datos para la gráfica de barras. Los objetos deben poseer los campos **Descrip** y **Ventas**.

## Handlers

## dateFunctions

##

## Servicios

Los servicios son los encargados de la comunicación con la API y de traer los datos. Es un servicio por cada submenú.

Todos los servicios usan `ApiProvider` para realizar las peticiones a la API.

Los servicios exportan funciones y se nombran usando _Camel Case_:

```Javascript
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
