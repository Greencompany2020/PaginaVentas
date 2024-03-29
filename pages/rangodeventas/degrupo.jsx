import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  Parameters,
  ParametersContainer,
} from "../../components/containers";
import {
  InputContainer,
  SelectTiendasGeneral,
} from "../../components/inputs";
import ComparativoVentas from "../../components/table/ComparativoVentas";
import PieChart from "../../components/Pie";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";

const degrupo = () => {
  return <h1>En construccion</h1>
  /*return (

    <div className=" flex flex-col h-full">
      <TitleReport title="Rangos de ventas de grupo" />
      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <h1>Obtener Rangos de Ventas de las fechas:</h1>
              <InputDateDate />
              <SelectTiendasGeneral />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="p-4 overflow-y-auto ">
        <ComparativoVentas>
          <PieChart
            text="Rangos de ventas de grupo"
            data={{
              labels: [
                "Hasta 100",
                "Hasta 200",
                "Hasta 300",
                "Hasta 400",
                "Hasta 500",
                "Hasta 600",
                "Mayor a 600",
              ],
              datasets: [
                {
                  label: "# of Votes",
                  data: [898, 2308, 4001, 3006, 2798, 2572, 17259],
                  backgroundColor: [
                    "rgba(255, 100, 94, 1)",
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                  ],
                  borderColor: [
                    "rgba(255, 100, 94, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            }}
          />
        </ComparativoVentas>
      </section>
    </div>

  );*/
};

const DeGrupoWithAuth = withAuth(degrupo);
DeGrupoWithAuth.getLayout = getVentasLayout;
export default DeGrupoWithAuth;
