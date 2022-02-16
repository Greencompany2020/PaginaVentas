import { VentasSemanaSantaHead, VentasTable } from ".";
import ventasDiariasGrupo from "../../utils/data/ventasDiariasGrupo";

const PeriodosSemanaSantaTable = ({ year1, year2, title }) => {
  return (
    <>
      <h1 className="text-center font-bold">{title}</h1>
      <VentasTable className="my-7 ">
        <thead className="bg-black text-white text-center">
      <tr>
        <th className="border border-white">Año</th>
        <th className="border border-white">Carnaval</th>
        <th className="border border-white">Inicio</th>
        <th className="border border-white">Fin</th>
      </tr>
    </thead>
        <tbody className="bg-white text-center">
            <tr>
            <td className='border border-white'>2012</td>
            <td className='border border-white'>16-02-2012</td>
            <td className='border border-white'>02-04-2012</td>
            <td className='border border-white'>15-04-2012</td>
            </tr>
            <tr>
            <td className='border border-white'>2013</td>
            <td className='border border-white'>07-02-2013</td>
            <td className='border border-white'>25-03-2013</td>
            <td className='border border-white'>07-04-2013</td>
            </tr>
            <tr>
            <td className='border border-white'>2014</td>
            <td className='border border-white'>27-02-2014</td>
            <td className='border border-white'>14-04-2014</td>
            <td className='border border-white'>27-04-2014</td>
            </tr>
            <tr>
            <td className='border border-white'>2015</td>
            <td className='border border-white'>12-02-2015</td>
            <td className='border border-white'>30-03-2015</td>
            <td className='border border-white'>12-04-2015</td>
            </tr>
            <tr>
            <td className='border border-white'>2016</td>
            <td className='border border-white'>04-02-2016</td>
            <td className='border border-white'>21-03-2016</td>
            <td className='border border-white'>03-04-2016</td>
            </tr>
            <tr>
            <td className='border border-white'>2017</td>
            <td className='border border-white'>23-02-2017</td>
            <td className='border border-white'>10-04-2017</td>
            <td className='border border-white'>23-04-2017</td>
            </tr>
            <tr>
            <td className='border border-white'>2018</td>
            <td className='border border-white'>08-02-2018</td>
            <td className='border border-white'>26-03-2018</td>
            <td className='border border-white'>08-04-2018</td>
            </tr>
            <tr>
            <td className='border border-white'>2019</td>
            <td className='border border-white'>28-02-2019</td>
            <td className='border border-white'>15-04-2019</td>
            <td className='border border-white'>28-04-2019</td>
            </tr>
            <tr>
            <td className='border border-white'>2020</td>
            <td className='border border-white'>20-02-2020</td>
            <td className='border border-white'>06-04-2020</td>
            <td className='border border-white'>19-04-2020</td>
            </tr>
            <tr>
            <td className='border border-white'>2021</td>
            <td className='border border-white'>11-02-2021</td>
            <td className='border border-white'>29-03-2021</td>
            <td className='border border-white'>11-04-2021</td>
            </tr>
            <tr>
            <td className='border border-white'>2022</td>
            <td className='border border-white'>24-02-2022</td>
            <td className='border border-white'>11-04-2022</td>
            <td className='border border-white'>24-04-2022</td>
            </tr>
            <tr>
            <td className='border border-white'>2023</td>
            <td className='border border-white'>16-02-2023</td>
            <td className='border border-white'>03-04-2023</td>
            <td className='border border-white'>16-04-2023</td>
            </tr>
            <tr>
            <td className='border border-white'>2024</td>
            <td className='border border-white'>08-02-2024</td>
            <td className='border border-white'>25-03-2024</td>
            <td className='border border-white'>07-04-2024</td>
            </tr>
            <tr>
            <td className='border border-white'>2025</td>
            <td className='border border-white'>27-02-2025</td>
            <td className='border border-white'>14-04-2025</td>
            <td className='border border-white'>27-04-2025</td>
            </tr>
            <tr>
            <td className='border border-white'>2026</td>
            <td className='border border-white'>12-02-2026</td>
            <td className='border border-white'>30-03-2026</td>
            <td className='border border-white'>12-04-2026</td>
            </tr>
            <tr>
            <td className='border border-white'>2027</td>
            <td className='border border-white'>04-02-2027</td>
            <td className='border border-white'>22-03-2027</td>
            <td className='border border-white'>04-04-2027</td>
            </tr>

        </tbody>
      </VentasTable>
    </>
  );
};

export default PeriodosSemanaSantaTable;
