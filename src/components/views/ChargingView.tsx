import React from 'react';
import { Zap, Power, Layers, Activity, Sliders, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useBMS } from '../../context/BMSContext';
import { ChargingLoadStatus } from '../dashboard/ChargingLoadStatus';

export const ChargingView: React.FC = () => {
  const { telemetry, toggleCharger, toggleLoad } = useBMS();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cyan-950/60">
        <div>
          <h2 className="font-tech text-xl sm:text-2xl font-bold tracking-wide text-slate-100 uppercase">
            EV Charging & High-Voltage Circuit Control
          </h2>
          <p className="text-xs text-slate-400">CC-CV Charging Protocol, Contactor Relays and Load Management</p>
        </div>

        <div className="flex items-center gap-2 font-mono-num text-xs">
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            J1772 / Type 2 Pilot: <strong className="text-cyan-400">CP / PP READY</strong>
          </span>
        </div>
      </div>

      {/* Charging & Load Status Component */}
      <ChargingLoadStatus />

      {/* Advanced Charging Stages & Contactor Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Contactor Relay Matrix */}
        <div className="bms-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-950/60">
            <span className="font-tech text-sm font-bold text-slate-200 uppercase">High-Voltage Contactors</span>
            <Power className="h-4 w-4 text-cyan-400" />
          </div>

          <div className="space-y-3 text-xs font-mono-num">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-200">Main Positive Contactor (K1+)</p>
                <span className="text-slate-400 text-[10px]">Traction HV+ Bus Connection</span>
              </div>
              <span className={`px-2.5 py-1 rounded font-bold ${telemetry.chargingLoad.mainPosRelay ? 'bg-emerald-950 text-emerald-300 border border-emerald-500' : 'bg-slate-800 text-slate-400'}`}>
                {telemetry.chargingLoad.mainPosRelay ? 'CLOSED' : 'OPEN (SAFE)'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-200">Main Negative Contactor (K2-)</p>
                <span className="text-slate-400 text-[10px]">Traction HV- Bus Connection</span>
              </div>
              <span className={`px-2.5 py-1 rounded font-bold ${telemetry.chargingLoad.mainNegRelay ? 'bg-emerald-950 text-emerald-300 border border-emerald-500' : 'bg-slate-800 text-slate-400'}`}>
                {telemetry.chargingLoad.mainNegRelay ? 'CLOSED' : 'OPEN (SAFE)'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-200">Precharge Relay (K3_PRE)</p>
                <span className="text-slate-400 text-[10px]">Inrush Current Limiter (47Ω 50W)</span>
              </div>
              <span className="px-2.5 py-1 rounded font-bold bg-slate-800 text-slate-400">
                STANDBY
              </span>
            </div>
          </div>
        </div>

        {/* CC-CV Charging Profile */}
        <div className="bms-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-950/60">
            <span className="font-tech text-sm font-bold text-slate-200 uppercase">20S CC-CV Charging Profile</span>
            <Zap className="h-4 w-4 text-emerald-400" />
          </div>

          <div className="space-y-3 text-xs text-slate-300 font-mono-num">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Phase 1: Constant Current (CC)</span>
              <span className="font-bold text-cyan-300">Max 40.0 A (Until 83.6 V)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Phase 2: Constant Voltage (CV)</span>
              <span className="font-bold text-cyan-300">Hold 84.0 V (Taper to 1.5 A)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Phase 3: Top Balancing</span>
              <span className="font-bold text-emerald-400">Bleed cells &gt; 4.075 V</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Charge Termination Cutoff</span>
              <span className="font-bold text-slate-200">Current &lt; 0.5 A or SOC 100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
