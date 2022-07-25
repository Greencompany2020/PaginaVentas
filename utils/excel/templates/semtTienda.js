export default function semTienda () {
    const columns = [
        {
            cell: 'A1', 
            value:'Tienda', 
            merge:'A1:A3', 
            styles:{
                alignment:{
                    vertical:'center',
                    horizontal:'center'
                }
            }
        },
        {
            cell: 'B1', 
            value:'del 18 de Jul del 2022 Al 24 de Jul del 2022', 
            merge:'B1:Q1', 
            styles:{
                alignment:{
                    vertical:'center',
                    horizontal:'center'
                }
            }
        },
        {
            cell: 'B2', 
            value:'COM', 
            merge:'B2:B3'
        },
        {
            cell: 'C2', 
            value:'2022', 
            merge:'C2:C3'
        },
        {
            cell: 'D2',
            value:'%', 
            merge:'D2:D3'
        },
        {
            cell: 'E2', 
            value:'2021', 
            merge:'E2:E3'
        },
        {cell: 'F2',
            value:'Operaciones', 
            merge:'F2:I2', 
            styles:{
                alignment:{
                    vertical:'center',
                    horizontal:'center'
                }
            }
        },
        {
            cell: 'F3', 
            value:'COMP'
        },
        {
            cell: 'G3', 
            value:'2022'
        },
        {
            cell: 'H3', 
            value:'%'
        },
        {
            cell: 'I3', 
            value:'2021'
        },
        {
            cell: 'J2', 
            value:'Operaciones', 
            merge:'J2:M2', 
            styles:{
                alignment:{
                    vertical:'center',
                    horizontal:'center'
                }
            }
        },
        {
            cell: 'J3', 
            value:'COMP'
        },
        {
            cell: 'K3', 
            value:'2022'
        },
        {
            cell: 'L3', 
            value:'%'
        },
        {
            cell: 'M3', 
            value:'2021'
        },
        {
            cell: 'N2', 
            value:'Articulos PROM.', 
            merge:'N2:P2', 
            styles:{
                alignment:{
                    vertical:'center',
                    horizontal:'center'
                  }
            }
        },
        {
            cell: 'N3', 
            value:'2022'
        },
        {
            cell: 'O3', 
            value:'%'
        },
        {
            cell: 'P3', 
            value:'2021'
        },
    ]

    const format = {
        cellFormat: {number: '0,00', decimal:'0.00'},
        cols:{
            D:{styles:{numFmt:'#,##0;[Color 3]#,##0'}},
            H:{styles:{numFmt:'#,##0;[Color 3]#,##0'}},
            L:{styles:{numFmt:'#,##0;[Color 3]#,##0'}},
            O:{styles:{numFmt:'#,##0;[Color 3]#,##0'}},
        }
    }

    return{columns, format}
}