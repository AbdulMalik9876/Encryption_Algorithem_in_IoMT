import './styles/Metrics.css';
import { Line } from 'react-chartjs-2';
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Metrics() {
  // Left Chart Data (Power Consumption vs Data Size)
  const powerChartData = {
    labels: ['1KB', '10KB', '20KB', '50KB', '100KB'],
    datasets: [
      {
        label: 'Power Consumption (mAh)',
        data: [110, 140, 180, 250, 380], // From previous performance chart
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: false,
      },
    ],
  };

  // Left Chart Options (Power Consumption)
  const powerChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 0,
        bottom: 0,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 500,
        title: {
          display: true,
          text: 'Power (mAh)',
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Data Size',
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          boxWidth: 20,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' mAh';
            }
            return label;
          },
        },
      },
    },
  };

  // Right Chart Data (Encryption Time vs Decryption Time vs Data Size)
  const performanceChartData = {
    labels: ['1KB', '10KB', '20KB', '50KB', '100KB'],
    datasets: [
      {
        label: 'Encryption Time (ms)',
        data: [1.2, 10, 20, 50, 100], // From previous performance chart
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        yAxisID: 'y',
      },
      {
        label: 'Decryption Time (ms)',
        data: [1.5, 12, 24, 60, 120], // From previous performance chart
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        yAxisID: 'y',
      },
    ],
  };

  // Right Chart Options (Encryption/Decryption Time)
  const performanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 0,
        bottom: 0,
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 0,
        max: 150,
        title: {
          display: true,
          text: 'Time (ms)',
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Data Size',
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          boxWidth: 20,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' ms';
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <section className="metrics-section">
      <div className="metrics-container">
        <h2 className="metrics-title">Performance Metrics</h2>
        <div className="metrics-charts-row">
          <div className="metrics-chart">
            <h3 className="metrics-subtitle">Power Consumption vs Data Size</h3>
            <div className="metrics-chart-wrapper">
              <Line data={powerChartData} options={powerChartOptions} />
            </div>
          </div>
          <div className="metrics-chart">
            <h3 className="metrics-subtitle">Encryption Time vs Decryption Time</h3>
            <div className="metrics-chart-wrapper">
              <Line data={performanceChartData} options={performanceChartOptions} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Metrics;