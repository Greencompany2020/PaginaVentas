export const meses = [
  {
    value: 1,
    text: "Enero"
  },
  {
    value: 2,
    text: "Febrero"
  },
  {
    value: 3,
    text: "Marzo"
  },
  {
    value: 4,
    text: "Abril"
  },
  {
    value: 5,
    text: "Mayo"
  },
  {
    value: 6,
    text: "Junio"
  },
  {
    value: 7,
    text: "Julio"
  },
  {
    value: 8,
    text: "Agosto"
  },
  {
    value: 9,
    text: "Septiembre"
  },
  {
    value: 10,
    text: "Octubre"
  },
  {
    value: 11,
    text: "Noviembre"
  },
  {
    value: 12,
    text: "Diciembre"
  },
]

export const dias = [
  {
    value: 0,
    text: 'Lunes'
  },
  {
    value: 1,
    text: 'Martes'
  },
  {
    value: 2,
    text: 'Miercoles'
  },
  {
    value: 3,
    text: 'Jueves'
  },
  {
    value: 4,
    text: 'Viernes'
  },
  {
    value: 5,
    text: 'Sabado'
  },
  {
    value: 6,
    text: 'Domingo'
  }
]

export const tiendasGeneral = [
  {
    value: 0,
    text: "Frogs"
  },
  {
    value: 2,
    text: "Skoro"
  },
  {
    value: 3,
    text: "Web"
  }
]

export const tiendas = [
  {
    value: "0301",
    text: "M1"
  },
  {
    value: "0302",
    text: "M2"
  },
  {
    value: "0303",
    text: "M3"
  },
  {
    value: "0304",
    text: "M4"
  },
  {
    value: "0305",
    text: "M5"
  },
  {
    value: "0309",
    text: "M6"
  },
  {
    value: "0309",
    text: "M9"
  },
  {
    value: "0310",
    text: "M10"
  },
  {
    value: "0602",
    text: "PV2"
  },
  {
    value: "0604",
    text: "PV4"
  },
  {
    value: "0606",
    text: "PV6"
  },
  {
    value: "0701",
    text: "ACA1"
  },
  {
    value: "0702",
    text: "ACA2"
  },
  {
    value: "0705",
    text: "ACA5"
  },
  {
    value: "0505",
    text: "IS-5"
  },
  {
    value: "0506",
    text: "OUTLET MCD"
  },
  {
    value: "0507",
    text: "FORUM"
  },
  {
    value: "9950",
    text: "PYA1"
  },
  {
    value: "9954",
    text: "PYA4"
  },
  {
    value: "2601",
    text: "ISM1"
  },
  {
    value: "9631",
    text: "CAB1"
  },
  {
    value: "9633",
    text: "CAB3"
  },
  {
    value: "9502",
    text: "WEB-SF"
  },
]

export const plazas = [
  {
    value: 3,
    text: "MAZATLAN"
  },
  {
    value: 6,
    text: "VALLARTA"
  },
  {
    value: 7,
    text: "ACAPULCO"
  },
  {
    value: 5,
    text: "CANCUN"
  },
  {
    value: 99,
    text: "PCARMEN"
  },
  {
    value: 26,
    text: "ISM"
  },
  {
    value: 96,
    text: "CABOS"
  },
  {
    value: 11,
    text: "TULUM"
  },
  {
    value: 94,
    text: "SK MAZATLAN"
  },
  {
    value: 97,
    text: "SK CULIACAN"
  },
  {
    value: "093",
    text: "SK MEXICALI"
  },
  {
    value: "093",
    text: "SK CHIHUAHUA"
  },
  {
    value: 108,
    text: "COZUMEL"
  },
  {
    value: 92,
    text: "SK TIJUANA"
  }
]

export const regiones = ['REGION I', 'REGION II', 'REGION III', 'WEB'];

export const concentradoPlazas = [
  'MAZATLAN',
  'CANCUN',
  'VALLARTA',
  'ACAPULCO',
  'ISM',
  'WEB',
  'CABOS',
  'PCARMEN'
];

export const tiendascon = [
  {
    nombre: 'Por tienda',
    grupo: 'Diarias',
    configuracion: {
      iva: ['enabled', true],
      eventos: ['enabled', true],
      agnoSinVenta: ['enabled', true],
      cerrada: ['enabled', false],
      suspendida: ['enabled', true],
      pesos: ['disabled', false]
    }
  },

  {
    nombre: 'Por plaza',
    grupo: 'Diarias',
    configuracion: {
      iva: ['enabled', true],
      eventos: ['disabled', true],
      agnoSinVenta: ['enabled', true],
      cerrada: ['enabled', false],
      suspendida: ['enabled', true],
      pesos: ['disabled', false]
    }
  },

  {
    nombre: 'Del grupo',
    grupo: 'Diarias',
    configuracion: {
      iva: ['enabled', true],
      eventos: ['enabled', true],
      agnoSinVenta: ['enabled', true],
      cerrada: ['enabled', false],
      suspendida: ['enabled', true],
      pesos: ['disabled', false]
    }
  },

  {
    nombre: 'Compromiso',
    grupo: 'Semanales',
    configuracion: {
      iva: ['enabled', true],
      eventos: ['enabled', true],
      agnoSinVenta: ['enabled', true],
      cerrada: ['enabled', false],
      suspendida: ['enabled', true],
      pesos: ['disabled', false]
    }
  },

  {
    nombre: 'Por tienda',
    grupo: 'Semanales',
    configuracion: {
      iva: ['enabled', true],
      eventos: ['enabled', true],
      agnoSinVenta: ['enabled', true],
      cerrada: ['enabled', false],
      suspendida: ['enabled', true],
      pesos: ['disabled', false]
    }
  },

]

export const MENSAJE_ERROR = "Ha ocurrido un error durante al consulta de datos."
