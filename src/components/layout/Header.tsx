import React, { useState } from 'react';
import { 
  Bell, 
  User, 
  ShieldCheck, 
  Activity, 
  Wifi, 
  RefreshCw, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronDown,
  Info,
  X
} from 'lucide-react';
import { useBMS } from '../../context/BMSContext';
import { SimulationMode } from '../../types/bms';

export const Header: React.FC = () => {
  const { 
    telemetry, 
    simulationMode, 
    setSimulationMode, 
    canFrameCount, 
    resetToDefault 
  } = useBMS();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSimMenu, setShowSimMenu] = useState(false);

  // Check if any alarm is triggered
  const activeAlarmCount = Object.values(telemetry.alarms).filter(v => Number(v) > 0).length;
  const isHealthy = activeAlarmCount === 0;

  const simModes: { id: SimulationMode; label: string; desc: string }[] = [
    { id: 'static', label: 'Snapshot Baseline (Prompt Values)', desc: 'Exact static BMS specification (81.4V, 92.8% SOC, 0A)' },
    { id: 'live-idle', label: 'Live Vehicle Idle Telemetry', desc: 'Sub-millivolt real-time CAN stream jitter and polling' },
    { id: 'fast-charging', label: 'DC Fast Charge (40A CC-CV)', desc: 'High-current charging with thermal rise' },
    { id: 'sport-drive', label: 'High Load Sport Discharge', desc: 'Dynamic discharge current & voltage drop under throttle' },
    { id: 'cell-balancing-test', label: 'Active Cell Balancing Test', desc: 'Bleeds upper threshold cells (Cell #15 & #16)' },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-cyan-950/40 bg-[#070b14]/90 px-4 sm:px-6 backdrop-blur-xl shadow-lg shadow-black/40">
      {/* Brand Title Zone */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
          <span className="text-lg">⚡</span>
        </div>
        <div className="flex items-baseline gap-2">
          <h1 className="font-tech text-lg sm:text-xl font-bold tracking-wider text-slate-100 uppercase drop-shadow">
            EV BMS CONTROL CENTER
          </h1>
          <span className="hidden md:inline-flex items-center px-2 py-0.5 text-[10px] font-mono-num font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 rounded">
            20S LFP/NMC
          </span>
        </div>
      </div>

      {/* Center Zone: Live System Status Indicator */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Main Health Status Badge */}
        {isHealthy ? (
          <div className="flex items-center gap-2.5 rounded-full bg-emerald-950/60 px-4 py-1.5 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
            </span>
            <span className="font-tech text-xs sm:text-sm font-bold tracking-widest text-emerald-400">
              SYSTEM HEALTHY
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 rounded-full bg-rose-950/80 px-4 py-1.5 border border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 shadow-[0_0_8px_#f43f5e]"></span>
            </span>
            <span className="font-tech text-xs sm:text-sm font-bold tracking-widest text-rose-400">
              {activeAlarmCount} ALARM{activeAlarmCount > 1 ? 'S' : ''} DETECTED
            </span>
          </div>
        )}

        {/* CAN Bus Heartbeat */}
        <div className="hidden xl:flex items-center gap-2 text-xs font-mono-num text-slate-400 bg-slate-900/60 border border-slate-800/80 px-3 py-1.5 rounded-lg">
          <Wifi className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span>CAN-BUS: <strong className="text-cyan-300">500 kbps</strong></span>
          <span className="text-slate-600">|</span>
          <Activity className="h-3.5 w-3.5 text-emerald-400" />
          <span>FRAMES: <strong className="text-slate-200">{canFrameCount.toLocaleString()}</strong></span>
        </div>
      </div>

      {/* Right Action Zone */}
      <div className="flex items-center gap-2.5">
        {/* Simulation / Data Stream Control */}
        <div className="relative">
          <button
            onClick={() => setShowSimMenu(!showSimMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 hover:border-cyan-500/50 text-xs font-medium text-slate-300 hover:text-cyan-300 transition-all shadow-sm"
            title="Telemetry Stream & Simulation Control"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Stream:</span>
            <span className="font-semibold text-cyan-400 max-w-[100px] sm:max-w-none truncate">
              {simulationMode === 'static' ? 'Baseline Snapshot' : simulationMode}
            </span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showSimMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#0b1120] border border-cyan-900/40 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Telemetry Mode
              </div>
              <div className="space-y-1 py-1">
                {simModes.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setSimulationMode(mode.id);
                      setShowSimMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex flex-col ${
                      simulationMode === mode.id
                        ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-200'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <span className="font-semibold">{mode.label}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{mode.desc}</span>
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    resetToDefault();
                    setShowSimMenu(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition"
                >
                  <RefreshCw className="h-3 w-3" />
                  Reset to Initial Values
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            aria-label="System notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-colors"
          >
            <Bell className="h-4 w-4" />
            {isHealthy ? (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-slate-950 shadow-[0_0_8px_#10b981]">
                ✓
              </span>
            ) : (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white animate-pulse">
                {activeAlarmCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#0b1120] border border-cyan-900/50 p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-tech text-sm font-semibold text-slate-200">System Notifications</span>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="py-2 space-y-2 max-h-60 overflow-y-auto">
                <div className="flex gap-2.5 p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-300">BMS Safety Matrix Clear</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">All 11 hardware alarm registers report 0 (NORMAL / NO FAULT).</p>
                  </div>
                </div>
                <div className="flex gap-2.5 p-2 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-xs">
                  <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-cyan-300">Pack Voltage In Balance</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">Max delta: 8 mV (Cell #15: 4.079V vs Cell #7: 4.071V).</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            aria-label="User Profile"
            className="flex items-center gap-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 p-1.5 sm:px-2.5 sm:py-1.5 text-slate-300 hover:text-white transition-colors"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 text-slate-950 font-bold text-xs">
              <User className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200">EV Engineer</span>
              <span className="text-[10px] text-cyan-400 font-mono-num">ID #BMS-9021</span>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0b1120] border border-cyan-900/50 p-4 shadow-2xl z-50">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 text-white font-bold text-sm">
                  EE
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">EV Systems Lead</h4>
                  <p className="text-[11px] text-slate-400 font-mono">dsowmiya@ev-lab.io</p>
                </div>
              </div>
              <div className="py-2.5 space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Target Pack:</span>
                  <span className="font-mono text-cyan-300">20S NMC Module</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Firmware:</span>
                  <span className="font-mono text-slate-200">v4.8.2-CAN</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Isolation:</span>
                  <span className="font-mono text-emerald-400">520 kΩ (Pass)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
