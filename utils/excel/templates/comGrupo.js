export default function comGrupo(titles, rows, years){
    const getColumns = () => {
        const columns = [
            {
                value:'Tienda',
                cell:'A1',
                merge:'A1:A2',
                alignment:{
                    vertical:'center',
                    horizontal:'center'
                }
            },
            {
                value:titles[0] || 'Acumulado Dia',
                cell:'B1',
                merge:years[2] ? 'B1:G1' : 'B1:E1',
                alignment:{
                    vertical:'center',
                    horizontal:'center'
                }
            },
            {
                value:titles[1] || 'Acumulado Semanal',
                cell: years[2] ? 'H1' : 'F1',
                merge: years[2] ? 'H1:M1' : 'F1:I1',
                alignment:{
                    vertical:'center',
                    horizontal:'center'
                }
            },
            {
                value:titles[2] || 'Acumulado Mes',
                cell: years[2] ? 'N1' : 'J1',
                merge: years[2] ? 'N1:U1' : 'J1:N1',
                alignment:{
                    vertical:'center',
                    horizontal:'center'
                }
            },
            {
                value:'Acumulado Anual',
                cell: years[2] ? 'V1' : 'O1',
                merge: years[2] ? 'V1:AC1' : 'O1:S1',
                alignment:{
                    vertical:'center',
                    horizontal:'center'
                }
            },

            {
                value:years[0],
                cell:'B2',
            },
            {
                value:years[1],
                cell:'C2',
            },
            {
                value:'PPTO.',
                cell:'D2',
            },
            {
                value:'%',
                cell:'E2',
            },
            (years[2]) ? [
                 {
                value:years[2],
                cell:'F2',
                },
                {
                    value:'%',
                    cell:'G2',
                },
            ] : [],
           

            {
                value:years[0],
                cell: years[2] ? 'H2' : 'F2',
            },
            {
                value:years[1],
                cell: years[2] ? 'I2' : 'G2',
            },
            {
                value:'PPTO.',
                cell: years[2] ? 'J2' : 'H2',
            },
            {
                value:'%',
                cell: years[2] ? 'K2' : 'I2',
            },
            (years[2]) ? [
                {
                value:years[2],
                cell:'L2',
                },
                {
                    value:'%',
                    cell:'M2',
                },
            ] : [],
          

            {
                value:years[0],
                cell: years[2] ? 'N2' : 'J2',
            },
            {
                value:years[1],
                cell: years[2] ? 'O2' : 'K2',
            },
            {
                value:'PPTO.',
                cell: years[2] ? 'P2' : 'L2',
            },
            {
                value:'(-)',
                cell: years[2] ? 'Q2' : 'M2'
            },
            {
                value:'%',
                cell: years[2] ? 'R2' : 'N2',
            },
            (years[2]) ? [
                 {
                value:years[2],
                cell:'S2',
                },
                {
                    value:'(-)',
                    cell:'T2',
                },
                {
                    value:'%',
                    cell:'U2',
                },
            ] : [],
           

            {
                value:years[0],
                cell:years[2] ? 'V2' : 'O2',
            },
            {
                value:years[1],
                cell: years[2] ? 'W2' : 'P2',
            },
            {
                value:'PPTO.',
                cell: years[2] ? 'X2' : 'Q2',
            },
            {
                value:'(-)',
                cell: years[2] ? 'Y2' : 'R2'
            },
            {
                value:'%',
                cell: years[2] ? 'Z2' : 'S2',
            },
            (years[2]) ? [
                {
                value:years[2],
                cell:'AA2',
                },
                {
                    value:'(-)',
                    cell:'AB2',
                },
                {
                    value:'%',
                    cell:'AC2',
                },
            ] : []
            
        ]

        return columns.flat(1);
    }

    const getRows = () => {
        if(rows){
            const items = Object.entries(rows).map(([key, value]) => {
                return value.map(item =>({
                    tienda: item['tienda'],
                    ventasActual: item['ventasActuales' + years[0]] || 0,
                    ventasAnterior: item['ventasActuales' + years[1]] || 0,
                    presupuesto: item['presupuesto' + years[0]] || 0,
                    porcentaje: item['porcentaje' + years[0]],
                    ...(years[2]) && {ventasAdicional: item['ventasActuales' + years[2]]},
                    ...(years[2]) && {porcentajeAdicional: item['porcentaje' + years[2]]},

                    ventasSemanal: item['ventasSemanalesActual' + years[0]] || 0,
                    ventasSemanalAnterior: item['ventasSemanalesActual' + years[1]] || 0,
                    presupuestoSemanal: item['presupuestoSemanal' + years[0]] || 0,
                    porcentajeSemanal: item['porcentajeSemanal' + years[0]],
                    ...(years[2]) && {ventasSemanalAdicional: item['ventasSemanalesActual' + years[2]] || 0},
                    ...(years[2]) && {porcentajeSemanalAdicional: item['porcentajeSemanal' + years[2]] || 0},

                    ventasMensual: item['ventasMensualesActual' + years[0]] || 0,
                    ventasMensualAnterior: item['ventasMensualesActual' + years[1]] || 0,
                    presupuestoMensual: item['presupuestoMensual' + years[0]] || 0,
                    diferenciaMensual: item['diferenciaMensual' + years[1]] || item['diferenciaMensual'],
                    porcentajeMensual: item['porcentajeMensual' + years[0]],
                    ...(years[2]) && {ventasMensualAdicional: item['ventasMensualesActual' + years[2]] || 0},
                    ...(years[2]) && {diferenciaMensualAdicional: item['diferenciaMensual' + years[2]] || 0},
                    ...(years[2]) && {porcentajeMensualAdicional: item['porcentajeMensual' + years[2]] || 0},

                    ventasAnual: item['ventasAnualActual' + years[0]] || 0,
                    ventasAnualAnterior: item['ventasAnualActual' + years[1]] || 0,
                    presupuestoAnual: item['presupuestoAnual' + years[0]] || 0,
                    diferenciaAnual: item['diferenciaAnual' + years[1]] || item['diferenciaAnual'],
                    porcentajeAnual: item['porcentajeAnual' + years[0]] || 0,
                    ...(years[2]) && {ventasAnualAdicional: item['ventasAnualActual' + years[2]] || 0},
                    ...(years[2]) && {diferenciaAnualAdicional: item['diferenciaAnual' + years[2]] || 0},
                    ...(years[2]) && {porcentajeAnualAdicional: item['porcentajeAnual' + years[2]] || 0},

                    
                }));

            });
            return {...items};
        }
    }

    const style = {
        format:{number: '#,##;-#,##', decimal: '#.##;-#.##'},
        cols:{
            E:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'},
            ...(!years[2]) && {I:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
            ...(!years[2]) && {N:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
            ...(!years[2]) && {S:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},

            ...(!years[2]) && {M:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
            ...(!years[2]) && {R:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},

            ...(years[2]) && {G:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
            ...(years[2]) && {K:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
            ...(years[2]) && {M:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
            ...(years[2]) && {R:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
            ...(years[2]) && {U:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
            ...(years[2]) && {Z:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
            ...(years[2]) && {AC:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},

            ...(years[2]) && {Q:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
            ...(years[2]) && {T:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
            ...(years[2]) && {Y:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
            ...(years[2]) && {AB:{numFmt:'[Color 10]#,##0;[Color 3]#,##0'}},
        }
    }

    return{
        getColumns,
        getRows,
        style
    }
}