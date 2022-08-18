export default function comPlazas(title, rows, years){
    const getColumns = () => {
        const columns  = [
            {
                value:'Plaza',
                cell:'A1',
                merge:'A1:A2',
                alignment:{
                    vertical:'center',
                    horizontal:'center'
                }
            },
            {
                value:`Acumulado ${title}`,
                cell:'B1',
                merge: years[2] ?  'B1:I1' : 'B1:F1',
                alignment:{
                    vertical:'center',
                    horizontal:'center'
                }
            },
            {
                value:'Acumulado anual',
                cell: years[2] ? 'J1' : 'G1',
                merge: years[2] ? 'J1:Q1' : 'G1:K1',
                alignment:{
                    vertical:'center',
                    horizontal:'center'
                }
            },
            {
                value: years[0],
                cell:'B2'
            },
            {
                value: years[1],
                cell:'C2'
            },
            {
                value:'PPTO.',
                cell:'D2'
            },
            {
                value: '(-)',
                cell:'E2'
            },
            {
                value:'%',
                cell:'F2'
            },
            (years[2]) ? [
                {
                    value: years[2],
                    cell:'G2'
                },
                {
                    value:'(-)',
                    cell:'H2'
                },
                {
                    value:'%',
                    cell:'I2'
                }
            ] : [],
            {
                value: years[0],
                cell: years[2] ? 'J2' : 'G2'
            },
            {
                value: years[1],
                cell: years[2] ? 'K2' : 'H2'
            },
            {
                value:'PPTO.',
                cell: years[2] ? 'L2' : 'I2'
            },
            {
                value:'(-)',
                cell: years[2] ? 'M2' : 'J2'
            },
            {
                value:'%',
                cell: years[2] ? 'N2' : 'K2'
            },
            (years[2]) ? [
                {
                    value: years[2],
                    cell:'O2'
                },
                {
                    value:'(-)',
                    cell:'P2'
                },
                {
                    value:'%',
                    cell:'Q2'
                }
            ] : []
        ]

        return columns.flat(1);
    }

    const getRows = () => {
        if(rows){

            const items = Object.entries(rows).map(([key, value]) => {
                return value.map(item => ({
                    plaza: item['plaza'],
                    ventasActual: item['ventasMensualesActual' + years[0]] || 0,
                    ventasAnterior: item['ventasMensualesActual' + years[1]] || 0,
                    presupuesto: item['presupuestoMensual' + years[0]] || 0,
                    diferencia: item['diferenciaMensual' + years[1]] || 0,
                    porcentaje: item['porcentajeMensual' + years[1]] || 0,
                    ...(years[2]) && {ventasAdicional: item['ventasMensualesActual' + years[2]] || 0},
                    ...(years[2]) && {diferenciaAdicional: item['diferenciaMensual' + years[2]] || 0},
                    ...(years[2]) && {porcentajeAdicional: item['porcentajeMensual' + years[2]] || 0},
    
                    ventasAnuales: item['ventasAnualActual' + years[0]] || 0,
                    ventasAnualAnterior: item['ventasAnualActual' + years[1]] || 0,
                    presupuestoAnual: item['presupuestoAnual' + years[0]] || 0,
                    diferenciaAnual: item['diferenciaAnual' + years[1]] || 0,
                    porcentajeAnual: item['porcentajeAnual' + years[1]] || 0,
                    ...(years[2]) && {ventasAnualesAdicional: item['ventasAnualActual' + years[2]] || 0},
                    ...(years[2]) && {diferenciaAnualAdicional: item['diferenciaAnual' + years[2]] || 0},
                    ...(years[2]) && {porcentajeAnualAdicional: item['porcentajeAnual' + years[2]] || 0},
                }));
            });
            return {...items};
        }
    }

    const style = {
        format:{number:  '#,##;-#,##', decimal: '#.##;-#.##'},
        cols:{
            F:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'},
            ...(!years[2]) && {K:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
            ...(years[2]) && {I:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
            ...(years[2]) && {N:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
            ...(years[2]) && {Q:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
        }
    }

    return{
        getColumns,
        getRows,
        style
    }
}