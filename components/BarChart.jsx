import { Chart as CharJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';

CharJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels, // https://chartjs-plugin-datalabels.netlify.app/
);

const BarChart = ({ text, data }) => {
  return (
    <Bar
      className='h-full'
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
        },
        plugins: {
          datalabels: {
            anchor: 'end',
            color: '#4b5563',
            align: 'top',
            font: {
              weight: 'bold'
            }
          }
        },
        maintainAspectRatio: false
      }}
      data={data}
    />
  )
}

export default BarChart
