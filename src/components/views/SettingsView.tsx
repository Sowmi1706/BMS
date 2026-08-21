import React, { useState } from 'react';
import { 
  Settings, 
  Wifi, 
  Cpu, 
  Database, 
  Download, 
  RefreshCw, 
  Check, 
  Sliders, 
  Terminal,
  Radio
} from 'lucide-react';
import { useBMS } from '../../context/BMSContext';

export const SettingsView: React.FC = () => {
  const { telemetry, resetToDefault } = useBMS();
  const [canBaud, setCanBaud] = useState('500000');
  const [canId, setCanId] = useState('0x1806E5F4');
  const [mqttBroker, setMqttBroker] = useState('wss://mqtt.ev-fleet.internal:8883');
  const [copied, setCopied] = useState(false);

  // Export JSON telemetry
  const exportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(telemetry, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `BMS_Telemetry_Snapshot_${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export CSV of Cell Voltages
  const exportCsv = () => {
    let csv = "Cell_ID,Voltage_V,IR_mOhm,Status\n";
    telemetry.cells.forEach(c => {
      csv += `V${c.id},${c.voltage},${c.internalResistanceMilliOhm ?? 1.2},${c.status}\n`;
    });
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `BMS_20S_Cells_${new Date().toISOString()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cyan-950/60">
        <div>
          <h2 className="font-tech text-xl sm:text-2xl font-bold tracking-wide text-slate-100 uppercase">
            BMS Hardware & Telemetry Bridge Settings
          </h2>
          <p className="text-xs text-slate-400">Configure CAN 2.0B, ESP32 WebSocket, MQTT and API Telemetry Ingestion</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetToDefault}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-xs font-mono-num text-slate-300 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset BMS Baseline Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CAN Bus & Hardware Integration Interface */}
        <div className="bms-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-950/60">
            <span className="font-tech text-sm font-bold text-slate-200 uppercase">CAN-Bus / Microcontroller Interface</span>
            <Cpu className="h-4 w-4 text-cyan-400" />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-tech uppercase mb-1">CAN Baud Rate</label>
              <select
                value={canBaud}
                onChange={e => setCanBaud(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 p-2.5 font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="250000">250 kbps (Standard Automotive Low)</option>
                <option value="500000">500 kbps (High-Speed Traction Standard - Active)</option>
                <option value="1000000">1 Mbps (CAN-FD Fast Array)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-tech uppercase mb-1">Primary Base CAN Message ID</label>
              <input
                type="text"
                value={canId}
                onChange={e => setCanId(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 p-2.5 font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <p className="text-cyan-300 font-bold">Supported Microcontroller Bridges:</p>
              <p>• ESP32 / STM32F4 via MCP2515 or TWAI transceiver</p>
              <p>• TI BQ76952 / LTC6813 AFE Cell Controllers</p>
              <p>• Native SocketCAN & Kvaser USB-to-CAN</p>
            </div>
          </div>
        </div>

        {/* MQTT & WebSocket Real-time Ingestion */}
        <div className="bms-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-950/60">
            <span className="font-tech text-sm font-bold text-slate-200 uppercase">IoT / MQTT & WebSocket Stream</span>
            <Wifi className="h-4 w-4 text-emerald-400" />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-tech uppercase mb-1">MQTT Telemetry Broker Endpoint</label>
              <input
                type="text"
                value={mqttBroker}
                onChange={e => setMqttBroker(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 p-2.5 font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-tech uppercase mb-1">Telemetry Topic Subscribe</label>
              <input
                type="text"
                readOnly
                value="vehicles/vin-9021/bms/telemetry/20s"
                className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2.5 font-mono text-slate-400 cursor-not-allowed"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <p className="text-emerald-300 font-bold">Cloud Data Sync Status:</p>
              <p>• Encryption: TLS 1.3 with client certs</p>
              <p>• Buffer: Local circular RAM (10,000 frames)</p>
              <p>• Latency: &lt; 8 ms local CAN bridge</p>
            </div>
          </div>
        </div>

        {/* Export & Data Logging */}
        <div className="bms-card rounded-2xl p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-950/60">
            <span className="font-tech text-sm font-bold text-slate-200 uppercase">Data Logging & Telemetry Export</span>
            <Database className="h-4 w-4 text-cyan-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <h4 className="font-tech text-sm font-bold text-slate-200">Export Full BMS JSON Snapshot</h4>
              <p className="text-xs text-slate-400">
                Downloads complete pack snapshot with all 20 cell voltages, 4 thermistors, alarm states, and contactor registers.
              </p>
              <button
                onClick={exportJson}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-tech font-bold uppercase text-xs transition shadow"
              >
                <Download className="h-4 w-4" />
                Download JSON Telemetry
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <h4 className="font-tech text-sm font-bold text-slate-200">Export 20S Cell Voltages CSV</h4>
              <p className="text-xs text-slate-400">
                Exports tabular CSV format suitable for MATLAB, Python pandas, or battery cycle degradation modeling.
              </p>
              <button
                onClick={exportCsv}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-tech font-bold uppercase text-xs transition border border-cyan-500/30"
              >
                <Download className="h-4 w-4" />
                Download Cell Voltages CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
