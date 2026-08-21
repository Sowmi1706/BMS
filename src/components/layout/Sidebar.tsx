import React from 'react';
import { 
  LayoutDashboard, 
  BatteryCharging, 
  Grid3X3, 
  Thermometer, 
  Zap, 
  ShieldAlert, 
  Settings,
  Cpu,
  Flame,
  Activity
} from 'lucide-react';
import { useBMS } from '../../context/BMSContext';
import { ActiveTab } from '../../types/bms';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeTab, setActiveTab, telemetry } = useBMS();

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'battery-monitor', label: 'Battery Monitor', icon: BatteryCharging, badge: `${telemetry.soc}%` },
    { id: 'cell-voltages', label: 'Cell Voltages', icon: Grid3X3, badge: `${telemetry.cells.length}S` },
    { id: 'temperature', label: 'Temperature', icon: Thermometer, badge: `${telemetry.maxTemperature}°C` },
    { id: 'charging', label: 'Charging', icon: Zap },
    { id: 'alerts', label: 'Alerts', icon: ShieldAlert, badge: Object.values(telemetry.alarms).filter(v => Number(v) > 0).length > 0 ? 'ALERT' : undefined },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 flex w-64 flex-col justify-between border-r border-cyan-950/40 bg-[#070b14]/95 p-4 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation List */}
        <div className="space-y-6">
          {/* Section Label */}
          <div className="px-2">
            <p className="text-[11px] font-tech font-bold uppercase tracking-widest text-cyan-500/80">
              Telemetry & Control
            </p>
          </div>

          <nav className="space-y-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-950/90 to-blue-950/40 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
                      : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'
                      }`}
                    />
                    <span className="font-tech tracking-wide">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-mono-num font-bold ${
                        item.badge === 'ALERT'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                          : isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-800/80 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Hardware Status Pod */}
        <div className="rounded-xl border border-cyan-950/60 bg-slate-950/60 p-3.5 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              <span className="font-mono text-[11px]">BMS MCU</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ONLINE
            </span>
          </div>

          {/* Quick pack health bar */}
          <div>
            <div className="flex justify-between text-[11px] font-mono-num text-slate-400 mb-1">
              <span>PACK SOH</span>
              <span className="text-cyan-300 font-bold">{telemetry.stateOfHealth}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                style={{ width: `${telemetry.stateOfHealth}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-900 text-[10px] font-mono-num text-slate-400">
            <div>
              <span className="text-slate-500 block">DELTA V</span>
              <span className="text-cyan-400 font-bold">
                {((telemetry.maxCellVoltage - telemetry.minCellVoltage) * 1000).toFixed(0)} mV
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">CYCLES</span>
              <span className="text-slate-300 font-bold">{telemetry.cycleCount}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
