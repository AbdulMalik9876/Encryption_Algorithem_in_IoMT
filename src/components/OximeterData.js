import React, { useEffect, useState } from 'react';
import { ref, onChildAdded } from 'firebase/database';
import { database } from '../firebase';
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
import { useChipId } from '../ChipIdContext';
import './styles/OximeterData.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function OximeterData() {
  const { chipId } = useChipId();
  const [decryptedData, setDecryptedData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [heartRateThreshold, setHeartRateThreshold] = useState('');
  const [spo2Threshold, setSpo2Threshold] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(15);

  useEffect(() => {
    console.log('Chip ID in OximeterData:', chipId);
    if (!chipId) {
      console.log('No chip ID available in context');
      return;
    }

    const decryptedRef = ref(database, `decrypted_data/${chipId}`);
    console.log('Listening to Firebase path:', `decrypted_data/${chipId}`);

    const unsubscribe = onChildAdded(decryptedRef, (snapshot) => {
      const data = snapshot.val();
      const timestamp = new Date(data.timestamp);

      setDecryptedData((prevData) => {
        const newEntry = {
          heartRate: data.value_name === 'heartRate' ? data.value : undefined,
          spo2: data.value_name === 'spo2' ? data.value : undefined,
          timestamp: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Only hours and minutes
          rawTimestamp: timestamp,
        };

        const existingIndex = prevData.findIndex(
          (entry) => Math.abs(entry.rawTimestamp - timestamp) < 60000 // 1-minute window
        );

        if (existingIndex !== -1) {
          const updatedData = [...prevData];
          updatedData[existingIndex] = {
            ...updatedData[existingIndex],
            heartRate: newEntry.heartRate !== undefined ? newEntry.heartRate : updatedData[existingIndex].heartRate,
            spo2: newEntry.spo2 !== undefined ? newEntry.spo2 : updatedData[existingIndex].spo2,
          };
          return updatedData;
        } else {
          return [...prevData, newEntry].sort((a, b) => b.rawTimestamp - a.rawTimestamp);
        }
      });
    }, (error) => {
      console.error('Firebase listener error:', error);
    });

    return () => unsubscribe();
  }, [chipId]);

  const filterData = () => {
    let filtered = decryptedData;

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      filtered = filtered.filter(
        (entry) => entry.rawTimestamp >= start && entry.rawTimestamp <= end
      );
    }

    if (heartRateThreshold || spo2Threshold) {
      filtered = filtered.filter((entry) => {
        const hrMatch = heartRateThreshold
          ? entry.heartRate !== undefined && entry.heartRate > parseFloat(heartRateThreshold)
          : true;
        const spo2Match = spo2Threshold
          ? entry.spo2 !== undefined && entry.spo2 > parseFloat(spo2Threshold)
          : true;
        return hrMatch || spo2Match;
      });
    }

    return filtered.slice(0, entriesPerPage).reverse(); // Show latest entries first
  };

  const filteredData = filterData();

  // Calculate max values with 20-unit buffer
  const maxHeartRate = Math.max(...filteredData.map((entry) => entry.heartRate ?? 0), 0) + 20 || 120; // Default to 120 if no data
  const maxSpo2 = Math.max(...filteredData.map((entry) => entry.spo2 ?? 0), 0) + 20 || 100; // Default to 100 if no data

  const heartRateChartData = {
    labels: filteredData.map((entry) => entry.timestamp),
    datasets: [
      {
        label: 'Heart Rate (BPM)',
        data: filteredData.map((entry) => (entry.heartRate !== undefined ? Math.max(0, entry.heartRate) : null)),
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        tension: 0.1,
        spanGaps: true,
      },
    ],
  };

  const spo2ChartData = {
    labels: filteredData.map((entry) => entry.timestamp),
    datasets: [
      {
        label: 'SpO2 (%)',
        data: filteredData.map((entry) => (entry.spo2 !== undefined ? Math.max(0, entry.spo2) : null)),
        borderColor: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.2)',
        tension: 0.1,
        spanGaps: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, color: 'aqua' },
    },
    scales: {
      y: {
        beginAtZero: true, // Start at 0 to prevent negative values
        min: 0,
        ticks: { color: 'white' },
      },
      x: {
        ticks: { color: 'white' },
      },
    },
  };

  const heartRateChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        max: maxHeartRate, // Dynamic max with 20-unit buffer
        title: { display: true, text: 'Heart Rate (BPM)', color: 'white' },
      },
    },
    plugins: {
      ...chartOptions.plugins,
      title: { ...chartOptions.plugins.title, text: 'Heart Rate' },
    },
  };

  const spo2ChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        max: maxSpo2, // Dynamic max with 20-unit buffer
        title: { display: true, text: 'SpO2 (%)', color: 'white' },
      },
    },
    plugins: {
      ...chartOptions.plugins,
      title: { ...chartOptions.plugins.title, text: 'SpO2' },
    },
  };

  return (
    <section className="oximeter-section">
      <div className="oximeter-container">
        <h2 className="oximeter-title">Decrypted Oximeter Data</h2>

        {decryptedData.length === 0 && !chipId ? (
          <p className="oximeter-text">
            No ESP32 is saved to show data. Go to profile and save your ESP32 Chip ID to see
            data.
          </p>
        ) : decryptedData.length === 0 ? (
          <p className="oximeter-text">No data available</p>
        ) : (
          <>
            <div className="oximeter-table-controls">
              <label>
                Show Entries:
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}
                  style={{
                    margin: '0 10px',
                    padding: '5px',
                    borderRadius: '4px',
                    border: '1px solid aqua',
                    backgroundColor: '#16304a',
                    color: '#ddd',
                  }}
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </label>
            </div>
            <div className="oximeter-table-wrapper">
              <table className="oximeter-table">
                <thead>
                  <tr>
                    <th>Heart Rate (BPM)</th>
                    <th>SpO2 (%)</th>
                    <th>Time</th> {/* Changed to Time to reflect hours:minutes */}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((entry, index) => (
                    <tr key={index} className="oximeter-table-row">
                      <td>{entry.heartRate !== undefined ? entry.heartRate.toFixed(1) : 'N/A'}</td>
                      <td>{entry.spo2 !== undefined ? entry.spo2.toFixed(1) : 'N/A'}</td>
                      <td>{entry.timestamp}</td> {/* Already formatted as hours:minutes */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="oximeter-threshold-filter">
          <label>
            Heart Rate Threshold (BPM):
            <input
              type="number"
              value={heartRateThreshold}
              onChange={(e) => setHeartRateThreshold(e.target.value)}
              placeholder="e.g., 100"
              style={{
                margin: '0 10px',
                padding: '5px',
                borderRadius: '4px',
                border: '1px solid aqua',
                backgroundColor: '#16304a',
                color: '#ddd',
              }}
            />
          </label>
          <label>
            SpO2 Threshold (%):
            <input
              type="number"
              value={spo2Threshold}
              onChange={(e) => setSpo2Threshold(e.target.value)}
              placeholder="e.g., 95"
              style={{
                margin: '0 10px',
                padding: '5px',
                borderRadius: '4px',
                border: '1px solid aqua',
                backgroundColor: '#16304a',
                color: '#ddd',
              }}
            />
          </label>
          <button
            onClick={filterData}
            style={{
              padding: '5px 10px',
              borderRadius: '4px',
              border: '1px solid aqua',
              backgroundColor: '#3498db',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Apply Thresholds
          </button>
        </div>

        <div className="oximeter-date-filter">
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                margin: '0 10px',
                padding: '5px',
                borderRadius: '4px',
                border: '1px solid aqua',
                backgroundColor: '#16304a',
                color: '#ddd',
              }}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                margin: '0 10px',
                padding: '5px',
                borderRadius: '4px',
                border: '1px solid aqua',
                backgroundColor: '#16304a',
                color: '#ddd',
              }}
            />
          </label>
          <button
            onChange={filterData}
            style={{
              padding: '5px 10px',
              borderRadius: '4px',
              border: '1px solid aqua',
              backgroundColor: '#3498db',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Filter
          </button>
        </div>

        {decryptedData.length > 0 && (
          <div className="oximeter-charts-container">
            <div className="oximeter-chart">
              <Line data={heartRateChartData} options={heartRateChartOptions} />
            </div>
            <div className="oximeter-chart">
              <Line data={spo2ChartData} options={spo2ChartOptions} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default OximeterData;