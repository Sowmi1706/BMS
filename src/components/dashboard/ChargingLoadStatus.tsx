import React from 'react';
import { 
  Zap, 
  Power, 
  Layers, 
  Sliders, 
  CheckCircle, 
  XCircle, 
  Radio,
  ToggleLeft,
  ToggleRight,
  ShieldAlert
} from 'lucide-react';
import { useBMS } from '../../context/BMSContext';

export const ChargingLoadStatus: React.FC = () => {
  const { telemetry, toggleCharger, toggleLoad, toggleBalancing } = useBMS();
  const { chargingLoad } = telemetry;

  return (
    <div className="bms-card rounded-2xl p-5 lg:p-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cyan-950/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-tech text-base sm:text-lg font-bold tracking-wide text-slate-100 uppercase">
              Charging and Load Status
            </h3>
            <p className="text-xs text-slate-400">High Voltage Contactor & Power Circuit States</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono-num text-slate-300">
            <span className={`h-2 w-2 rounded-full ${chargingLoad.chargerStatus === 'ON' || chargingLoad.loadStatus === 'ON' ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'}`} />
            RELAY STATUS: <strong>{chargingLoad.chargerStatus === 'ON' ? 'CHG CLOSED' : chargingLoad.loadStatus === 'ON' ? 'LOAD CLOSED' : 'OPEN / ISOLATED'}</strong>
          </span>
        </div>
      </div>

      {/* Status Grid & Toggles */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Charger State */}
        <div className="rounded-xl bg-slate-900/80 border border-cyan-950/80 p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-tech font-bold uppercase tracking-wider text-slate-400">
              Charger State
            </span>
            <Zap className={`h-4 w-4 ${chargingLoad.chargerStatus === 'ON' ? 'text-emerald-400' : 'text-slate-500'}`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`font-mono-num text-lg font-bold ${chargingLoad.chargerStatus === 'ON' ? 'text-emerald-300' : 'text-slate-200'}`}>
                {chargingLoad.chargerState}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              EVSE Pilot: {chargingLoad.chargerStatus === 'ON' ? 'PWM 1kHz (32A Limit)' : 'No Pilot Signal Detected'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] font-tech text-slate-400">Port Connection</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono-num font-bold ${
              chargingLoad.chargerStatus === 'ON' 
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                : 'bg-slate-800/80 text-slate-400 border border-slate-700/50'
            }`}>
              {chargingLoad.chargerStatus === 'ON' ? 'PLUGGED IN' : 'DISCONNECTED'}
            </span>
          </div>
        </div>

        {/* 2. Charger Status */}
        <div className="rounded-xl bg-slate-900/80 border border-cyan-950/80 p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-tech font-bold uppercase tracking-wider text-slate-400">
              Charger Status
            </span>
            <button 
              onClick={toggleCharger}
              className="text-slate-400 hover:text-cyan-400 transition"
              title="Click to toggle test charger state"
            >
              {chargingLoad.chargerStatus === 'ON' ? (
                <ToggleRight className="h-6 w-6 text-emerald-400" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-slate-500" />
              )}
            </button>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`font-mono-num text-2xl font-extrabold ${chargingLoad.chargerStatus === 'ON' ? 'text-emerald-400' : 'text-slate-300'}`}>
              {chargingLoad.chargerStatus}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-tech font-bold uppercase ${
              chargingLoad.chargerStatus === 'ON'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 animate-pulse'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {chargingLoad.chargerStatus === 'ON' ? 'ENERGIZED' : 'INACTIVE'}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] font-tech text-slate-400">Toggle Simulator</span>
            <button
              onClick={toggleCharger}
              className="text-[11px] font-semibold text-cyan-400 hover:underline"
            >
              {chargingLoad.chargerStatus === 'ON' ? 'Disconnect' : 'Connect 40A'}
            </button>
          </div>
        </div>

        {/* 3. Load Status */}
        <div className="rounded-xl bg-slate-900/80 border border-cyan-950/80 p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-tech font-bold uppercase tracking-wider text-slate-400">
              Load Status
            </span>
            <button 
              onClick={toggleLoad}
              className="text-slate-400 hover:text-cyan-400 transition"
              title="Click to toggle test inverter load"
            >
              {chargingLoad.loadStatus === 'ON' ? (
                <ToggleRight className="h-6 w-6 text-amber-400" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-slate-500" />
              )}
            </button>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`font-mono-num text-2xl font-extrabold ${chargingLoad.loadStatus === 'ON' ? 'text-amber-400' : 'text-slate-300'}`}>
              {chargingLoad.loadStatus}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-tech font-bold uppercase ${
              chargingLoad.loadStatus === 'ON'
                ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {chargingLoad.loadStatus === 'ON' ? 'INVERTER ACTIVE' : 'OPEN CIRCUIT'}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] font-tech text-slate-400">Motor Circuit</span>
            <button
              onClick={toggleLoad}
              className="text-[11px] font-semibold text-cyan-400 hover:underline"
            >
              {chargingLoad.loadStatus === 'ON' ? 'Disengage Load' : 'Engage Inverter'}
            </button>
          </div>
        </div>

        {/* 4. Cell Balancing */}
        <div className="rounded-xl bg-slate-900/80 border border-cyan-950/80 p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-tech font-bold uppercase tracking-wider text-slate-400">
              Cell Balancing
            </span>
            <button 
              onClick={toggleBalancing}
              className="text-slate-400 hover:text-cyan-400 transition"
              title="Click to toggle passive balancing shunts"
            >
              {chargingLoad.cellBalancing === 'ON' ? (
                <ToggleRight className="h-6 w-6 text-cyan-400" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-slate-500" />
              )}
            </button>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`font-mono-num text-2xl font-extrabold ${chargingLoad.cellBalancing === 'ON' ? 'text-cyan-400' : 'text-slate-300'}`}>
              {chargingLoad.cellBalancing}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-tech font-bold uppercase ${
              chargingLoad.cellBalancing === 'ON'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 animate-pulse'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {chargingLoad.cellBalancing === 'ON' ? 'BLEEDING SHUNT' : 'IDLE / BALANCED'}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] font-tech text-slate-400">Delta Threshold</span>
            <span className="text-[10px] font-mono-num text-slate-400">Target &le; 15 mV</span>
          </div>
        </div>
      </div>
    </div>
  );
};
