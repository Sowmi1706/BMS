import { BMSTelemetry, BMSAlarmKey } from '../types/bms';

export const INITIAL_BMS_TELEMETRY: BMSTelemetry = {
  // 1. Battery Overview
  soc: 92.8,
  packVoltage: 81.4,
  packCurrent: 0.0,
  batteryCapacity: 27,
  batteryConfiguration: '20S',
  temperatureSensorsCount: 4,

  // 2. Battery Status Cards
  maxCellVoltage: 4.079,
  maxCellNumber: 15,
  minCellVoltage: 4.071,
  minCellNumber: 7,
  maxTemperature: 29,
  maxTemperatureSensor: 3,
  minTemperature: 28,
  minTemperatureSensor: 1,

  // 3. Charging and Load Status
  chargingLoad: {
    chargerState: 'OFF / Not Connected',
    chargerStatus: 'OFF',
    loadStatus: 'OFF',
    cellBalancing: 'OFF',
    prechargeRelay: false,
    mainPosRelay: false,
    mainNegRelay: false,
  },

  // 4. Individual 20S Cell Voltages (exact prompt specifications)
  cells: [
    { id: 1, voltage: 4.072, internalResistanceMilliOhm: 1.22, status: 'optimal' },
    { id: 2, voltage: 4.073, internalResistanceMilliOhm: 1.20, status: 'optimal' },
    { id: 3, voltage: 4.072, internalResistanceMilliOhm: 1.24, status: 'optimal' },
    { id: 4, voltage: 4.073, internalResistanceMilliOhm: 1.21, status: 'optimal' },
    { id: 5, voltage: 4.072, internalResistanceMilliOhm: 1.23, status: 'optimal' },
    { id: 6, voltage: 4.073, internalResistanceMilliOhm: 1.22, status: 'optimal' },
    { id: 7, voltage: 4.071, internalResistanceMilliOhm: 1.25, status: 'lowest' }, // Lowest voltage cell
    { id: 8, voltage: 4.075, internalResistanceMilliOhm: 1.19, status: 'optimal' },
    { id: 9, voltage: 4.073, internalResistanceMilliOhm: 1.21, status: 'optimal' },
    { id: 10, voltage: 4.073, internalResistanceMilliOhm: 1.20, status: 'optimal' },
    { id: 11, voltage: 4.076, internalResistanceMilliOhm: 1.18, status: 'optimal' },
    { id: 12, voltage: 4.072, internalResistanceMilliOhm: 1.23, status: 'optimal' },
    { id: 13, voltage: 4.072, internalResistanceMilliOhm: 1.22, status: 'optimal' },
    { id: 14, voltage: 4.074, internalResistanceMilliOhm: 1.20, status: 'optimal' },
    { id: 15, voltage: 4.079, internalResistanceMilliOhm: 1.15, status: 'highest' }, // Configured max voltage cell
    { id: 16, voltage: 4.079, internalResistanceMilliOhm: 1.16, status: 'optimal' },
    { id: 17, voltage: 4.077, internalResistanceMilliOhm: 1.18, status: 'optimal' },
    { id: 18, voltage: 4.077, internalResistanceMilliOhm: 1.17, status: 'optimal' },
    { id: 19, voltage: 4.078, internalResistanceMilliOhm: 1.16, status: 'optimal' },
    { id: 20, voltage: 4.075, internalResistanceMilliOhm: 1.19, status: 'optimal' },
  ],

  // 5. Temperature Monitoring (4 sensors)
  temperatureSensors: [
    { id: 1, name: 'Temp Sensor 1', location: 'Pack Front-Left Zone', temperature: 28, status: 'normal' },
    { id: 2, name: 'Temp Sensor 2', location: 'Pack Front-Right Zone', temperature: 28, status: 'normal' },
    { id: 3, name: 'Temp Sensor 3', location: 'Pack Core Center Zone', temperature: 29, status: 'normal' },
    { id: 4, name: 'Temp Sensor 4', location: 'Pack Rear Exhaust Zone', temperature: 29, status: 'normal' },
  ],

  // 7. Alarm and Safety Section (All values 0 = NORMAL / NO FAULT)
  alarms: {
    singleCellHighVoltage: 0,
    singleCellLowVoltage: 0,
    totalPackHighVoltage: 0,
    totalPackLowVoltage: 0,
    chargeHighTemperature: 0,
    chargeLowTemperature: 0,
    dischargeHighTemperature: 0,
    chargeOvercurrent: 0,
    dischargeOvercurrent: 0,
    socHigh: 0,
    socLow: 0,
  },

  // Extended telemetry details
  stateOfHealth: 99.4,
  cycleCount: 42,
  packPowerKw: 0.0,
  packEnergyKwh: 2.2, // ~ 81.4V * 27Ah = ~2197.8 Wh
  estimatedRangeKm: 185,
  insulationResistanceKOhm: 520,
  canBusHealth: 'OK',
  lastUpdated: new Date().toLocaleTimeString(),
};

