import { Chart as CharJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement} from 'chart.js';
import { Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

CharJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels, // https://chartjs-plugin-datalabels.netlify.app/,
    PointElement,
    LineElement
)

const LineChart = ({ text, data }) => {
    return(
        <Line
            className='h-full w-full'
            options={{
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text
                    }
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

export default LineChart