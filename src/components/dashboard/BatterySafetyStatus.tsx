import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Activity, 
  Zap, 
  Flame, 
  RefreshCw,
  Info
} from 'lucide-react';
import { useBMS } from '../../context/BMSContext';
import { ALARM_DEFINITIONS } from '../../data/initialBmsData';

export const BatterySafetyStatus: React.FC = () => {
  const { telemetry, injectAlarm } = useBMS();
  const [showFaultSimulator, setShowFaultSimulator] = useState(false);

  // Check if any alarm value is > 0
  const activeAlarms = Object.entries(telemetry.alarms).filter(([_, val]) => Number(val) > 0);
  const isAllNormal = activeAlarms.length === 0;

  return (
    <div className="bms-card relative overflow-hidden rounded-2xl p-5 lg:p-7 transition-all duration-300">
      {/* Ambient green safety glow */}
      <div className={`pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full ${isAllNormal ? 'bg-emerald-500/10' : 'bg-rose-500/15'} blur-3xl`} />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-cyan-950/60">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isAllNormal ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/20 border border-rose-500/40 text-rose-400'}`}>
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-tech text-lg sm:text-xl font-bold tracking-wide text-slate-100 uppercase">
              BATTERY SAFETY STATUS
            </h3>
            <p className="text-xs text-slate-400">ASIL-C Hardware Interlock & Safe State Monitoring</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFaultSimulator(!showFaultSimulator)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/70 hover:border-cyan-500/40 text-xs font-mono-num text-slate-300 hover:text-cyan-300 transition"
          >
            {showFaultSimulator ? 'Hide Test Panel' : 'Diagnostic Trip Test'}
          </button>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono-num text-slate-300">
            WATCHDOG: <strong className="text-emerald-400">PASS (0ms Latency)</strong>
          </span>
        </div>
      </div>

      {/* Hero Banner: Large Green Shield & ALL SYSTEMS NORMAL */}
      <div className="my-6">
        {isAllNormal ? (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-950/80 to-cyan-950/60 border border-emerald-500/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-emerald-500/10 border-2 border-emerald-400/60 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                <ShieldCheck className="h-12 w-12 sm:h-14 sm:w-14" />
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold">
                  ✓
                </span>
              </div>
              <div>
                <span className="text-xs font-tech font-bold uppercase tracking-widest text-emerald-400">
                  Global Safety Assessment
                </span>
                <h2 className="font-tech text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wider text-slate-100 uppercase drop-shadow">
                  ALL SYSTEMS NORMAL
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-300">
                  All 11 hardware safety registers report nominal condition (<span className="font-mono text-emerald-300 font-bold">0x00 NO FAULT</span>). High Voltage contactors are verified safe.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
              <span className="flex items-center gap-2 rounded-full bg-emerald-900/60 border border-emerald-400/40 px-4 py-1.5 text-xs font-tech font-bold text-emerald-300 uppercase tracking-wider">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ZERO FAULTS ACTIVE
              </span>
              <span className="text-[11px] font-mono-num text-slate-400">
                Isolation: 520 kΩ | Pyro-Fuse: ARMED
              </span>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-950/90 via-slate-950/80 to-amber-950/60 border border-rose-500/60 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(244,63,94,0.25)]">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-rose-500/20 border-2 border-rose-400 text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.5)]">
                <ShieldAlert className="h-12 w-12 sm:h-14 sm:w-14 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-tech font-bold uppercase tracking-widest text-rose-400">
                  CRITICAL FAULT DETECTED
                </span>
                <h2 className="font-tech text-2xl sm:text-3xl font-extrabold tracking-wider text-rose-200 uppercase">
                  SAFETY INTERLOCK TRIPPED
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-300">
                  {activeAlarms.length} active warning/fault register flagged. Check safety matrix below.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                Object.keys(telemetry.alarms).forEach(key => injectAlarm(key as any, false));
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-tech font-bold uppercase tracking-wider transition shadow-lg"
            >
              Clear Fault Registers
            </button>
          </div>
        )}
      </div>

      {/* Fault Injection / Diagnostic simulator test bar */}
      {showFaultSimulator && (
        <div className="mb-6 rounded-xl border border-cyan-500/30 bg-slate-950/90 p-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-xs">
            <span className="font-tech font-bold text-cyan-400 uppercase">BMS Engineer Fault Injection Simulator</span>
            <span className="text-slate-400 text-[11px]">Click to toggle individual hardware alarm flags</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {ALARM_DEFINITIONS.map(def => {
              const isTriggered = telemetry.alarms[def.key as keyof typeof telemetry.alarms] > 0;
              return (
                <button
                  key={def.key}
                  onClick={() => injectAlarm(def.key as any, !isTriggered)}
                  className={`p-2 rounded-lg text-left text-xs transition border flex items-center justify-between ${
                    isTriggered 
                      ? 'bg-rose-950/80 border-rose-500 text-rose-200' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="truncate pr-1">{def.label.replace(' Alarm', '')}</span>
                  <span className={`text-[10px] font-mono-num font-bold px-1.5 py-0.5 rounded ${isTriggered ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {isTriggered ? 'TRIP' : 'NORM'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 11 Hardware Safety Alarms Grid (All prompt required alarms) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-tech text-slate-400 uppercase tracking-wider px-1">
          <span>BMS Safety Matrix (11 Active Alarm Checks)</span>
          <span className="font-mono-num">Register Status: 0 = NORMAL / NO FAULT</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {ALARM_DEFINITIONS.map(alarm => {
            const rawVal = telemetry.alarms[alarm.key as keyof typeof telemetry.alarms];
            const isAlarmNormal = rawVal === 0;

            return (
              <div
                key={alarm.key}
                className={`rounded-xl p-3.5 flex items-center justify-between transition-all ${
                  isAlarmNormal
                    ? 'bg-slate-900/70 border border-slate-800 hover:border-cyan-500/30'
                    : 'bg-rose-950/60 border border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse'
                }`}
              >
                <div className="flex items-center gap-3 pr-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      isAlarmNormal
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {isAlarmNormal ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-tech text-xs sm:text-sm font-bold text-slate-100 leading-tight">
                      {alarm.label}
                    </h5>
                    <span className="text-[10px] font-mono-num text-slate-400">
                      Code: {alarm.code} | Val: {rawVal}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono-num font-bold ${
                      isAlarmNormal
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-950 text-rose-300 border border-rose-500'
                    }`}
                  >
                    {isAlarmNormal ? 'NORMAL' : 'FAULT'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
