export default function semTiendas(title, rows, years){
    const getColums = () => {
        const columns = [
            {
                value: 'Plaza',
                cell: 'A1',
                merge: 'A1:A3',
                styles:{
                    alignment:{
                        vertical:'center',
                        horizontal:'center'
                    }
                }
            },
            {
                value: title,
                cell: 'B1',
                merge: years[2] ? 'B1:X1' : 'B1:P1',
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
                merge:'B2:B3'
            },
            {
                value:years[0],
                cell:'C2',
                merge:'C2:C3'
            },
            {
                value:'%',
                cell:'D2',
                merge:'D2:D3'
            },
            {
                value:years[1],
                cell:'E2',
                merge:'E2:E3'
            },
            (years[2]) ? [
                {
                    value:'%',
                    cell:'F2',
                    merge:'F2:F3'
                },
                {
                    value:years[2],
                    cell:'G2',
                    merge:'G2:G3'
                }
            ] : [],
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
                value:'ARTICULOS PROM.',
                cell: years[2] ? 'T2' : 'N2',
                merge: years[2] ? 'T2:X2' : 'N2:P2'
            },
            {
                value:'COMP',
                cell: years[2] ? 'H3' : 'F3'
            },
            {
                value:years[0],
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
                    value:'%',
                    cell:'L3'
                },
                {
                    value:years[2],
                    cell:'M3'
                }
            ] : [],
            {
                value:'COMP',
                cell: years[2] ? 'N3' : 'J3'
            },
            {
                value:years[0],
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
            ] : [],
            {
                value:years[0],
                cell: years[2] ? 'T3' : 'N3'
            },
            {
                value:'%',
                cell: years[2] ? 'U3' : 'O3'
            },
            {
                value:years[1],
                cell: years[2] ? 'V3' : 'P3'
            },
            (years[2]) ? [
                {
                    value:'%',
                    cell:'W3'
                },
                {
                    value:years[2],
                    cell:'X3'
                }
            ] : []
        ]
        return columns.flat();
    }

    const getRows = () => {
        if(rows){
            const items = rows.map(item  => ({
                plaza: item['plaza'],
                compromisoActual: item['compromiso' + years[0]] || 0,
                ventasActual: item['ventasActuales' + years[0]] || 0,
                porcentajeActual: item['porcentaje' + years[0]] || 0,
                ventasAnterior: item['ventasActuales' + years[1]] || 0,
                ...(years[2]) && {porcentajeActualAdicional: item['porcentaje' + years[2]] || 0},
                ...(years[2]) && {ventasAdicional: item['ventasActuales' + years[2]] || 0},

                operacionesCompromiso: item['operacionesComp' + years[0]] || 0,
                operacionesVentas: item['operacionesActual' + years[0]] || 0,
                operacionesPorcentaje: item['porcentajeOperaciones' + years[1]]|| 0,
                operacionesVentasAnterior: item['operacionesActual' + years[1]]|| 0,
                ...(years[2]) && {operacionesPorcentajeAdicional: item['porcentajeOperaciones' + years[2]] || 0},
                ...(years[2]) && {operacionesVentasAdicional: item['operacionesActual' + years[2]] || 0},

                promedioscompromiso: item['promedioComp' + years[0]]|| 0,
                promedioVentas: item['promedioActual' + years[0]]|| 0,
                promedioPorcentaje: item['porcentajePromedios' + years[1]]|| 0,
                promediosVentasAnterior:item['promedioActual' + years[1]]|| 0,
                ...(years[2]) && {promediosPorcentajeAdicional: item['porcentajePromedios' + years[2]] || 0},
                ...(years[2]) && {promediosVentasAdicional: item['promedioActual' + years[2]] || 0},

                articulosVentas: item['articulosActual' + years[0]] || 0,
                articulosPorcentaje: item['articulosPorcentaje' + years[1]] || 0,
                articulosVentasAnterior: item['articulosActual' + years[1]] || 0,
                ...(years[2]) && {articulosProcentajeAdicional: item['articulosPorcentaje' + years[2]] || 0},
                ...(years[2]) && {articulosVentasAdicional: item['articulosActual' + years[2]] || 0}
            }));

            return items;
        }
        else{
            return [];
        }
    }

    const style = {
        format:{number: '#,##;-#,##', decimal: '#.##;-#.##'},
        cols:{
            D:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'},
            L:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'},
            ...(!years[2]) && {O:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
            ...(years[2]) && {F:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
            ...(years[2]) && {J:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
            ...(years[2]) && {P:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
            ...(years[2]) && {U:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
            ...(years[2]) && {W:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
            ...(years[2]) && {R:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
        }
    }

    return{
        getColums,
        getRows,
        style
    }
}