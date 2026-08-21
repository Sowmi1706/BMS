import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ThermometerSun, 
  ThermometerSnowflake, 
  Cpu, 
  Scale, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useBMS } from '../../context/BMSContext';

export const BatteryStatusCards: React.FC = () => {
  const { telemetry, setSelectedCellId } = useBMS();

  // Compute cell delta V and delta T
  const deltaVoltageMv = ((telemetry.maxCellVoltage - telemetry.minCellVoltage) * 1000).toFixed(0);
  const deltaTemp = (telemetry.maxTemperature - telemetry.minTemperature).toFixed(1);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-cyan-400" />
          <h3 className="font-tech text-sm sm:text-base font-bold uppercase tracking-wider text-slate-200">
            Battery Cell & Thermal Extrema
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono-num">
          <span className="rounded bg-cyan-950/70 px-2 py-0.5 border border-cyan-800/40 text-cyan-300">
            ΔV: <strong className="text-cyan-200">{deltaVoltageMv} mV</strong>
          </span>
          <span className="rounded bg-emerald-950/70 px-2 py-0.5 border border-emerald-800/40 text-emerald-300">
            ΔT: <strong className="text-emerald-200">{deltaTemp} °C</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {/* 1. Maximum Cell Voltage & Cell Number */}
        <div 
          onClick={() => setSelectedCellId(telemetry.maxCellNumber)}
          className="bms-card cursor-pointer group relative overflow-hidden rounded-xl p-4 transition-all hover:scale-[1.01] hover:border-cyan-500/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-tech font-semibold uppercase tracking-wider text-slate-400">
              Maximum Cell Voltage
            </span>
            <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="font-mono-num text-2xl sm:text-3xl font-extrabold text-cyan-300 drop-shadow">
                {telemetry.maxCellVoltage.toFixed(3)}
              </span>
              <span className="font-tech text-sm font-bold text-cyan-400">V</span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-tech text-slate-400 uppercase">Max Cell Number</span>
              <span className="font-mono-num text-sm font-bold text-slate-100 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40">
                Cell #{telemetry.maxCellNumber}
              </span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono-num pt-2 border-t border-slate-800/80 text-slate-400">
            <span>Status: <strong className="text-cyan-400">Upper Threshold</strong></span>
            <span className="text-[10px] text-slate-500">Config Max Cell</span>
          </div>
        </div>

        {/* 2. Minimum Cell Voltage & Cell Number */}
        <div 
          onClick={() => setSelectedCellId(telemetry.minCellNumber)}
          className="bms-card cursor-pointer group relative overflow-hidden rounded-xl p-4 transition-all hover:scale-[1.01] hover:border-amber-500/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-tech font-semibold uppercase tracking-wider text-slate-400">
              Minimum Cell Voltage
            </span>
            <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 group-hover:scale-110 transition-transform">
              <TrendingDown className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="font-mono-num text-2xl sm:text-3xl font-extrabold text-amber-300 drop-shadow">
                {telemetry.minCellVoltage.toFixed(3)}
              </span>
              <span className="font-tech text-sm font-bold text-amber-400">V</span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-tech text-slate-400 uppercase">Min Cell Number</span>
              <span className="font-mono-num text-sm font-bold text-slate-100 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40">
                Cell #{telemetry.minCellNumber}
              </span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono-num pt-2 border-t border-slate-800/80 text-slate-400">
            <span>Status: <strong className="text-amber-400">Lowest Voltage</strong></span>
            <span className="text-[10px] text-slate-500">Normal Range</span>
          </div>
        </div>

        {/* 3. Maximum Temperature & Max Temp Sensor */}
        <div className="bms-card group relative overflow-hidden rounded-xl p-4 transition-all hover:scale-[1.01] hover:border-emerald-500/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-tech font-semibold uppercase tracking-wider text-slate-400">
              Maximum Temperature
            </span>
            <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 group-hover:scale-110 transition-transform">
              <ThermometerSun className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="font-mono-num text-2xl sm:text-3xl font-extrabold text-emerald-300 drop-shadow">
                {telemetry.maxTemperature}
              </span>
              <span className="font-tech text-sm font-bold text-emerald-400">°C</span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-tech text-slate-400 uppercase">Max Temp Sensor</span>
              <span className="font-mono-num text-sm font-bold text-slate-100 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40">
                Sensor #{telemetry.maxTemperatureSensor}
              </span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono-num pt-2 border-t border-slate-800/80 text-slate-400">
            <span>Thermal Zone: <strong className="text-emerald-400">Pack Core Center</strong></span>
            <span className="text-[10px] text-emerald-400">Optimal (≤45°C)</span>
          </div>
        </div>

        {/* 4. Minimum Temperature & Min Temp Sensor */}
        <div className="bms-card group relative overflow-hidden rounded-xl p-4 transition-all hover:scale-[1.01] hover:border-cyan-500/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-tech font-semibold uppercase tracking-wider text-slate-400">
              Minimum Temperature
            </span>
            <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 group-hover:scale-110 transition-transform">
              <ThermometerSnowflake className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="font-mono-num text-2xl sm:text-3xl font-extrabold text-cyan-300 drop-shadow">
                {telemetry.minTemperature}
              </span>
              <span className="font-tech text-sm font-bold text-cyan-400">°C</span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-tech text-slate-400 uppercase">Min Temp Sensor</span>
              <span className="font-mono-num text-sm font-bold text-slate-100 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40">
                Sensor #{telemetry.minTemperatureSensor}
              </span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono-num pt-2 border-t border-slate-800/80 text-slate-400">
            <span>Thermal Zone: <strong className="text-cyan-400">Pack Front-Left</strong></span>
            <span className="text-[10px] text-cyan-400">Safe Cold Level (≥0°C)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
