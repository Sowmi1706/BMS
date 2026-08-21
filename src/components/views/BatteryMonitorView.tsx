import React from 'react';
import { 
  BatteryCharging, 
  Activity, 
  Zap, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  Gauge, 
  Cpu, 
  Scale, 
  Clock,
  Sparkles
} from 'lucide-react';
import { useBMS } from '../../context/BMSContext';
import { BatteryOverviewCard } from '../dashboard/BatteryOverviewCard';
import { BatteryStatusCards } from '../dashboard/BatteryStatusCards';

export const BatteryMonitorView: React.FC = () => {
  const { telemetry } = useBMS();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cyan-950/60">
        <div>
          <h2 className="font-tech text-xl sm:text-2xl font-bold tracking-wide text-slate-100 uppercase">
            Battery Pack Deep Telemetry
          </h2>
          <p className="text-xs text-slate-400">Advanced State of Charge (SOC), State of Health (SOH) and Impedance</p>
        </div>
        <div className="flex items-center gap-2 font-mono-num text-xs">
          <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
            Pack Energy: <strong>{telemetry.packEnergyKwh} kWh</strong>
          </span>
        </div>
      </div>

      {/* Main Overview */}
      <BatteryOverviewCard />
      <BatteryStatusCards />

      {/* Deep Battery Chemistry & Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cell Chemistry & Specifications */}
        <div className="bms-card rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-950/60">
            <span className="font-tech text-sm font-bold text-slate-200 uppercase">Pack Chemistry Spec</span>
            <Layers className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="space-y-2 text-xs font-mono-num text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Cell Chem:</span>
              <span className="font-bold text-cyan-300">NMC 811 High-Density</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Nominal Voltage:</span>
              <span className="text-slate-100">74.0 V (3.7V / cell)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Charge Cutoff:</span>
              <span className="text-emerald-400">84.0 V (4.20V / cell)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Discharge Cutoff:</span>
              <span className="text-amber-400">60.0 V (3.00V / cell)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Continuous Current:</span>
              <span className="text-slate-100">60.0 A (2.2C)</span>
            </div>
          </div>
        </div>

        {/* State of Health & Aging */}
        <div className="bms-card rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-950/60">
            <span className="font-tech text-sm font-bold text-slate-200 uppercase">State of Health (SOH)</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="space-y-2 text-xs font-mono-num text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Pack SOH Index:</span>
              <span className="font-bold text-emerald-400">{telemetry.stateOfHealth}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Equivalent Cycles:</span>
              <span className="text-slate-100">{telemetry.cycleCount} Full Cycles</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Impedance Growth:</span>
              <span className="text-emerald-400">+1.2% (Nominal)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Capacity Fade:</span>
              <span className="text-slate-100">-0.6% Retained</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Expected Pack Life:</span>
              <span className="text-cyan-300">2,500+ Cycles (8 yrs)</span>
            </div>
          </div>
        </div>

        {/* Safety Isolation & Thermal Status */}
        <div className="bms-card rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-950/60">
            <span className="font-tech text-sm font-bold text-slate-200 uppercase">Isolation & Safety</span>
            <Zap className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="space-y-2 text-xs font-mono-num text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Chassis Isolation:</span>
              <span className="font-bold text-emerald-400">520 kΩ (&gt;100kΩ Req)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Pre-charge Contactor:</span>
              <span className="text-slate-300">OPEN (Standby)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Main Relays (+/-):</span>
              <span className="text-slate-300">DISCONNECTED</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Interlock Loop (HVIL):</span>
              <span className="text-emerald-400 font-bold">CLOSED (PASS)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Thermal Gradient:</span>
              <span className="text-emerald-400">1.0 °C (Excellent)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
