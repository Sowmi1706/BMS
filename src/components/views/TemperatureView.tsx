import React from 'react';
import { Thermometer, Wind, AlertCircle, ShieldCheck, Flame } from 'lucide-react';
import { useBMS } from '../../context/BMSContext';
import { TemperatureMonitoring } from '../dashboard/TemperatureMonitoring';

export const TemperatureView: React.FC = () => {
  const { telemetry } = useBMS();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cyan-950/60">
        <div>
          <h2 className="font-tech text-xl sm:text-2xl font-bold tracking-wide text-slate-100 uppercase">
            Thermal Management & Temperature Monitoring
          </h2>
          <p className="text-xs text-slate-400">4-Channel NTC Thermistor Array & Pack Thermal Gradient</p>
        </div>

        <div className="flex items-center gap-2 font-mono-num text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
            Thermal Gradient: <strong>1.0 °C (Optimal)</strong>
          </span>
        </div>
      </div>

      {/* 4 Sensor Cards */}
      <TemperatureMonitoring />

      {/* Thermal Zone Architecture & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Physical Pack Thermal Layout */}
        <div className="bms-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-950/60">
            <span className="font-tech text-sm font-bold text-slate-200 uppercase">Pack Module Thermal Map</span>
            <Thermometer className="h-4 w-4 text-cyan-400" />
          </div>

          <div className="relative rounded-xl bg-slate-950/80 border border-slate-800 p-6 flex flex-col items-center justify-center">
            {/* Battery Enclosure Diagram */}
            <div className="w-full max-w-md border-2 border-dashed border-cyan-500/40 rounded-xl p-4 bg-slate-900/60 space-y-4">
              <div className="flex justify-between text-[11px] font-mono-num text-slate-400">
                <span>FRONT (COOLANT INLET)</span>
                <span className="text-cyan-400">MODULE 1-10</span>
              </div>

              {/* Sensor 1 & Sensor 2 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-center">
                  <span className="text-[10px] text-slate-400 block font-tech">ZONE 1 (FRONT-LEFT)</span>
                  <span className="font-mono-num text-xl font-bold text-emerald-300">28°C</span>
                  <span className="text-[9px] text-emerald-400 block">Sensor #1</span>
                </div>
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-center">
                  <span className="text-[10px] text-slate-400 block font-tech">ZONE 2 (FRONT-RIGHT)</span>
                  <span className="font-mono-num text-xl font-bold text-emerald-300">28°C</span>
                  <span className="text-[9px] text-emerald-400 block">Sensor #2</span>
                </div>
              </div>

              {/* Sensor 3 & Sensor 4 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-center">
                  <span className="text-[10px] text-slate-400 block font-tech">ZONE 3 (CORE-CENTER)</span>
                  <span className="font-mono-num text-xl font-bold text-emerald-300">29°C</span>
                  <span className="text-[9px] text-emerald-400 block">Sensor #3 (Max)</span>
                </div>
                <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-center">
                  <span className="text-[10px] text-slate-400 block font-tech">ZONE 4 (REAR-EXHAUST)</span>
                  <span className="font-mono-num text-xl font-bold text-emerald-300">29°C</span>
                  <span className="text-[9px] text-emerald-400 block">Sensor #4</span>
                </div>
              </div>

              <div className="flex justify-between text-[11px] font-mono-num text-slate-400">
                <span>REAR (COOLANT OUTLET)</span>
                <span className="text-cyan-400">MODULE 11-20</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thermal Protection Thresholds */}
        <div className="bms-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-950/60">
            <span className="font-tech text-sm font-bold text-slate-200 uppercase">Thermal Trip Parameters</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>

          <div className="space-y-3 text-xs font-mono-num">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-200">Charge Over-Temperature Limit</p>
                <span className="text-slate-400 text-[10px]">Trips EVSE relay if pack temp &gt; 45°C</span>
              </div>
              <span className="font-bold text-amber-400">45.0 °C</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-200">Charge Under-Temperature Limit</p>
                <span className="text-slate-400 text-[10px]">Prevents lithium dendrite formation</span>
              </div>
              <span className="font-bold text-cyan-400">0.0 °C</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-200">Discharge Over-Temperature Limit</p>
                <span className="text-slate-400 text-[10px]">Inverter derate at 55°C, hard cutoff at 60°C</span>
              </div>
              <span className="font-bold text-rose-400">60.0 °C</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-200">Active Liquid Cooling Trigger</p>
                <span className="text-slate-400 text-[10px]">Engages coolant circulation pump</span>
              </div>
              <span className="font-bold text-emerald-400">35.0 °C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
