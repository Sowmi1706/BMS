import React from 'react';
import { Cpu, Wifi, ShieldCheck, Activity } from 'lucide-react';
import { useBMS } from '../../context/BMSContext';

export const Footer: React.FC = () => {
  const { telemetry } = useBMS();

  return (
    <footer className="mt-8 border-t border-cyan-950/50 bg-[#070b14]/90 px-4 py-4 backdrop-blur-md">
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Main Footer Title from prompt */}
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold">⚡</span>
          <p className="font-tech font-bold text-slate-200 tracking-wide">
            EV Battery Management System | Real-Time Monitoring Dashboard
          </p>
        </div>

        {/* Telemetry Hardware Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono-num text-slate-400">
          <div className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span>Firmware: <strong className="text-slate-200">v4.8.2-CAN</strong></span>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5">
            <Wifi className="h-3.5 w-3.5 text-emerald-400" />
            <span>Protocol: <strong className="text-slate-200">CAN 2.0B / ISO 11898</strong></span>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-cyan-400" />
            <span>Last Telemetry Sync: <strong className="text-cyan-300">{telemetry.lastUpdated}</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
