import React, {useEffect} from "react";
import example from '../utils/excel/templates/example.json';
import exportExcel from "../utils/excel/exportExcel";
import semTienda  from "../utils/excel/templates/semtTienda";

export default function Developer() {
  const handleExport = () => {
    const template = semTienda();
    exportExcel('temporada',template.columns, example,'',template.format);
  }
  return(
    <div className="p-4  w-full ">
     <button type="button" className="border p-2 border-stone-300" onClick={handleExport}>Exportar</button>
    </div>
  );
}

