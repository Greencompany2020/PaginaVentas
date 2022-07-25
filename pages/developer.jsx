import React, {useEffect} from "react";
import exportExcel from "../utils/excel/exportExcel";
import semPlaza from '../utils/excel/templates/semPlaza';

export default function Developer() {

  const handleExport = () =>  {
    exportExcel('Ejemplo', template.columns, template.rows);
  }
    
  return(
    <div className="p-4  w-full ">
     <button type="button" className="border p-2 border-stone-300" onClick={handleExport}>Exportar</button>
    </div>
  );
}

