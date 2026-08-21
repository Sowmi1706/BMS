import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import { useBMS } from '../../context/BMSContext';
import { BatterySafetyStatus } from '../dashboard/BatterySafetyStatus';

export const AlertsView: React.FC = () => {
  const { telemetry } = useBMS();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cyan-950/60">
        <div>
          <h2 className="font-tech text-xl sm:text-2xl font-bold tracking-wide text-slate-100 uppercase">
            BMS Safety Interlock & Alarm Registers
          </h2>
          <p className="text-xs text-slate-400">ISO 26262 Automotive Safety Integrity Level (ASIL-C) Diagnostics</p>
        </div>

        <div className="flex items-center gap-2 font-mono-num text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
            Hardware Trip Relays: <strong>ARMED (PASS)</strong>
          </span>
        </div>
      </div>

      {/* Main Safety Status Component */}
      <BatterySafetyStatus />
    </div>
  );
};
