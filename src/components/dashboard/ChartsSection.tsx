import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  Thermometer, 
  Zap, 
  Activity, 
  Layers,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { useBMS } from '../../context/BMSContext';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const ChartsSection: React.FC = () => {
  const { telemetry, history } = useBMS();
  const [activeChartTab, setActiveChartTab] = useState<'all' | 'voltage' | 'trends'>('all');

  // 1. Individual Cell Voltage Bar Chart Data
  const cellLabels = telemetry.cells.map(c => `V${c.id}`);
  const cellVoltages = telemetry.cells.map(c => c.voltage);
  
  // Custom bar colors: highlight V7 (min) in Amber and V15 (max) in Neon Cyan
  const barBackgroundColors = telemetry.cells.map(c => {
    if (c.id === telemetry.minCellNumber) return '#f59e0b'; // Amber for lowest
    if (c.id === telemetry.maxCellNumber) return '#06b6d4'; // Cyan for max
    return 'rgba(56, 189, 248, 0.65)'; // Electric blue for normal
  });

  const barBorderColors = telemetry.cells.map(c => {
    if (c.id === telemetry.minCellNumber) return '#fbbf24';
    if (c.id === telemetry.maxCellNumber) return '#22d3ee';
    return 'rgba(56, 189, 248, 1)';
  });

  const cellBarData = {
    labels: cellLabels,
    datasets: [
      {
        label: 'Cell Voltage (V)',
        data: cellVoltages,
        backgroundColor: barBackgroundColors,
        borderColor: barBorderColors,
        borderWidth: 1.5,
        borderRadius: 4,
        hoverBackgroundColor: '#38bdf8',
      },
    ],
  };

  const cellBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#38bdf8',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(56, 189, 248, 0.3)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context: any) => {
            const val = context.parsed.y;
            const cellId = context.dataIndex + 1;
            let tag = '';
            if (cellId === telemetry.minCellNumber) tag = ' (LOWEST)';
            if (cellId === telemetry.maxCellNumber) tag = ' (MAX)';
            return ` Voltage: ${val.toFixed(3)} V${tag}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(51, 65, 85, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 10,
            family: 'JetBrains Mono',
          },
        },
      },
      y: {
        min: 4.05,
        max: 4.09,
        grid: {
          color: 'rgba(51, 65, 85, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
          stepSize: 0.01,
          callback: (value: any) => `${value} V`,
          font: {
            size: 10,
            family: 'JetBrains Mono',
          },
        },
      },
    },
  };

  // 2. Temperature Sensor Chart Data
  const tempLabels = telemetry.temperatureSensors.map(s => `Sensor ${s.id}`);
  const tempValues = telemetry.temperatureSensors.map(s => s.temperature);

  const tempChartData = {
    labels: tempLabels,
    datasets: [
      {
        label: 'Sensor Temp (°C)',
        data: tempValues,
        backgroundColor: [
          'rgba(6, 182, 212, 0.7)',
          'rgba(6, 182, 212, 0.7)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderColor: [
          '#06b6d4',
          '#06b6d4',
          '#10b981',
          '#10b981',
        ],
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  const tempChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#10b981',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(16, 185, 129, 0.3)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context: any) => ` Temperature: ${context.parsed.y} °C`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.2)' },
        ticks: { color: '#94a3b8', font: { size: 10, family: 'JetBrains Mono' } },
      },
      y: {
        min: 20,
        max: 35,
        grid: { color: 'rgba(51, 65, 85, 0.2)' },
        ticks: {
          color: '#94a3b8',
          stepSize: 5,
          callback: (value: any) => `${value}°C`,
          font: { size: 10, family: 'JetBrains Mono' },
        },
      },
    },
  };

  // 3. Pack Voltage Real-Time Trend Chart Data
  const voltageTrendData = {
    labels: history.timestamps,
    datasets: [
      {
        label: 'Pack Voltage (V)',
        data: history.packVoltages,
        fill: true,
        backgroundColor: 'rgba(6, 182, 212, 0.12)',
        borderColor: '#06b6d4',
        borderWidth: 2,
        pointBackgroundColor: '#22d3ee',
        pointBorderColor: '#083344',
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.3,
      },
    ],
  };

  const voltageTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#06b6d4',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(6, 182, 212, 0.3)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context: any) => ` Pack Voltage: ${context.parsed.y.toFixed(2)} V`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.2)' },
        ticks: { color: '#94a3b8', font: { size: 9, family: 'JetBrains Mono' } },
      },
      y: {
        suggestedMin: 80.0,
        suggestedMax: 83.0,
        grid: { color: 'rgba(51, 65, 85, 0.2)' },
        ticks: {
          color: '#94a3b8',
          callback: (value: any) => `${value} V`,
          font: { size: 10, family: 'JetBrains Mono' },
        },
      },
    },
  };

  // 4. Current Real-Time Trend Chart Data
  const currentTrendData = {
    labels: history.timestamps,
    datasets: [
      {
        label: 'Current (A)',
        data: history.packCurrents,
        fill: true,
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        borderColor: '#10b981',
        borderWidth: 2,
        pointBackgroundColor: '#34d399',
        pointBorderColor: '#064e3b',
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.2,
      },
    ],
  };

  const currentTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#10b981',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(16, 185, 129, 0.3)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context: any) => ` Current: ${context.parsed.y.toFixed(1)} A`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.2)' },
        ticks: { color: '#94a3b8', font: { size: 9, family: 'JetBrains Mono' } },
      },
      y: {
        suggestedMin: -10,
        suggestedMax: 10,
        grid: { color: 'rgba(51, 65, 85, 0.2)' },
        ticks: {
          color: '#94a3b8',
          callback: (value: any) => `${value} A`,
          font: { size: 10, family: 'JetBrains Mono' },
        },
      },
    },
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-400" />
          <h3 className="font-tech text-sm sm:text-base font-bold uppercase tracking-wider text-slate-200">
            Real-Time Telemetry Analytics & Charts
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono-num text-slate-400">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            SAMPLING: 500 ms
          </span>
        </div>
      </div>

      {/* Grid of 4 Charts as required */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. Individual Cell Voltage Bar Chart */}
        <div className="bms-card rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-950/60">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-cyan-400" />
              <div>
                <h4 className="font-tech text-sm font-bold text-slate-100 uppercase">
                  Individual Cell Voltage Bar Chart
                </h4>
                <p className="text-[11px] text-slate-400 font-mono-num">V1 - V20 (4.071V to 4.079V)</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono-num">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-amber-400"></span> V7 Min
              </span>
              <span className="flex items-center gap-1 text-cyan-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-cyan-400"></span> V15 Max
              </span>
            </div>
          </div>
          <div className="h-64 w-full mt-4">
            <Bar data={cellBarData} options={cellBarOptions} />
          </div>
        </div>

        {/* 2. Temperature Sensor Chart */}
        <div className="bms-card rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-950/60">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-emerald-400" />
              <div>
                <h4 className="font-tech text-sm font-bold text-slate-100 uppercase">
                  Temperature Sensor Chart
                </h4>
                <p className="text-[11px] text-slate-400 font-mono-num">Sensors 1 to 4 (28°C - 29°C)</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-[10px] font-mono-num text-emerald-300 font-bold">
              SAFE THERMAL BAND
            </span>
          </div>
          <div className="h-64 w-full mt-4">
            <Bar data={tempChartData} options={tempChartOptions} />
          </div>
        </div>

        {/* 3. Pack Voltage Trend Chart */}
        <div className="bms-card rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-950/60">
            <div className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4 text-cyan-400" />
              <div>
                <h4 className="font-tech text-sm font-bold text-slate-100 uppercase">
                  Pack Voltage Trend Chart
                </h4>
                <p className="text-[11px] text-slate-400 font-mono-num">Real-Time Pack Potential ({telemetry.packVoltage} V)</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-mono-num text-cyan-300 font-bold">
              LIVE BUFFER
            </span>
          </div>
          <div className="h-64 w-full mt-4">
            <Line data={voltageTrendData} options={voltageTrendOptions} />
          </div>
        </div>

        {/* 4. Current Trend Chart */}
        <div className="bms-card rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-950/60">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              <div>
                <h4 className="font-tech text-sm font-bold text-slate-100 uppercase">
                  Current Trend Chart
                </h4>
                <p className="text-[11px] text-slate-400 font-mono-num">Bidirectional Current Flow ({telemetry.packCurrent} A)</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono-num text-slate-300">
              HALL SENSOR
            </span>
          </div>
          <div className="h-64 w-full mt-4">
            <Line data={currentTrendData} options={currentTrendOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};
