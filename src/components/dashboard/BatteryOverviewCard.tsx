import React from 'react';
import { 
  Zap, 
  Battery, 
  Activity, 
  Gauge, 
  Layers, 
  Thermometer, 
  Flame,
  ArrowDownUp,
  Sparkles
} from 'lucide-react';
import { useBMS } from '../../context/BMSContext';

export const BatteryOverviewCard: React.FC = () => {
  const { telemetry } = useBMS();

  // Calculate SVG circular gauge parameters
  const radius = 78;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Arc angle: 260 degrees arc for a speedo-gauge look
  const strokeDashoffset = circumference - (telemetry.soc / 100) * circumference;

  // Power in kW
  const currentPowerKw = (telemetry.packVoltage * telemetry.packCurrent) / 1000;
  const isCharging = telemetry.packCurrent > 0.5;
  const isDischarging = telemetry.packCurrent < -0.5;

  return (
    <div className="bms-card relative overflow-hidden rounded-2xl p-5 lg:p-6 transition-all duration-300">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cyan-950/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <Battery className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-tech text-base sm:text-lg font-bold tracking-wide text-slate-100 uppercase">
              Battery Overview
            </h2>
            <p className="text-xs text-slate-400">High-Voltage Traction Battery Pack</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono-num text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            CONFIG: <strong>{telemetry.batteryConfiguration}</strong>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono-num text-slate-300">
            SOH: <strong className="text-emerald-400">{telemetry.stateOfHealth}%</strong>
          </span>
        </div>
      </div>

      {/* Main Grid: Circular Gauge & Pack Key Specifications */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Large Circular Battery Progress Gauge */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-2">
          <div className="relative flex items-center justify-center">
            {/* SVG Radial Gauge */}
            <svg
              height={radius * 2}
              width={radius * 2}
              className="transform -rotate-90 filter drop-shadow-[0_0_12px_rgba(6,182,212,0.3)]"
            >
              {/* Background track circle */}
              <circle
                stroke="rgba(30, 41, 59, 0.7)"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              {/* Foreground animated value circle */}
              <circle
                stroke="url(#socGradient)"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              {/* Gradient definition */}
              <defs>
                <linearGradient id="socGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="60%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center Gauge Text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-tech font-bold uppercase tracking-widest text-slate-400">
                State of Charge
              </span>
              <div className="flex items-baseline justify-center">
                <span className="font-mono-num text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-300 drop-shadow">
                  {telemetry.soc.toFixed(1)}
                </span>
                <span className="font-tech text-base font-bold text-cyan-400 ml-0.5">%</span>
              </div>
              <div className="mt-0.5 flex items-center gap-1 rounded bg-slate-900/80 px-2 py-0.5 border border-cyan-900/40 text-[11px] font-mono-num text-slate-300">
                <span>{telemetry.packEnergyKwh.toFixed(1)} kWh</span>
                <span className="text-slate-600">|</span>
                <span className="text-emerald-400 font-semibold">{telemetry.estimatedRangeKm} km</span>
              </div>
            </div>
          </div>

          {/* Current Operating Status Badge */}
          <div className="mt-3 flex items-center gap-2 text-xs font-mono-num">
            {isCharging ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold animate-pulse">
                <Zap className="h-3.5 w-3.5" />
                CHARGING (+{telemetry.packCurrent} A)
              </span>
            ) : isDischarging ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 font-semibold">
                <ArrowDownUp className="h-3.5 w-3.5" />
                DISCHARGING ({telemetry.packCurrent} A)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/60 text-slate-300">
                <Activity className="h-3.5 w-3.5 text-cyan-400" />
                STANDBY / IDLE (0 A)
              </span>
            )}
          </div>
        </div>

        {/* Right: Key Pack Parameters Specified in Prompt */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Total Pack Voltage */}
          <div className="rounded-xl bg-slate-900/70 border border-cyan-950/80 p-3 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-tech font-semibold uppercase tracking-wider">Total Pack Voltage</span>
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono-num text-2xl font-bold text-slate-100">
                {telemetry.packVoltage.toFixed(1)}
              </span>
              <span className="font-tech text-xs font-bold text-cyan-400">V</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-400 font-mono-num flex items-center justify-between">
              <span>Nominal: 74.0 V</span>
              <span className="text-emerald-400 font-medium">Max: 84.0 V</span>
            </div>
          </div>

          {/* Current */}
          <div className="rounded-xl bg-slate-900/70 border border-cyan-950/80 p-3 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-tech font-semibold uppercase tracking-wider">Current</span>
              <Activity className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono-num text-2xl font-bold text-slate-100">
                {telemetry.packCurrent.toFixed(1)}
              </span>
              <span className="font-tech text-xs font-bold text-cyan-400">A</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-400 font-mono-num flex items-center justify-between">
              <span>Power: {currentPowerKw.toFixed(2)} kW</span>
              <span className="text-cyan-400 font-medium">Flow: {telemetry.packCurrent === 0 ? '0.0 W' : `${(telemetry.packVoltage * telemetry.packCurrent).toFixed(0)} W`}</span>
            </div>
          </div>

          {/* Battery Capacity */}
          <div className="rounded-xl bg-slate-900/70 border border-cyan-950/80 p-3 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-tech font-semibold uppercase tracking-wider">Battery Capacity</span>
              <Gauge className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono-num text-2xl font-bold text-slate-100">
                {telemetry.batteryCapacity}
              </span>
              <span className="font-tech text-xs font-bold text-cyan-400">Ah</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-400 font-mono-num flex items-center justify-between">
              <span>Remaining: {(telemetry.batteryCapacity * (telemetry.soc / 100)).toFixed(1)} Ah</span>
            </div>
          </div>

          {/* Battery Configuration */}
          <div className="rounded-xl bg-slate-900/70 border border-cyan-950/80 p-3 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-tech font-semibold uppercase tracking-wider">Battery Config</span>
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono-num text-2xl font-bold text-cyan-300">
                {telemetry.batteryConfiguration}
              </span>
              <span className="font-tech text-xs font-bold text-slate-400">1P</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-400 font-mono-num">
              20 Series Cells in Pack
            </div>
          </div>

          {/* Number of Temperature Sensors */}
          <div className="rounded-xl bg-slate-900/70 border border-cyan-950/80 p-3 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-tech font-semibold uppercase tracking-wider">Temp Sensors</span>
              <Thermometer className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono-num text-2xl font-bold text-slate-100">
                {telemetry.temperatureSensorsCount}
              </span>
              <span className="font-tech text-xs font-bold text-cyan-400">NTC</span>
            </div>
            <div className="mt-1 text-[10px] text-emerald-400 font-mono-num">
              All 4 Channels Active
            </div>
          </div>

          {/* State of Charge Quick Summary */}
          <div className="rounded-xl bg-slate-900/70 border border-cyan-950/80 p-3 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-tech font-semibold uppercase tracking-wider">SOC (Reported)</span>
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono-num text-2xl font-bold text-emerald-300">
                {telemetry.soc.toFixed(1)}
              </span>
              <span className="font-tech text-xs font-bold text-emerald-400">%</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-400 font-mono-num">
              Coulomb Counting + OCV
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
