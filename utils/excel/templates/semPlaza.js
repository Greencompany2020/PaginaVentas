export default function semPlaza (date) {
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
      value: String(date),
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

  const style = {
    format:{number: '0,00', decimal: '0.00'},
    cells:{
      L:{numFmt:'#,##0;[Color 3]#,##0'},
      D:{numFmt:'#,##0;[Color 3]#,##0'},
      H:{numFmt:'#,##0;[Color 3]#,##0'},
    }
  }

  return{
    columns,
    style,
  }
}