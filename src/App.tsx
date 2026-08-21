import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BMSProvider, useBMS } from './context/BMSContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';

// Dashboard Sections
import { BatteryOverviewCard } from './components/dashboard/BatteryOverviewCard';
import { BatteryStatusCards } from './components/dashboard/BatteryStatusCards';
import { ChargingLoadStatus } from './components/dashboard/ChargingLoadStatus';
import { CellVoltagesGrid } from './components/dashboard/CellVoltagesGrid';
import { TemperatureMonitoring } from './components/dashboard/TemperatureMonitoring';
import { ChartsSection } from './components/dashboard/ChartsSection';
import { BatterySafetyStatus } from './components/dashboard/BatterySafetyStatus';

// Specific Tab Views
import { BatteryMonitorView } from './components/views/BatteryMonitorView';
import { CellVoltagesView } from './components/views/CellVoltagesView';
import { TemperatureView } from './components/views/TemperatureView';
import { ChargingView } from './components/views/ChargingView';
import { AlertsView } from './components/views/AlertsView';
import { SettingsView } from './components/views/SettingsView';

const MainContent: React.FC = () => {
  const { activeTab } = useBMS();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#060911] text-slate-100 bg-tech-grid selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <Header />

      {/* Mobile Sidebar Toggle Button */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-cyan-950/40">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-tech text-cyan-400"
        >
          {mobileSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span>NAVIGATION MENU</span>
        </button>
        <span className="text-[11px] font-mono-num text-slate-400 uppercase">
          Tab: <strong className="text-cyan-300">{activeTab.replace('-', ' ')}</strong>
        </span>
      </div>

      <div className="flex flex-1 relative overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

        {/* Main Dashboard / View Scrollable Container */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 lg:p-6 space-y-6 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* 1. Battery Overview */}
              <BatteryOverviewCard />

              {/* 2. Battery Status Cards */}
              <BatteryStatusCards />

              {/* 3. Charging and Load Status */}
              <ChargingLoadStatus />

              {/* 4. Individual Cell Voltage Section */}
              <CellVoltagesGrid />

              {/* 5. Temperature Monitoring */}
              <TemperatureMonitoring />

              {/* 6. Charts (Cell Voltages, Temperature, Pack Voltage Trend, Current Trend) */}
              <ChartsSection />

              {/* 7. Alarm and Safety Section */}
              <BatterySafetyStatus />
            </div>
          )}

          {activeTab === 'battery-monitor' && <BatteryMonitorView />}
          {activeTab === 'cell-voltages' && <CellVoltagesView />}
          {activeTab === 'temperature' && <TemperatureView />}
          {activeTab === 'charging' && <ChargingView />}
          {activeTab === 'alerts' && <AlertsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <BMSProvider>
      <MainContent />
    </BMSProvider>
  );
}
