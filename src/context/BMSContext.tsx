import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BMSTelemetry, SimulationMode, ActiveTab } from '../types/bms';
import { INITIAL_BMS_TELEMETRY } from '../data/initialBmsData';
import { vehicleApi } from '../services/vehicleApi';
import {
  validateFirestoreConnection,
  subscribeToVehicle,
  saveVehicleToFirestore
} from '../lib/firebase';

interface BMSContextType {
  telemetry: BMSTelemetry;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  simulationMode: SimulationMode;
  setSimulationMode: (mode: SimulationMode) => void;
  isSimulating: boolean;
  setIsSimulating: (val: boolean) => void;
  history: {
    timestamps: string[];
    packVoltages: number[];
    packCurrents: number[];
    packTemperatures: number[];
    socHistory: number[];
  };
  toggleCharger: () => void;
  toggleLoad: () => void;
  toggleBalancing: () => void;
  injectAlarm: (alarmKey: keyof BMSTelemetry['alarms'], active: boolean) => void;
  resetToDefault: () => void;
  canFrameCount: number;
  selectedCellId: number | null;
  setSelectedCellId: (id: number | null) => void;
  // Backend EV / Scooty Controller integration
  vehicleSpeed: number;
  isVehicleOn: boolean;
  isHeadlightOn: boolean;
  isFirestoreConnected: boolean;
  toggleVehiclePower: () => Promise<void>;
  toggleHeadlight: () => Promise<void>;
}

const BMSContext = createContext<BMSContextType | undefined>(undefined);

