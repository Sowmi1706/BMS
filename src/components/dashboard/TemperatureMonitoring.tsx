import React from 'react';
import { 
  Thermometer, 
  ThermometerSun, 
  ThermometerSnowflake, 
  Wind, 
  Flame, 
  Cpu, 
  ShieldCheck,
  Radio
} from 'lucide-react';
import { useBMS } from '../../context/BMSContext';

export const TemperatureMonitoring: React.FC = () => {
  const { telemetry } = useBMS();

  return (
    <div className="bms-card rounded-2xl p-5 lg:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cyan-950/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <Thermometer className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-tech text-base sm:text-lg font-bold tracking-wide text-slate-100 uppercase">
              Temperature Monitoring (4 Sensors)
            </h3>
            <p className="text-xs text-slate-400">Multi-Zone NTC Thermistor Pack Thermal Array</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-mono-num text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            THERMAL STATUS: <strong>OPTIMAL (≤45°C)</strong>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono-num text-slate-300">
            <Wind className="h-3.5 w-3.5 text-cyan-400" />
            COOLING FAN: <strong className="text-cyan-300">STANDBY</strong>
          </span>
        </div>
      </div>

      {/* 4 Temperature Sensor Cards */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {telemetry.temperatureSensors.map(sensor => {
          const isMax = sensor.id === telemetry.maxTemperatureSensor;
          const isMin = sensor.id === telemetry.minTemperatureSensor;

          // Temperature scale percentage (0°C to 60°C max scale)
          const tempPercent = Math.min(100, Math.max(0, (sensor.temperature / 60) * 100));

          return (
            <div
              key={sensor.id}
              className={`rounded-xl p-4 flex flex-col justify-between space-y-3 transition-all ${
                isMax
                  ? 'bg-emerald-950/30 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'bg-slate-900/80 border border-cyan-950/80 hover:border-cyan-500/30'
              }`}
            >
              {/* Sensor Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-cyan-400">
                    <Thermometer className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-tech text-xs font-bold uppercase tracking-wider text-slate-200">
                      Sensor {sensor.id}
                    </h4>
                    <span className="text-[10px] text-slate-400 block">{sensor.location}</span>
                  </div>
                </div>

                {isMax && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-900/60 border border-emerald-500/40 text-[9px] font-mono-num font-bold text-emerald-300 uppercase">
                    MAX TEMP
                  </span>
                )}
                {isMin && (
                  <span className="px-1.5 py-0.5 rounded bg-cyan-900/60 border border-cyan-500/40 text-[9px] font-mono-num font-bold text-cyan-300 uppercase">
                    MIN TEMP
                  </span>
                )}
              </div>

              {/* Temperature Display */}
              <div className="my-1 flex items-baseline justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="font-mono-num text-3xl font-extrabold text-emerald-300 drop-shadow">
                    {sensor.temperature}
                  </span>
                  <span className="font-tech text-base font-bold text-emerald-400">°C</span>
                </div>
                <div className="text-right text-[11px] font-mono-num text-slate-400">
                  <span>{(sensor.temperature * 1.8 + 32).toFixed(1)} °F</span>
                </div>
              </div>

              {/* Graphical Thermometer Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono-num text-slate-500">
                  <span>0°C</span>
                  <span className="text-emerald-400 font-semibold">28-29°C Safe</span>
                  <span>60°C</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800 p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    style={{ width: `${tempPercent}%` }}
                  />
                </div>
              </div>

              {/* Sensor Health Status */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono-num">
                <span className="text-slate-400">NTC Line: <strong className="text-slate-300">10kΩ @ 25°C</strong></span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  NORMAL
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
