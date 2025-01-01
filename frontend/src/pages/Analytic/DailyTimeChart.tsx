import React from 'react';
import { Line } from 'react-chartjs-2';
import { DailyTimeResponse } from './analyticsService';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { colors } from '@/styles';
import { faChartLine, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface DailyTimeChartProps {
    dailyTime: DailyTimeResponse;
}

const DailyTimeChart: React.FC<DailyTimeChartProps> = ({ dailyTime }) => {
    const data = {
        labels: Object.keys(dailyTime),
        datasets: [
            {
                label: 'Daily Time Spent (minutes)',
                data: Object.values(dailyTime),
                fill: false,
                borderColor: 'blue',
                tension: 0.1,
            },
        ],
    };

    return (
        <div style={{
            padding: '20px',
            width: '100%',
            margin: '0 auto',
            textAlign: 'left',
        }}>
            <div style={{ color: colors.tertiary }}>
                <FontAwesomeIcon icon={faChartLine} size="2xl" style={{ marginRight: '10px' }} />
                <span style={{ fontSize: '24px', fontWeight: '500' }}>Daily Time Spent</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '35px' }}>
                <Line data={data}
                    height={500}
                    options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
        </div>
    );
};

export default DailyTimeChart;
