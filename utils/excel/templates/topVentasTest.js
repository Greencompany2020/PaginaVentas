/**
 * Plantilla Excel Top Ventas – adaptada al front y a la vista
 * @param {Object} cfg
 * @param {string}  cfg.title
 * @param {Array}   cfg.rows
 * @param {boolean} cfg.useGlobalRanking
 * @param {boolean} cfg.includeSegment   // si true agrega la columna SEGMENTO
 */
export default function topVentasTestTemplate({ title, rows, useGlobalRanking, includeSegment }) {
  // Letras de columna A..Z (sobra)
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const L = (i) => (i < letters.length ? letters[i] : 'Z');

  // Columnas como en el front
  const headers = [
    { key: 'ranking',   label: '#',         width: 10, align: 'center' },
    ...(includeSegment ? [{ key: 'segment', label: 'SEGMENTO', width: 18, align: 'left' }] : []),
    { key: 'producto',  label: 'PRODUCTO',  width: 42, align: 'left' },
    { key: 'piezas',    label: 'PIEZAS',    width: 12, align: 'right' },
    { key: 'importe',   label: 'IMPORTE',   width: 16, align: 'right' },
  ];
  const lastCol = L(headers.length - 1);

  // ===== Encabezados (título + headers) =====
  const getColumns = () => {
    const cols = [
      // Título centrado y mergeado
      {
        cell: 'A1',
        value: title,
        merge: `A1:${lastCol}1`,
        styles: {
          font: { bold: true, size: 18 },
          alignment: { horizontal: 'center', vertical: 'middle' }
        }
      },
      // Subtítulo (barra verde)
      {
        cell: 'A3',
        value: 'TOP VENTAS',
        merge: `A3:${lastCol}3`,
        styles: {
          font: { bold: true, size: 14, color: { argb: 'FFFFFFFF' } },
          alignment: { horizontal: 'center', vertical: 'middle' },
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4CAF50' } }
        }
      },
    ];

    // Header negro con texto blanco y borde blanco
    headers.forEach((h, i) => {
      cols.push({
        cell: `${L(i)}4`,
        value: String(h.label).toUpperCase(),
        styles: headStyleBlack()
      });
    });

    return cols;
  };

  // ===== Filas (EN EL MISMO ORDEN QUE headers) =====
  const getRows = () => {
    const out = [];

    if (Array.isArray(rows) && rows.length) {
      rows.forEach((r) => {
        const row = {};
        headers.forEach((h) => {
          switch (h.key) {
            case 'ranking':
              row[h.key] = useGlobalRanking ? (r.RankingGlobal ?? '') : (r.RankingSegment ?? '');
              break;
            case 'segment':
              row[h.key] = r.Segment ?? '';
              break;
            case 'producto':
              row[h.key] = r.Modelo ?? '';
              break;
            case 'piezas':
              row[h.key] = r.ItemSales ?? 0;
              break;
            case 'importe':
              row[h.key] = r.AmountSales ?? 0;
              break;
            default:
              row[h.key] = '';
          }
        });
        out.push(row);
      });
    }

    // Fila en blanco final (opcional) respetando el orden de headers
    const empty = {};
    headers.forEach(h => { empty[h.key] = ''; });
    out.push(empty);

    return out;
  };

  // ===== Estilos/ajustes globales =====
  const style = {
    styles: {
      alignment: { vertical: 'middle' },
      border: { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} }
    },
    format: { number: '#,##0', decimal: '#,##0.00' },
    cols: Object.fromEntries(
      headers.map((h, i) => [
        L(i),
        { width: h.width, alignment: { horizontal: h.align } }
      ])
    ),
    freeze: { row: 4, col: 1 },
    autoFilter: { from: `A4`, to: `${lastCol}4` },
    rows: { 1: { height: 24 }, 3: { height: 20 }, 4: { height: 18 } }
  };

  return { getColumns, getRows, style };
}

// Header negro, texto blanco, bold, borde blanco
function headStyleBlack() {
  const white = { argb: 'FFFFFFFF' };
  return {
    font: { bold: true, color: white },
    alignment: { horizontal: 'center', vertical: 'middle' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } },
    border: {
      top:    { style: 'thin', color: white },
      left:   { style: 'thin', color: white },
      bottom: { style: 'thin', color: white },
      right:  { style: 'thin', color: white }
    }
  };
}
