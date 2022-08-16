export default function semPlaza (title, rows, years) {
  const getColums = () => {
    const columns = [
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
        value: String(title),
        cell:'B1',
        merge: years[2] ? 'B1:S1' : 'B1:M1', 
        styles:{
          alignment:{
            vertical:'center',
            horizontal:'center'
          }
        }
      },
      {
        value:'OPERACIONES',
        cell: years[2] ? 'H2' : 'F2',
        merge: years[2] ? 'H2:M2' : 'F2:I2'
      },
      {
        value:'PROMEDIOS',
        cell: years[2] ? 'N2' : 'J2',
        merge: years[2] ? 'N2:S2' : 'J2:M2'
      },
      {
        value:'COMP',
        cell:'B2',
        merge:'B2:B3',
      },
      {
        value:years[0],
        cell:'C2',
        merge:'C2:C3',
      },
      {
        value:'%',
        cell:'D2',
        merge:'D2:D3',
      },
      {
        value:years[1],
        cell:'E2',
        merge:'E2:E3',
      },
      (years[2]) ? [
        {
          value:'%',
          cell: 'F2',
          merge: 'F2:F3'
        },
        {
          value:years[2],
          cell:'G2',
          merge:'G2:G3'
        }
      ] : [],
      {
        value:'COMP',
        cell: years[2] ? 'H3' : 'F3'
      },
      {
        value: years[0],
        cell: years[2] ? 'I3' : 'G3'
      },
      {
        value:'%',
        cell: years[2] ? 'J3' : 'H3'
      },
      {
        value: years[1],
        cell: years[2] ? 'K3' : 'I3'
      },
      (years[2]) ? [
        {
          value: '%',
          cell: 'L3'
        },
        {
          value: years[2],
          cell: 'M3'
        }
      ] : [],
      {
        value:'COMP',
        cell: years[2] ? 'N3' : 'J3'
      },
      {
        value: years[0],
        cell: years[2] ? 'O3' : 'K3'
      },
      {
        value:'%',
        cell: years[2] ? 'P3' : 'L3'
      },
      {
        value:years[1],
        cell: years[2] ? 'Q3' : 'M3'
      },
      (years[2]) ? [
        {
          value:'%',
          cell:'R3'
        },
        {
          value:years[2],
          cell:'S3'
        }
      ]: []
    ];
    return columns.flat(1);
  }
  

  const getRows = () =>{
    if(rows){
      const items = rows.map(item =>({
        plaza: item['plaza'],
        compromisoActual: item['compromiso' + years[0]] || 0,
        ventasActual: item['ventasActuales' + years[0]] || 0,
        porcentajeActual: item['porcentaje' + years[1]] || 0,
        ventasAnterior: item['ventasActuales' + years[1]] || 0,
        ...(years[2]) && {porcentajeActualAdicional:item['porcentaje' + years[2]] || 0},
        ...(years[2]) && {ventasAnteriorAdicional:item['ventasActuales' + years[2]] || 0},


        compromisoOperaciones: item['operacionesComp' + years[0]] || 0,
        compromisoVentas: item['operacionesActual' +  years[0]] || 0,
        compromisoPorcentaje: item['porcentajeOperaciones' + years[1]] || 0,
        compromisoVentasAnterior: item['operacionesActual' + years[1]] || 0,
        ...(years[2]) && {compromisoPorcentajeAdicional: item['porcentajeOperaciones' + years[2]] || 0},
        ...(years[2]) && {compromisoVentasAnteriorAdicional: item['operacionesActual' + years[2]] || 0},

        promedioscompromiso: item['promedioComp' + years[0]] || 0,
        promedioVentas: item['promedioActual' + years[0]] || 0,
        promedioPorcentaje: item['porcentajePromedios' + years[1]] || 0,
        promediosVentasAnterior:item['promedioActual' + years[1]] || 0,
        ...(years[2]) && {promediosPorcentajeAdicional: item['porcentajePromedios' + years[2]] || 0},
        ...(years[2]) && {promediosVentasAnteriorAdicional: item['promedioActual' + years[2]] || 0}
      }));

      return items;
    }
    else{
      return [];
    }
  }
  const style = {
    format:{number: '#,##', decimal: '#.##'},
    cols:{
      L:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'},
      D:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'},
      H:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'},
      ...(years[2]) && {F:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
      ...(years[2]) && {J:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
      ...(years[2]) && {P:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
      ...(years[2]) && {R:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
    }
  }

  return{
    getColums,
    getRows,
    style,
  }
}