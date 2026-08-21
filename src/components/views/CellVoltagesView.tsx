import React from 'react';
import { Grid3X3, Scale, Layers, TrendingUp, TrendingDown, Sliders } from 'lucide-react';
import { useBMS } from '../../context/BMSContext';
import { CellVoltagesGrid } from '../dashboard/CellVoltagesGrid';
import { ChartsSection } from '../dashboard/ChartsSection';

export const CellVoltagesView: React.FC = () => {
  const { telemetry, toggleBalancing } = useBMS();

  const avgV = (telemetry.cells.reduce((a, b) => a + b.voltage, 0) / telemetry.cells.length).toFixed(3);
  const deltaMv = ((telemetry.maxCellVoltage - telemetry.minCellVoltage) * 1000).toFixed(0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cyan-950/60">
        <div>
          <h2 className="font-tech text-xl sm:text-2xl font-bold tracking-wide text-slate-100 uppercase">
            20S Cell Voltages & Balancing Analytics
          </h2>
          <p className="text-xs text-slate-400">High-Resolution Cell-by-Cell Telemetry and Shunt Resistor Control</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleBalancing}
            className={`px-3 py-1.5 rounded-lg text-xs font-tech font-bold uppercase tracking-wider transition border ${
              telemetry.chargingLoad.cellBalancing === 'ON'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-500/40'
            }`}
          >
            {telemetry.chargingLoad.cellBalancing === 'ON' ? 'Balancing Active (ON)' : 'Enable Passive Balancing'}
          </button>
        </div>
      </div>

      {/* Primary 20S Grid */}
      <CellVoltagesGrid />

      {/* Voltage Delta Analysis & Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bms-card rounded-2xl p-5">
          <span className="font-tech text-xs text-slate-400 uppercase tracking-wider block">Pack Voltage Variance</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono-num text-3xl font-extrabold text-cyan-300">{deltaMv}</span>
            <span className="font-tech text-sm text-cyan-400">mV</span>
          </div>
          <p className="mt-2 text-xs text-slate-300">
            Acceptable threshold: &lt; 25 mV. Currently running in optimal tight balance.
          </p>
        </div>

        <div className="bms-card rounded-2xl p-5">
          <span className="font-tech text-xs text-slate-400 uppercase tracking-wider block">Average Cell Potential</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono-num text-3xl font-extrabold text-slate-100">{avgV}</span>
            <span className="font-tech text-sm text-cyan-400">V</span>
          </div>
          <p className="mt-2 text-xs text-slate-300">
            Calculated across all 20 series interconnected NMC cells.
          </p>
        </div>

        <div className="bms-card rounded-2xl p-5">
          <span className="font-tech text-xs text-slate-400 uppercase tracking-wider block">Bleed Shunt Resistors</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`font-mono-num text-3xl font-extrabold ${telemetry.chargingLoad.cellBalancing === 'ON' ? 'text-cyan-400' : 'text-slate-400'}`}>
              {telemetry.chargingLoad.cellBalancing}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-300">
            Passive bleed channels target cells with potential &ge; 4.077V (e.g. V15, V16).
          </p>
        </div>
      </div>
    </div>
  );
};
