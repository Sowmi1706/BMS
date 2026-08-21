import React, { useState } from 'react';
import { 
  Grid3X3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Layers, 
  CheckCircle2, 
  Info,
  Sliders,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { useBMS } from '../../context/BMSContext';
import { CellData } from '../../types/bms';

export const CellVoltagesGrid: React.FC = () => {
  const { telemetry, selectedCellId, setSelectedCellId } = useBMS();
  const [filterMode, setFilterMode] = useState<'all' | 'extrema' | 'high' | 'low'>('all');

  // Calculate cell voltage stats
  const voltages = telemetry.cells.map(c => c.voltage);
  const avgVoltage = voltages.reduce((a, b) => a + b, 0) / voltages.length;
  const deltaVoltageMv = ((telemetry.maxCellVoltage - telemetry.minCellVoltage) * 1000).toFixed(0);

  // Filter cells based on user filter
  const displayedCells = telemetry.cells.filter(cell => {
    if (filterMode === 'extrema') {
      return cell.id === telemetry.minCellNumber || cell.id === telemetry.maxCellNumber || cell.id === 16;
    }
    if (filterMode === 'high') {
      return cell.voltage >= 4.075;
    }
    if (filterMode === 'low') {
      return cell.voltage <= 4.073;
    }
    return true;
  });

  return (
    <div className="bms-card rounded-2xl p-5 lg:p-6">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cyan-950/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <Grid3X3 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-tech text-base sm:text-lg font-bold tracking-wide text-slate-100 uppercase">
              Individual Cell Voltage Section (20S Pack)
            </h3>
            <p className="text-xs text-slate-400">High-Precision ADC Telemetry (16-bit Delta-Sigma Channels)</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Metrics Badges */}
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono-num text-slate-300">
            AVG: <strong className="text-cyan-300">{avgVoltage.toFixed(3)} V</strong>
          </span>

          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-mono-num text-cyan-300">
            ΔV: <strong className="text-cyan-200">{deltaVoltageMv} mV</strong>
          </span>

          {/* Filter Pills */}
          <div className="flex items-center rounded-lg bg-slate-900/80 p-1 border border-slate-800 text-xs font-tech">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-0.5 rounded transition ${
                filterMode === 'all' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All (20)
            </button>
            <button
              onClick={() => setFilterMode('extrema')}
              className={`px-2 py-0.5 rounded transition ${
                filterMode === 'extrema' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Extrema (Min/Max)
            </button>
          </div>
        </div>
      </div>

      {/* Legend and Highlights Banner */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-900/50 p-3 border border-slate-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]"></span>
            <span className="text-slate-300 font-mono-num">
              <strong>V7 (4.071 V)</strong> - Lowest Cell
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]"></span>
            <span className="text-slate-300 font-mono-num">
              <strong>V15 (4.079 V)</strong> - Max Configured Cell
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-slate-400">Optimal (4.070V - 4.080V)</span>
          </div>
        </div>
        <div className="text-slate-400 text-[11px] font-mono-num">
          Cell Operating Range: 3.000 V - 4.200 V
        </div>
      </div>

      {/* 20S Cell Responsive Grid */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-10 gap-2.5">
        {displayedCells.map(cell => {
          const isLowest = cell.id === telemetry.minCellNumber; // V7
          const isHighest = cell.id === telemetry.maxCellNumber; // V15
          const isSelected = selectedCellId === cell.id;

          // Voltage percentage in standard Li-ion cell range (3.0V = 0%, 4.2V = 100%)
          const cellFillPercent = Math.min(100, Math.max(0, ((cell.voltage - 3.0) / (4.2 - 3.0)) * 100));

          return (
            <div
              key={cell.id}
              onClick={() => setSelectedCellId(isSelected ? null : cell.id)}
              className={`group relative cursor-pointer rounded-xl p-3 transition-all duration-200 flex flex-col justify-between ${
                isLowest
                  ? 'bg-amber-950/40 border-2 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/40'
                  : isHighest
                  ? 'bg-cyan-950/40 border-2 border-cyan-400/90 shadow-[0_0_20px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400/40'
                  : isSelected
                  ? 'bg-blue-950/70 border-2 border-cyan-400 shadow-lg'
                  : 'bg-slate-900/80 border border-slate-800/90 hover:border-cyan-500/40 hover:bg-slate-800/60'
              }`}
            >
              {/* Highlight Badges */}
              {isLowest && (
                <div className="absolute -top-2 left-2 rounded bg-amber-500 px-1.5 py-0.2 text-[9px] font-tech font-black uppercase text-slate-950 shadow">
                  LOWEST
                </div>
              )}
              {isHighest && (
                <div className="absolute -top-2 right-2 rounded bg-cyan-400 px-1.5 py-0.2 text-[9px] font-tech font-black uppercase text-slate-950 shadow">
                  MAX VOLTAGE
                </div>
              )}

              {/* Cell Label & Shunt */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-tech text-xs font-bold tracking-wider text-slate-300">
                  V{cell.id}
                </span>
                {cell.isBalancing && (
                  <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" title="Balancing Shunt Active" />
                )}
                {isLowest ? (
                  <TrendingDown className="h-3.5 w-3.5 text-amber-400" />
                ) : isHighest ? (
                  <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
                ) : null}
              </div>

              {/* Exact Voltage Display */}
              <div className="my-2 text-center">
                <div className="flex items-baseline justify-center gap-0.5">
                  <span
                    className={`font-mono-num text-lg sm:text-xl font-extrabold ${
                      isLowest
                        ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                        : isHighest
                        ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                        : 'text-slate-100'
                    }`}
                  >
                    {cell.voltage.toFixed(3)}
                  </span>
                  <span className="font-tech text-[10px] font-bold text-slate-400">V</span>
                </div>
                <div className="text-[9px] font-mono-num text-slate-400">
                  Δ: {((cell.voltage - avgVoltage) * 1000 > 0 ? '+' : '') + ((cell.voltage - avgVoltage) * 1000).toFixed(1)} mV
                </div>
              </div>

              {/* Micro Voltage Fill Bar */}
              <div className="w-full">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLowest
                        ? 'bg-amber-400'
                        : isHighest
                        ? 'bg-cyan-400'
                        : 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                    }`}
                    style={{ width: `${cellFillPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Cell Detailed Diagnostic Drawer/Card */}
      {selectedCellId && (
        <div className="mt-5 rounded-xl border border-cyan-500/40 bg-slate-950/80 p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <h4 className="font-tech text-sm font-bold text-slate-100 uppercase">
                Detailed Diagnostic: Cell #{selectedCellId} (V{selectedCellId})
              </h4>
            </div>
            <button
              onClick={() => setSelectedCellId(null)}
              className="text-xs text-slate-400 hover:text-slate-200 font-mono underline"
            >
              Close Inspector
            </button>
          </div>

          {(() => {
            const cell = telemetry.cells.find(c => c.id === selectedCellId);
            if (!cell) return null;
            return (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">MEASURED VOLTAGE</span>
                  <span className="font-mono-num text-base font-bold text-cyan-300">{cell.voltage.toFixed(3)} V</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">INTERNAL RESISTANCE (AC-IR)</span>
                  <span className="font-mono-num text-base font-bold text-slate-200">{cell.internalResistanceMilliOhm ?? 1.21} mΩ</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">DEVIATION FROM PACK MEAN</span>
                  <span className="font-mono-num text-base font-bold text-emerald-400">
                    {((cell.voltage - avgVoltage) * 1000).toFixed(1)} mV
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">BALANCING CIRCUIT</span>
                  <span className="font-mono-num text-base font-bold text-slate-300">
                    {cell.isBalancing ? 'DISCHARGING (100mA)' : 'PASSIVE STANDBY'}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
