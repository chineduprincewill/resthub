import React, { useState, useMemo, useEffect, useContext } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { fetchOrgAddSampleRecords } from '../../utils/resthubfunction';
import { AppContext } from '../../context/AppContext';
import SkeletonComponent from '../../components/skeleton-component';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Sample JSON data - replace with your own
const sampleData = [
  { month: 'Jan', sales: 50, profit: 20, expenses: 30 },
  { month: 'Feb', sales: 60, profit: 25, expenses: 35 },
  { month: 'Mar', sales: 70, profit: 30, expenses: 40 },
  { month: 'Apr', sales: 80, profit: 35, expenses: 45 },
  { month: 'May', sales: 90, profit: 40, expenses: 50 },
  { month: 'Jun', sales: 100, profit: 45, expenses: 55 },
];

const Analytics = () => {

    const { token } = useContext(AppContext)
    const [selectedKeyX, setSelectedKeyX] = useState('');
    const [selectedKeyY, setSelectedKeyY] = useState('');
    const [chartType, setChartType] = useState('bar');
    const [data, setData] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState();

    // Extract keys from the first data object
    const keys = useMemo(() => {
        if (!data || data.length === 0) return [];
        return Object.keys(data[0]);
    }, [data]);

    // Prepare chart data based on selected keys and chart type
    const chartData = useMemo(() => {
        if (!selectedKeyX || !selectedKeyY || !data.length) return null;

        const labels = data.map((item) => item[selectedKeyX]);
        const values = data.map((item) => item[selectedKeyY]);

        // For pie chart, we typically need a single dataset with values
        // and labels should be category names
        if (chartType === 'pie') {
        return {
            labels: labels,
            datasets: [
            {
                label: `${selectedKeyY} by ${selectedKeyX}`,
                data: values,
                backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(199, 199, 199, 0.6)',
                'rgba(83, 102, 255, 0.6)',
                'rgba(255, 99, 255, 0.6)',
                'rgba(99, 255, 132, 0.6)',
                ],
                borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(199, 199, 199, 1)',
                'rgba(83, 102, 255, 1)',
                'rgba(255, 99, 255, 1)',
                'rgba(99, 255, 132, 1)',
                ],
                borderWidth: 1,
            },
            ],
        };
        }

        // For bar and line charts
        return {
        labels,
        datasets: [
            {
            label: selectedKeyY,
            data: values,
            backgroundColor:
                chartType === 'bar'
                ? 'rgba(54, 162, 235, 0.6)'
                : 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            fill: chartType === 'line',
            tension: 0.3,
            },
        ],
        };
    }, [selectedKeyX, selectedKeyY, chartType, data]);

    // Chart options
    const options = useMemo(() => {
        const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
            position: 'top',
            },
            title: {
            display: true,
            text:
                selectedKeyX && selectedKeyY
                ? `${selectedKeyY} by ${selectedKeyX} (${chartType} chart)`
                : 'Select keys to generate a chart',
            },
        },
        };

        if (chartType === 'bar' || chartType === 'line') {
        return {
            ...baseOptions,
            scales: {
            y: {
                beginAtZero: true,
            },
            },
        };
        }

        return baseOptions;
    }, [chartType, selectedKeyX, selectedKeyY]);

    // Render appropriate chart component
    const renderChart = () => {
        if (!chartData) {
        return (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Please select both X and Y keys to generate a chart
            </div>
        );
        }

        switch (chartType) {
        case 'bar':
            return <Bar data={chartData} options={options} />;
        case 'line':
            return <Line data={chartData} options={options} />;
        case 'pie':
            return <Pie data={chartData} options={options} />;
        default:
            return null;
        }
    };

    // Styles
    const styles = {
        container: {
        fontFamily: 'Arial, sans-serif',
        margin: '0 auto',
        padding: '20px',
        },
        controls: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '10px',
        padding: '15px 0px',
        borderRadius: '8px',
        },
        selectGroup: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '150px',
        },
        label: {
        marginBottom: '5px',
        fontWeight: 'bold',
        fontSize: '14px',
        },
        select: {
        padding: '8px',
        fontSize: '14px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        },
        radioGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        justifyContent: 'center',
        },
        radioLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        },
        chartContainer: {
        height: '400px',
        padding: '15px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
    };

    useEffect(() => {
        fetchOrgAddSampleRecords(token, setData, setError, setIsLoading)
    }, [])

    return (
        <div style={styles.container}>
            <div style={styles.controls}>
                <div style={styles.selectGroup}>
                <label style={styles.label} htmlFor="x-key">
                    X-Axis:
                </label>
                <select
                    id="x-key"
                    style={styles.select}
                    value={selectedKeyX}
                    onChange={(e) => setSelectedKeyX(e.target.value)}
                    className='!bg-background'
                >
                    <option value="">-- Select --</option>
                    {keys.map((key) => (
                    <option key={key} value={key}>
                        {key}
                    </option>
                    ))}
                </select>
                </div>

                <div style={styles.selectGroup}>
                <label style={styles.label} htmlFor="y-key">
                    Y-Axis:
                </label>
                <select
                    id="y-key"
                    style={styles.select}
                    value={selectedKeyY}
                    onChange={(e) => setSelectedKeyY(e.target.value)}
                    className='!bg-background'
                >
                    <option value="">-- Select --</option>
                    {keys.map((key) => (
                    <option key={key} value={key}>
                        {key}
                    </option>
                    ))}
                </select>
                </div>

                <div style={styles.radioGroup}>
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                    Chart:
                </span>
                <div className='!flex !items-center !gap-4'>
                    <label style={styles.radioLabel}>
                        <input
                        type="radio"
                        name="chartType"
                        value="bar"
                        checked={chartType === 'bar'}
                        onChange={(e) => setChartType(e.target.value)}
                        />
                        Bar
                    </label>
                    <label style={styles.radioLabel}>
                        <input
                        type="radio"
                        name="chartType"
                        value="line"
                        checked={chartType === 'line'}
                        onChange={(e) => setChartType(e.target.value)}
                        />
                        Line
                    </label>
                    <label style={styles.radioLabel}>
                        <input
                        type="radio"
                        name="chartType"
                        value="pie"
                        checked={chartType === 'pie'}
                        onChange={(e) => setChartType(e.target.value)}
                        />
                        Pie
                    </label>
                </div>
                </div>
            </div>
        {
            isLoading ? <SkeletonComponent /> :
            <div style={styles.chartContainer}>{renderChart()}</div>
        }
        </div>
    );
};

export default Analytics;