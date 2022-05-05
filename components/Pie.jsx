import { Chart as CharJS, CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Pie } from 'react-chartjs-2';


CharJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels
);

const PieChart = ({ text, data }) => {
  return (
    <Pie
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text
          },
          datalabels: {
            anchor: 'center',
            color: '#4b5563',
            align: 'top',
            font: {
              weight: 'bold'
            }
          }
        },
      }}
      data={data}
    />
  )
}

export default PieChart;
