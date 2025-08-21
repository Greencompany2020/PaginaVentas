// pages/reportes/VentaDetNivelTienda.jsx
import React, { useMemo, useState, useEffect } from 'react'
import { Formik, Form } from 'formik'

import withAuth from '../../components/withAuth'
import { getVentasLayout } from '../../components/layout/VentasLayout'
import TitleReport from '../../components/TitleReport'
import { useNotification } from '../../components/notifications/NotificationsProvider'

import { ParametersContainer, Parameters } from '../../components/containers'
import { Input, Checkbox } from '../../components/reportInputs'
import ExcelButton from '../../components/buttons/ExcelButton'

import DateHelper from '../../utils/dateHelper'
import { numberWithCommas, selectRow } from '../../utils/resultsFormated'

import { getVentaDetNivelTienda } from '../../services/VentaDetService'

const fmtPct = (p) => `${(Number(p || 0) * 100).toFixed(1)}%`

function VentaDetNivelTienda() {
  const sendNotification = useNotification()
  const dateHelper = DateHelper()

  // Datos
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState([])
  const [range, setRange] = useState(() => {
    const hoy = new Date(dateHelper.getYesterdayDate())
    const ini = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    const ymd = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    return { ini: ymd(ini), fin: ymd(hoy) }
  })

  const initialParams = {
    fechaIni: range.ini,
    fechaFin: range.fin,
    conVentasEventos: false, // -> '1' incluye, '2' excluye
    conVentasEnLinea: false   // -> 'Y' incluye, 'N' excluye
  }

  async function handleSubmit(values) {
    try {
      setLoading(true)
      setRows([])

      const payload = {
        fechaIni: values.fechaIni,
        fechaFin: values.fechaFin,
        conVentasEventos: values.conVentasEventos ? '1' : '2',
        conVentasEnLinea: values.conVentasEnLinea ? 'Y' : 'N'
      }

      console.log('[VENTA DET NIVEL TIENDA] payload =>', payload)
      
      const data = await getVentaDetNivelTienda(payload);
    
      setRows(Array.isArray(data) ? data : [])
      setRange({ ini: values.fechaIni, fin: values.fechaFin })
    } catch (err) {
      sendNotification({
        type: 'ERROR',
        message: err?.response?.data?.message || err?.message || 'Error al cargar el reporte'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleSubmit(initialParams)
  }, [])

  // Agrupar por Región para mostrar secciones como en tus tablas
  const byRegion = useMemo(() => {
    const m = new Map()
    for (const r of rows) {
      const k = String(r.Region || 'SIN REGION')
      if (!m.has(k)) m.set(k, [])
      m.get(k).push(r)
    }
    // orden amigable
    const order = ['REGION I', 'REGION II', 'REGION III', 'WEB', 'SIN REGION', 'TOTAL']
    return Array.from(m.entries()).sort(
      (a, b) => order.indexOf(a[0]) - order.indexOf(b[0])
    )
  }, [rows])

  const title = `VENTA DETALLE NIVEL TIENDA (${dateHelper.getCurrentDate(range.fin)} ${dateHelper
    .getMonthName(range.fin)
    .toUpperCase()} ${dateHelper.getCurrentYear(range.fin)})`

  const handleExport = async () => {
    try {
      if (!rows.length) {
        sendNotification({ type: 'ERROR', message: 'No hay datos para exportar.' })
        return
      }
      const { Workbook } = await import('exceljs')
      const wb = new Workbook()
      const ws = wb.addWorksheet('VentaDetNivelTienda')

      ws.columns = [
        { header: 'Región', key: 'Region', width: 12 },
        { header: 'Tienda', key: 'Tienda', width: 22 },
        { header: 'Plaza', key: 'Plaza', width: 14 },
        { header: 'Venta ($)', key: 'Venta', width: 14, style: { numFmt: '$#,##0.00' } },
        { header: '% Venta', key: 'PartVenta', width: 10, style: { numFmt: '0.0%' } },
        { header: 'Línea ($)', key: 'VentaLinea', width: 12, style: { numFmt: '$#,##0.00' } },
        { header: '% Línea', key: 'PartVentaLinea', width: 10, style: { numFmt: '0.0%' } },
        { header: 'Moda ($)', key: 'VentaModa', width: 12, style: { numFmt: '$#,##0.00' } },
        { header: '% Moda', key: 'PartVentaModa', width: 10, style: { numFmt: '0.0%' } },
        { header: 'Accesorio ($)', key: 'VentaAccesorio', width: 14, style: { numFmt: '$#,##0.00' } },
        { header: '% Acc', key: 'PartVentaAcc', width: 10, style: { numFmt: '0.0%' } },
        { header: 'Frogs ($)', key: 'VentaFrogs', width: 12, style: { numFmt: '$#,##0.00' } },
        { header: '% Frogs', key: 'PartVentaFrogs', width: 10, style: { numFmt: '0.0%' } },
        { header: 'Mika ($)', key: 'VentaMika', width: 12, style: { numFmt: '$#,##0.00' } },
        { header: '% Mika', key: 'PartMika', width: 10, style: { numFmt: '0.0%' } }
      ]
      ws.addRows(rows)
      ws.getRow(1).font = { bold: true }

      const fn = `VentaDetNivelTienda_${range.ini}_a_${range.fin}.xlsx`
      const buf = await wb.xlsx.writeBuffer()
      const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fn
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      sendNotification({ type: 'ERROR', message: err?.message || 'No se pudo exportar.' })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <TitleReport title={title} />

      {/* Parámetros */}
      <section className="p-4">
        <ParametersContainer>
          <Parameters>
            <Formik initialValues={initialParams} onSubmit={handleSubmit} enableReinitialize>
              {({ isSubmitting }) => (
                <Form>
                  <fieldset className="space-y-2 mb-4">
                    <Input
                      type="date"
                      id="fechaIni"
                      name="fechaIni"
                      label="Fecha inicial"
                      placeholder={range.ini}
                      disabled={loading}
                    />
                    <Input
                      type="date"
                      id="fechaFin"
                      name="fechaFin"
                      label="Fecha final"
                      placeholder={range.fin}
                      disabled={loading}
                    />
                    <Checkbox
                      id="conVentasEventos"
                      name="conVentasEventos"
                      label="Incluir ventas de eventos"
                      disabled={loading}
                    />
                    <Checkbox
                      id="conVentasEnLinea"
                      name="conVentasEnLinea"
                      label="Incluir venta en línea"
                      disabled={loading}
                    />
                  </fieldset>

                  <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className={`w-full mt-2 px-4 py-2 rounded-md text-white ${
                      loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-500'
                    }`}
                  >
                    {loading ? 'Buscando…' : 'Buscar'}
                  </button>
                </Form>
              )}
            </Formik>
          </Parameters>
        </ParametersContainer>

        <div className="flex justify-between mt-2">
          <p className="text-sm font-bold">Resultados</p>
          <ExcelButton disabled={loading || rows.length === 0} handleClick={handleExport} />
        </div>
      </section>

      {/* Tabla */}
      <section className="p-4 overflow-x-auto">
        {loading && (
          <div className="rounded-xl border p-10 bg-white text-black flex items-center justify-center">
            Cargando datos…
          </div>
        )}

        {!loading && rows.length === 0 && (
          <div className="rounded-xl border p-10 bg-white text-gray-500 flex items-center justify-center">
            Sin datos para los filtros seleccionados.
          </div>
        )}

        {!loading && rows.length > 0 && (
          <div className="space-y-8">
            {byRegion.map(([region, list]) => (
              <div key={region}>
                <p className="text-sm font-bold mb-2">{region}</p>
                <table className="table-report" onClick={selectRow}>
                  <thead>
                    <tr className="text-center">
                      <th>Tienda</th>
                      <th>Plaza</th>
                      <th>Venta ($)</th>
                      <th>% Venta</th>
                      <th>Línea ($)</th>
                      <th>% Línea</th>
                      <th>Moda ($)</th>
                      <th>% Moda</th>
                      <th>Accesorio ($)</th>
                      <th>% Acc</th>
                      <th>Frogs ($)</th>
                      <th>% Frogs</th>
                      <th>Mika ($)</th>
                      <th>% Mika</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((r, i) => (
                      <tr key={`${region}-${r.Tienda}-${i}`}>
                        <td className="priority-cell text-left">{r.Tienda}</td>
                        <td>{r.Plaza ?? ''}</td>
                        <td className="priority-cell">{numberWithCommas(r.Venta)}</td>
                        <td>{fmtPct(r.PartVenta)}</td>

                        <td>{numberWithCommas(r.VentaLinea)}</td>
                        <td>{fmtPct(r.PartVentaLinea)}</td>

                        <td>{numberWithCommas(r.VentaModa)}</td>
                        <td>{fmtPct(r.PartVentaModa)}</td>

                        <td>{numberWithCommas(r.VentaAccesorio)}</td>
                        <td>{fmtPct(r.PartVentaAcc)}</td>

                        <td>{numberWithCommas(r.VentaFrogs)}</td>
                        <td>{fmtPct(r.PartVentaFrogs)}</td>

                        <td>{numberWithCommas(r.VentaMika)}</td>
                        <td>{fmtPct(r.PartMika)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

            {/* Mensaje general debajo de las tablas */}
            <div className="mt-3 mb-6">
              <p className="text-xs italic text-slate-600 text-center">
                Las ventas en línea son reportadas por fecha de pedido.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

const PageWithAuth = withAuth(VentaDetNivelTienda)
PageWithAuth.getLayout = getVentasLayout
export default PageWithAuth
