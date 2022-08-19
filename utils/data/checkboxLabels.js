

export const checkboxLabels = {
  VENTAS_IVA: 'Ventas con Iva',
  VENTAS_EN_DLLS: 'Ventas en Miles Dlls',
  INCLUIR_VENTAS_EVENTOS: 'Incluir ventas de eventos',
  INCLUIR_TIENDAS_CERRADAS: 'Incluir tiendas cerradas',
  RESULTADO_PESOS: 'Resultados en pesos',
  SEMANA_SANTA: 'Considerar semana santa',
  EXCLUIR_SIN_AGNO_VENTAS: 'Excluir tiendas sin año de ventas',
  EXCLUIR_TIENDAS_SUSPENDIDAS: 'Excluir tiendas suspendidas',
  VENTAS_VS_COMPROMISO: 'Porcentaje ventas VS compromiso',
  NO_HORAS_VENTAS_PARCIALES: 'No considerar horas de ventas en parciales',
  TIPO_CAMBIO_TIENDAS: 'Utilizar tipo de cambios de tienda',
  ACUMULADO_SEMANAL: 'Incluir acumulado semanal',
  INCLUIR_TOTAL: 'Incluir total',
  VENTAS_AL_DIA_MES_ACTUAL: 'Ventas al Dia-Mes actual',
  DETALLADO_POR_TIENDA: 'Detallado por tienda',
  PORCENTAJE_VENTAS_VS_LOGRO: 'Porcentaje ventas vs logro',
  INCLUIR_FIN_DE_SEMANA_ANTERIOR: 'Incluir fin de semana anterior',
  INCLUIR_ACUMULADO: 'Incluir acumulado',
  PRESENTAR_PERIODO_COMPLETO: 'Presentar periodo completo',
  CONCENTRADO: 'Concentrado',
  ACUMULATIVA: 'Acumulativa',
  GRAFICAR_TOTAL: 'Graficar total',
  PORCENTAJE_VENTAS_VS_COMPROMISO: 'Porcentaje ventas VS Compromiso',
  INCLUIR_EVENTOS: 'Incluir eventos',
  PROMEDIO: 'Promedio',
  INTERCAMBIAR_SEMANA_SANTA: 'Intercambiar semana santa',
  PRESUPUESTO_EN_MESES_NO_EJERCIDOS: 'Presuesto en meses no ejercidos',
  OPERACIONES_EN_MILES: 'Operaciones en miles',
  INCLUIR_FIN_DE_SEMANA_ANTERIOR: 'Incluir fin de semana anterior',
  PERIODO_COMPLETO: 'Presentar periodo completo',
  CBAGNOSCOMPARAR: 'Años a comparar',
  CBAGNOSCOMPARAR_AGNOS:{
    AGNO1: 'Año de comparacion 1',
    AGNO2: 'Año de comparacion 2'
  },
  CBINCREMENTO: 'Formular % de incremento',
  CBMOSTRARTIENDAS: 'Mostrar tiendas',
  VISUALIZACION_DISPOSITIVOS: 'Visualizacion en dispositivos'
}

export const inputNames = {
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
  CON_EVENTOS: 'conEventos',
  VISTA_DESKTOP: 'desktopReportView',
  VISTA_MOBILE: 'mobileReportView',
}

export const comboNames = {
  CBAGNOSCOMPARAR: 'cbAgnosComparar',
  CBAGNOSCOMPARAR_AGNOS:{
    AGNO1:'agno1',
    AGNO2:'agno2'
  },
  AGNOSCOMPARATIVOS : 'agnosComparativos',
  CBINCREMENTO: 'cbIncremento',
  CBMOSTRARTIENDAS: 'cbMostrarTiendas',
  CBDESKTOP: 'Computadora',
  CBMOBIL: 'Movil'
}

export const comboValues = {
  CBAGNOSCOMPARAR:[
    {text:'1', value:1},
    {text:'2', value:2}
  ],
  CBINCREMENTO:[
    {text:'% Vs Compromiso',value:'compromiso'},
    {text:'% Vs Comparacion', value:'comparacion'}
  ],
  CBMOSTRARTIENDAS:[
    {text:'Tiendas Activas', value:'activas'},
    {text:'Mismas Tiendas', value:'mismas'},
    {text:'Todas las Tiendas', value:'todas'},
    {text:'Solo nuevas', value:'nuevas'},
  ],
  CBVISUALIZACION_DISPOSITIVOS:[
    {text: 'Vista de tabla', value:1},
    {text: 'Vista por tarjetas', value:2},
    {text: 'Viste de Region',value:3},
    {text: 'Vista por seccion', value:4}
  ]
}