export const ALARM_DEFINITIONS: BMSAlarmKey[] = [
  {
    key: 'singleCellHighVoltage',
    label: 'Single Cell High Voltage Alarm',
    category: 'voltage',
    code: 'ALM_01_OV_CELL',
    status: 'NORMAL',
    value: 0,
    description: 'Triggered if any cell exceeds 4.250 V for >500ms.',
  },
  {
    key: 'singleCellLowVoltage',
    label: 'Single Cell Low Voltage Alarm',
    category: 'voltage',
    code: 'ALM_02_UV_CELL',
    status: 'NORMAL',
    value: 0,
    description: 'Triggered if any cell drops below 2.800 V under load.',
  },
  {
    key: 'totalPackHighVoltage',
    label: 'Total Pack High Voltage Alarm',
    category: 'voltage',
    code: 'ALM_03_OV_PACK',
    status: 'NORMAL',
    value: 0,
    description: 'Triggered if total pack exceeds 84.5 V.',
  },
  {
    key: 'totalPackLowVoltage',
    label: 'Total Pack Low Voltage Alarm',
    category: 'voltage',
    code: 'ALM_04_UV_PACK',
    status: 'NORMAL',
    value: 0,
    description: 'Triggered if total pack falls below 60.0 V.',
  },
  {
    key: 'chargeHighTemperature',
    label: 'Charge High Temperature Alarm',
    category: 'temperature',
    code: 'ALM_05_OT_CHG',
    status: 'NORMAL',
    value: 0,
    description: 'Triggered if charging temp exceeds 45.0 °C.',
  },
  {
    key: 'chargeLowTemperature',
    label: 'Charge Low Temperature Alarm',
    category: 'temperature',
    code: 'ALM_06_UT_CHG',
    status: 'NORMAL',
    value: 0,
    description: 'Triggered if charging temp is below 0.0 °C (lithium plating prevention).',
  },
  {
    key: 'dischargeHighTemperature',
    label: 'Discharge High Temperature Alarm',
    category: 'temperature',
    code: 'ALM_07_OT_DSG',
    status: 'NORMAL',
    value: 0,
    description: 'Triggered if discharge temp exceeds 60.0 °C.',
  },
  {
    key: 'chargeOvercurrent',
    label: 'Charge Overcurrent Alarm',
    category: 'current',
    code: 'ALM_08_OC_CHG',
    status: 'NORMAL',
    value: 0,
    description: 'Triggered if charge current exceeds +45.0 A continuous.',
  },
  {
    key: 'dischargeOvercurrent',
    label: 'Discharge Overcurrent Alarm',
    category: 'current',
    code: 'ALM_09_OC_DSG',
    status: 'NORMAL',
    value: 0,
    description: 'Triggered if discharge current exceeds -120.0 A peak.',
  },
  {
    key: 'socHigh',
    label: 'SOC High Alarm',
    category: 'soc',
    code: 'ALM_10_SOC_HIGH',
    status: 'NORMAL',
    value: 0,
    description: 'Triggered if calculated SOC exceeds 100.5 %.',
  },
  {
    key: 'socLow',
    label: 'SOC Low Alarm',
    category: 'soc',
    code: 'ALM_11_SOC_LOW',
    status: 'NORMAL',
    value: 0,
    description: 'Triggered if calculated SOC falls below 5.0 % (reserve depletion).',
  },
];
