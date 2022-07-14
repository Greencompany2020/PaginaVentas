import React, {useEffect} from "react";
import exportExcel from "../utils/exportExcel";

export default function Developer() {
  const handleExport = () => {
    const headers = [
      {
        value:'Plaza',
        cell:'A1',
        merge:'A1:A3',
        styles:{
          alignment:{
            vertical:'center',
            horizontal:'center'
          }
        }
      },
      {
        value: 'Del 11 de jul del 2022 al 17 del 2022',
        cell:'B1',
        merge:'B1:M1', 
        styles:{
          alignment:{
            vertical:'center',
            horizontal:'center'
          }
        }
      },
      {
        value:'COMP',
        cell:'B2',
        merge:'B2:B3',
      },
      {
        value:'2022',
        cell:'C2',
        merge:'C2:C3',
      },
      {
        value:'%',
        cell:'D2',
        merge:'D2:D3',
      },
      {
        value:'2021',
        cell:'E2',
        merge:'E2:E3',
      },
      {
        value:'Operaciones',
        cell:'F2',
        merge:'F2:I2',
      },
      {
        value:'Promedios',
        cell:'J2',
        merge:'J2:M2',
      },
      {
        value:'COMP',
        cell:'F3',
      },
      {
        value:'2022',
        cell:'G3',
      },
      {
        value:'%',
        cell:'H3',
      },
      {
        value:'2021',
        cell:'I3',
      },
      {
        value:'COMP',
        cell:'J3',
      },
      {
        value:'2022',
        cell:'K3',
      },
      {
        value:'%',
        cell:'L3',
      },
      {
        value:'2021',
        cell:'M3',
      },
    ]
    const columns = [
      {header: 'Del 11 de jul del 2022 al 17 del 2022', id:'title', merge:'A1:M1'},
      {header: 'Plaza', key:'plaza'},
      {header: 'COMP', key:'compromiso'},
      {header: '2022', key:'ventasActuales'},
      {header: '%', key:'porcentaje'},
      {header: '2021', key:'ventasAnterior'},
      {header: 'COMP', key:'operacionesComp'},
      {header: '2022', key:'operacionesActual'},
      {header: '%', key:'porcentajeOperaciones'},
      {header: '2021', key:'operacionesAnterior'},
      {header: 'COMP', key:'promedioComp'},
      {header: '2022', key:'operacionesComp'},
      {header: '%', key:'porcentajePromedios'},
      {header: '2021', key:'promedioAnterior'},
    ]

    const rows = [
      {
        "plaza": "MAZATLAN",
        "compromiso": 232291,
        "ventasActuales": 62761,
        "porcentaje": -73,
        "ventasAnterior": 245434,
        "operacionesComp": 5185,
        "operacionesActual": 1212,
        "porcentajeOperaciones": -77,
        "operacionesAnterior": 5076,
        "promedioComp": 44.8,
        "promedioActual": 51.8,
        "porcentajePromedios": 16,
        "promedioAnterior": 48.4
      },
      {
        "plaza": "VALLARTA",
        "compromiso": 78597,
        "ventasActuales": 20196,
        "porcentaje": -74,
        "ventasAnterior": 87180,
        "operacionesComp": 1821,
        "operacionesActual": 376,
        "porcentajeOperaciones": -79,
        "operacionesAnterior": 1902,
        "promedioComp": 43.2,
        "promedioActual": 53.7,
        "porcentajePromedios": 24,
        "promedioAnterior": 45.8
      },
      {
        "plaza": "ACAPULCO",
        "compromiso": 92272,
        "ventasActuales": 20556,
        "porcentaje": -78,
        "ventasAnterior": 104904,
        "operacionesComp": 1934,
        "operacionesActual": 378,
        "porcentajeOperaciones": -80,
        "operacionesAnterior": 2107,
        "promedioComp": 47.7,
        "promedioActual": 54.4,
        "porcentajePromedios": 14,
        "promedioAnterior": 49.8
      },
      {
        "plaza": "CANCUN",
        "compromiso": 83153,
        "ventasActuales": 21552,
        "porcentaje": -74,
        "ventasAnterior": 87886,
        "operacionesComp": 1737,
        "operacionesActual": 418,
        "porcentajeOperaciones": -76,
        "operacionesAnterior": 1764,
        "promedioComp": 47.9,
        "promedioActual": 51.6,
        "porcentajePromedios": 8,
        "promedioAnterior": 49.8
      },
      {
        "plaza": "PCARMEN",
        "compromiso": 44504,
        "ventasActuales": 10397,
        "porcentaje": -77,
        "ventasAnterior": 43535,
        "operacionesComp": 1018,
        "operacionesActual": 227,
        "porcentajeOperaciones": -78,
        "operacionesAnterior": 983,
        "promedioComp": 43.7,
        "promedioActual": 45.8,
        "porcentajePromedios": 5,
        "promedioAnterior": 44.3
      },
      {
        "plaza": "ISM",
        "compromiso": 19184,
        "ventasActuales": 5053,
        "porcentaje": -74,
        "ventasAnterior": 20838,
        "operacionesComp": 439,
        "operacionesActual": 98,
        "porcentajeOperaciones": -78,
        "operacionesAnterior": 469,
        "promedioComp": 43.7,
        "promedioActual": 51.6,
        "porcentajePromedios": 18,
        "promedioAnterior": 44.4
      },
      {
        "plaza": "CABOS",
        "compromiso": 21694,
        "ventasActuales": 6320,
        "porcentaje": -71,
        "ventasAnterior": 22167,
        "operacionesComp": 497,
        "operacionesActual": 128,
        "porcentajeOperaciones": -74,
        "operacionesAnterior": 441,
        "promedioComp": 43.6,
        "promedioActual": 49.4,
        "porcentajePromedios": 13,
        "promedioAnterior": 50.3
      },
      {
        "plaza": "GRUPO",
        "compromiso": 571694,
        "ventasActuales": 146835,
        "porcentaje": -74,
        "ventasAnterior": 611944,
        "operacionesComp": 12631,
        "operacionesActual": 2837,
        "porcentajeOperaciones": -78,
        "operacionesAnterior": 12742,
        "promedioComp": 45.3,
        "promedioActual": 51.8,
        "porcentajePromedios": 14,
        "promedioAnterior": 48
      }
    ]
    exportExcel('Ejemplo', headers,columns,rows);
  }

  return(
    <div className="p-4  w-full ">
      <button onClick={handleExport} className=" border rounded-md p-1">Exportar</button>
    </div>
  );
}

