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
                    datalabels: {
                        display: false,
                        anchor: 'end',
                        color: '#4b5563',
                        align: 'top',
                        font: {
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text
                    }
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return `${data.labels[tooltipItem.datasetIndex]} - ${numeral(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]).format('0,0')}`;
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