export const BMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [telemetry, setTelemetry] = useState<BMSTelemetry>(INITIAL_BMS_TELEMETRY);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('static');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [canFrameCount, setCanFrameCount] = useState<number>(142980);
  const [selectedCellId, setSelectedCellId] = useState<number | null>(null);

  // Backend EV Scooty states
  const [vehicleSpeed, setVehicleSpeed] = useState<number>(0);
  const [isVehicleOn, setIsVehicleOn] = useState<boolean>(false);
  const [isHeadlightOn, setIsHeadlightOn] = useState<boolean>(false);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(false);

  // Historical data points for Chart.js
  const [history, setHistory] = useState<{
    timestamps: string[];
    packVoltages: number[];
    packCurrents: number[];
    packTemperatures: number[];
    socHistory: number[];
  }>(() => {
    // Generate 12 past points for smooth initial charts
    const now = new Date();
    const timestamps = [];
    const packVoltages = [];
    const packCurrents = [];
    const packTemperatures = [];
    const socHistory = [];

    for (let i = 11; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 5000);
      timestamps.push(t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      packVoltages.push(81.4 + (Math.sin(i) * 0.05));
      packCurrents.push(0);
      packTemperatures.push(28.5 + (Math.cos(i) * 0.2));
      socHistory.push(92.8);
    }

    return { timestamps, packVoltages, packCurrents, packTemperatures, socHistory };
  });

  // Toggles
  const toggleCharger = useCallback(() => {
    setTelemetry(prev => {
      const isOff = prev.chargingLoad.chargerStatus === 'OFF';
      return {
        ...prev,
        chargingLoad: {
          ...prev.chargingLoad,
          chargerState: isOff ? 'ACTIVE / CC Mode 40A' : 'OFF / Not Connected',
          chargerStatus: isOff ? 'ON' : 'OFF',
          mainPosRelay: isOff,
        },
        packCurrent: isOff ? 25.4 : 0.0,
      };
    });
  }, []);

  const toggleLoad = useCallback(() => {
    setTelemetry(prev => {
      const isOff = prev.chargingLoad.loadStatus === 'OFF';
      const nextStatus = isOff ? 'ON' : 'OFF';
      setIsVehicleOn(isOff);
      vehicleApi.setVehiclePower(isOff).catch(() => {});
      return {
        ...prev,
        chargingLoad: {
          ...prev.chargingLoad,
          loadStatus: nextStatus,
          mainNegRelay: isOff,
        },
        packCurrent: isOff ? -36.8 : 0.0,
      };
    });
  }, []);

  const toggleVehiclePower = useCallback(async () => {
    const nextPower = !isVehicleOn;
    setIsVehicleOn(nextPower);
    if (!nextPower) setVehicleSpeed(0);
    setTelemetry(prev => ({
      ...prev,
      chargingLoad: {
        ...prev.chargingLoad,
        loadStatus: nextPower ? 'ON' : 'OFF',
        mainNegRelay: nextPower,
      },
      packCurrent: nextPower ? -18.5 : 0.0,
    }));
    try {
      saveVehicleToFirestore('default-scooty', {
        isVehicleOn: nextPower,
        vehicleStatus: nextPower ? 'ON' : 'OFF',
        ...(nextPower ? {} : { speed: 0 })
      }).catch(() => {});
      await vehicleApi.setVehiclePower(nextPower);
    } catch (err) {
      console.warn('Backend sync notice (offline or local fallback):', err);
    }
  }, [isVehicleOn]);

  const toggleHeadlight = useCallback(async () => {
    const nextHeadlight = !isHeadlightOn;
    setIsHeadlightOn(nextHeadlight);
    try {
      saveVehicleToFirestore('default-scooty', {
        isHeadlightOn: nextHeadlight,
        headlightStatus: nextHeadlight ? 'ON' : 'OFF'
      }).catch(() => {});
      await vehicleApi.setHeadlight(nextHeadlight);
    } catch (err) {
      console.warn('Backend sync notice (offline or local fallback):', err);
    }
  }, [isHeadlightOn]);

  const toggleBalancing = useCallback(() => {
    setTelemetry(prev => {
      const isOff = prev.chargingLoad.cellBalancing === 'OFF';
      const newBalancing = isOff ? 'ON' : 'OFF';
      const updatedCells = prev.cells.map(c => ({
        ...c,
        isBalancing: isOff && c.voltage >= 4.077,
      }));
      return {
        ...prev,
        chargingLoad: {
          ...prev.chargingLoad,
          cellBalancing: newBalancing,
        },
        cells: updatedCells,
      };
    });
  }, []);

  const injectAlarm = useCallback((alarmKey: keyof BMSTelemetry['alarms'], active: boolean) => {
    setTelemetry(prev => ({
      ...prev,
      alarms: {
        ...prev.alarms,
        [alarmKey]: active ? 1 : 0,
      },
    }));
  }, []);

  const resetToDefault = useCallback(() => {
    setTelemetry(INITIAL_BMS_TELEMETRY);
    setSimulationMode('static');
    setIsSimulating(false);
    setIsVehicleOn(false);
    setIsHeadlightOn(false);
    setVehicleSpeed(0);
    saveVehicleToFirestore('default-scooty', {
      batteryPercentage: 92.8,
      speed: 0,
      temperature: 29.0,
      isVehicleOn: false,
      vehicleStatus: 'OFF',
      isHeadlightOn: false,
      headlightStatus: 'OFF'
    }).catch(() => {});
    vehicleApi.reset().catch(() => {});
  }, []);

  // Validate Firestore on boot and subscribe to real-time updates
  useEffect(() => {
    let unsubscribeFirestore: (() => void) | null = null;
    let isMounted = true;

    validateFirestoreConnection().then((connected) => {
      if (isMounted) setIsFirestoreConnected(connected);
    });

    try {
      unsubscribeFirestore = subscribeToVehicle(
        'default-scooty',
        (v) => {
          if (!isMounted) return;
          setIsFirestoreConnected(true);
          setIsVehicleOn(v.isVehicleOn);
          setIsHeadlightOn(v.isHeadlightOn);
          setVehicleSpeed(v.speed);
          setTelemetry(prev => ({
            ...prev,
            soc: v.batteryPercentage,
            maxTemperature: v.temperature,
            chargingLoad: {
              ...prev.chargingLoad,
              loadStatus: v.isVehicleOn ? 'ON' : 'OFF',
              mainNegRelay: v.isVehicleOn,
            }
          }));
        },
        (err) => {
          console.warn('Firestore subscription notice:', err?.message || err);
        }
      );
    } catch (e) {
      console.warn('Firestore live listener notice:', e);
    }

    // Also poll backend API as fallback/secondary sync
    const fetchBackendData = async () => {
      try {
        const response = await vehicleApi.getLatest();
        if (response.success && response.data && isMounted) {
          const v = response.data;
          setIsVehicleOn(v.isVehicleOn);
          setIsHeadlightOn(v.isHeadlightOn);
          setVehicleSpeed(v.speed);
        }
      } catch {
        // Backend offline or local standalone mode
      }
    };

    const syncInterval = setInterval(fetchBackendData, 5000);

    return () => {
      isMounted = false;
      if (unsubscribeFirestore) unsubscribeFirestore();
      clearInterval(syncInterval);
    };
  }, []);

  // Real-time tick effect (CAN bus streaming & simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      setCanFrameCount(c => c + 14);

      if (simulationMode === 'static' && !isSimulating) {
        return;
      }

      setTelemetry(prev => {
        let newCurrent = prev.packCurrent;
        let newSoc = prev.soc;
        let newTemp1 = prev.temperatureSensors[0].temperature;
        let newTemp3 = prev.temperatureSensors[2].temperature;

        if (simulationMode === 'fast-charging') {
          newCurrent = 38.5 + (Math.random() * 1.2 - 0.6);
          newSoc = Math.min(100, prev.soc + 0.02);
          newTemp1 = 29.5;
          newTemp3 = 31.8;
        } else if (simulationMode === 'sport-drive') {
          newCurrent = -54.0 + (Math.random() * 15.0 - 7.5);
          newSoc = Math.max(0, prev.soc - 0.03);
          newTemp3 = 33.2;
        } else if (simulationMode === 'live-idle' || isSimulating) {
          newCurrent = 0.0;
        }

        // Sub-millivolt jitter on cells for authentic industrial BMS feel
        const updatedCells = prev.cells.map(c => {
          let v = c.voltage;
          if (simulationMode === 'fast-charging') {
            v = Math.min(4.18, c.voltage + 0.0003 + (Math.random() * 0.0004));
          } else if (simulationMode === 'sport-drive') {
            v = Math.max(3.85, c.voltage - 0.0004 - (Math.random() * 0.0006));
          } else if (simulationMode === 'cell-balancing-test') {
            if (c.id === 15 || c.id === 16) {
              v = Math.max(4.072, c.voltage - 0.0002);
            }
          }
          return { ...c, voltage: Number(v.toFixed(3)) };
        });

        // Recalculate max & min cells
        let maxV = updatedCells[0].voltage;
        let maxId = updatedCells[0].id;
        let minV = updatedCells[0].voltage;
        let minId = updatedCells[0].id;
        let totalV = 0;

        updatedCells.forEach(cell => {
          totalV += cell.voltage;
          if (cell.voltage > maxV) {
            maxV = cell.voltage;
            maxId = cell.id;
          }
          if (cell.voltage < minV) {
            minV = cell.voltage;
            minId = cell.id;
          }
        });

        const newPackVoltage = Number(totalV.toFixed(1));

        return {
          ...prev,
          soc: Number(newSoc.toFixed(1)),
          packVoltage: newPackVoltage,
          packCurrent: Number(newCurrent.toFixed(1)),
          packPowerKw: Number(((newPackVoltage * newCurrent) / 1000).toFixed(2)),
          maxCellVoltage: maxV,
          maxCellNumber: maxId,
          minCellVoltage: minV,
          minCellNumber: minId,
          cells: updatedCells.map(c => ({
            ...c,
            status: c.id === maxId ? 'highest' : c.id === minId ? 'lowest' : 'optimal',
          })),
          lastUpdated: new Date().toLocaleTimeString(),
        };
      });

      // Update Chart.js history buffer
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setHistory(prevHist => {
        const timestamps = [...prevHist.timestamps.slice(1), nowStr];
        const packVoltages = [...prevHist.packVoltages.slice(1), telemetry.packVoltage];
        const packCurrents = [...prevHist.packCurrents.slice(1), telemetry.packCurrent];
        const packTemperatures = [...prevHist.packTemperatures.slice(1), telemetry.maxTemperature];
        const socHistory = [...prevHist.socHistory.slice(1), telemetry.soc];
        return { timestamps, packVoltages, packCurrents, packTemperatures, socHistory };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [simulationMode, isSimulating, telemetry.packVoltage, telemetry.packCurrent, telemetry.maxTemperature, telemetry.soc]);

  return (
    <BMSContext.Provider
      value={{
        telemetry,
        activeTab,
        setActiveTab,
        simulationMode,
        setSimulationMode,
        isSimulating,
        setIsSimulating,
        history,
        toggleCharger,
        toggleLoad,
        toggleBalancing,
        injectAlarm,
        resetToDefault,
        canFrameCount,
        selectedCellId,
        setSelectedCellId,
        vehicleSpeed,
        isVehicleOn,
        isHeadlightOn,
        isFirestoreConnected,
        toggleVehiclePower,
        toggleHeadlight,
      }}
    >
      {children}
    </BMSContext.Provider>
  );
};

export const useBMS = () => {
  const context = useContext(BMSContext);
  if (!context) {
    throw new Error('useBMS must be used within a BMSProvider');
  }
  return context;
};
