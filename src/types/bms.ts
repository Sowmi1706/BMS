export interface CellData {
  id: number;
  voltage: number;
  internalResistanceMilliOhm?: number;
  isBalancing?: boolean;
  status: 'optimal' | 'warning' | 'critical' | 'lowest' | 'highest';
}

export interface TemperatureSensor {
  id: number;
  name: string;
  location: string;
  temperature: number; // in °C
  status: 'normal' | 'warm' | 'overheat';
}

export interface BMSAlarmKey {
  key: string;
  label: string;
  category: 'voltage' | 'temperature' | 'current' | 'soc';
  code: string;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  value: number; // 0 = Normal / No fault
  description: string;
}

export interface BMSAlarms {
  singleCellHighVoltage: number; // 0 = Normal
  singleCellLowVoltage: number;
  totalPackHighVoltage: number;
  totalPackLowVoltage: number;
  chargeHighTemperature: number;
  chargeLowTemperature: number;
  dischargeHighTemperature: number;
  chargeOvercurrent: number;
  dischargeOvercurrent: number;
  socHigh: number;
  socLow: number;
}

export interface ChargingLoadState {
  chargerState: string; // "OFF / Not Connected"
  chargerStatus: 'OFF' | 'ON' | 'STANDBY';
  loadStatus: 'OFF' | 'ON' | 'REGEN';
  cellBalancing: 'OFF' | 'ON' | 'AUTO';
  prechargeRelay: boolean;
  mainPosRelay: boolean;
  mainNegRelay: boolean;
}

export interface BMSTelemetry {
  // Core overview
  soc: number; // 92.8 %
  packVoltage: number; // 81.4 V
  packCurrent: number; // 0 A
  batteryCapacity: number; // 27 Ah
  batteryConfiguration: string; // "20S"
  temperatureSensorsCount: number; // 4

  // Status metrics
  maxCellVoltage: number; // 4.079 V
  maxCellNumber: number; // 15
  minCellVoltage: number; // 4.071 V
  minCellNumber: number; // 7
  maxTemperature: number; // 29 °C
  maxTemperatureSensor: number; // 3
  minTemperature: number; // 28 °C
  minTemperatureSensor: number; // 1

  // Detailed lists
  cells: CellData[];
  temperatureSensors: TemperatureSensor[];
  chargingLoad: ChargingLoadState;
  alarms: BMSAlarms;

  // Extended telemetry
  stateOfHealth: number; // 99.4 %
  cycleCount: number; // 42
  packPowerKw: number; // 0 kW
  packEnergyKwh: number; // 2.2 kWh
  estimatedRangeKm: number; // 185 km
  insulationResistanceKOhm: number; // 520 kOhm
  canBusHealth: 'OK' | 'BUS_OFF' | 'WARNING';
  lastUpdated: string;
}

export type ActiveTab = 
  | 'dashboard' 
  | 'battery-monitor' 
  | 'cell-voltages' 
  | 'temperature' 
  | 'charging' 
  | 'alerts' 
  | 'settings';

export type SimulationMode = 
  | 'static' 
  | 'live-idle' 
  | 'fast-charging' 
  | 'sport-drive' 
  | 'eco-cruise' 
  | 'cell-balancing-test';
