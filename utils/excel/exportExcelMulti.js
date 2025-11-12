// utils/excel/exportExcelMulti.js
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

const toColLetter = (n) => {
  // 1 -> A, 2 -> B ... 26 -> Z (suficiente para este reporte)
  return String.fromCharCode(64 + n)
}

export default async function exportExcelMulti(fileName, sheets, footerNote, options = {}) {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'TopVentasTest'
  wb.created = new Date()

  for (const s of sheets) {
    const ws = wb.addWorksheet(s.name || 'Hoja')

    // 1) Encabezados (A1, merges, estilos)
    if (Array.isArray(s.columns)) {
      for (const c of s.columns) {
        if (!c || !c.cell) continue
        const cell = ws.getCell(c.cell)
        cell.value = c.value ?? ''
        if (c.styles) cell.style = c.styles
        if (c.merge) ws.mergeCells(c.merge)
      }
    }

    // 2) Estilos globales (anchos, alineación por columna, congelar, autofiltro, alturas)
    //    — Aplicamos por índice para que ExcelJS lo respete siempre.
    if (s.style?.cols) {
      const entries = Object.entries(s.style.cols)
        .map(([letter, conf]) => {
          const idx = (letter.toUpperCase().charCodeAt(0) - 64) // 'A' -> 1
          return [idx, conf]
        })
        .sort((a, b) => a[0] - b[0])

      entries.forEach(([idx, conf]) => {
        const col = ws.getColumn(idx)
        if (conf.width) col.width = conf.width
        if (conf.alignment) col.alignment = conf.alignment
      })
    }

    if (s.style?.rows) {
      Object.entries(s.style.rows).forEach(([rowNum, conf]) => {
        const row = ws.getRow(Number(rowNum))
        if (conf.height) row.height = conf.height
      })
    }
    if (s.style?.freeze) {
      ws.views = [{ state: 'frozen', xSplit: s.style.freeze.col || 0, ySplit: s.style.freeze.row || 0 }]
    }
    if (s.style?.autoFilter) {
      ws.autoFilter = { from: s.style.autoFilter.from, to: s.style.autoFilter.to }
    }

    // Asegurar centrado en filas de título/subtítulo (por si algún Excel los mueve)
    ws.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getRow(3).alignment = { horizontal: 'center', vertical: 'middle' }

    // 3) Filas de datos
    const startRow = 5
    const firstData = Array.isArray(s.rows) ? s.rows.find(r => r && Object.keys(r).length) : null
    const keysOrder = firstData ? Object.keys(firstData) : []
    const colCount = Math.max(keysOrder.length, 1)
    const lastColLetter = toColLetter(colCount)

    if (Array.isArray(s.rows)) {
      s.rows.forEach((r, idx) => {
        const excelRow = ws.getRow(startRow + idx)
        keysOrder.forEach((key, kIdx) => {
          const cell = excelRow.getCell(kIdx + 1)
          const val = r[key]
          cell.value = val
          if (typeof val === 'number') {
            cell.numFmt = key === 'importe' ? '#,##0.00' : '#,##0'
          }
        })
        excelRow.commit()
      })
    }

    // 4) Pie “Acerca del reporte” debajo de la tabla (si se pidió)
    if (footerNote) {
      const lastDataRow = startRow + (s.rows?.length || 0) + 1 // una fila en blanco extra
      const footCell = ws.getCell(`A${lastDataRow}`)
      footCell.value = footerNote
      footCell.style = {
        font: { italic: true, size: 10, color: { argb: 'FF666666' } },
        alignment: { horizontal: 'right', vertical: 'middle' }
      }
      ws.mergeCells(`A${lastDataRow}:${lastColLetter}${lastDataRow}`)
    }
  }

  const buf = await wb.xlsx.writeBuffer()
  saveAs(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${fileName}.xlsx`)
}
