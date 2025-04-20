import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Measurement, Line } from "@/types/measurement";
import { defaultUnit } from "@/constants/units";

interface MeasureState {
  measurements: Measurement[];
  currentMeasurement: Measurement | null;
  preferredUnit: string;
  calibrationFactor: number | null; // pixels per mm
  addMeasurement: (measurement: Measurement) => void;
  updateMeasurement: (id: string, measurement: Partial<Measurement>) => void;
  deleteMeasurement: (id: string) => void;
  setCurrentMeasurement: (measurement: Measurement | null) => void;
  addLine: (line: Line) => void;
  updateLine: (lineId: string, line: Partial<Line>) => void;
  deleteLine: (lineId: string) => void;
  setPreferredUnit: (unit: string) => void;
  setCalibrationFactor: (factor: number | null) => void;
}

export const useMeasureStore = create<MeasureState>()(
  persist(
    (set) => ({
      measurements: [],
      currentMeasurement: null,
      preferredUnit: defaultUnit,
      calibrationFactor: null,

      addMeasurement: (measurement) =>
        set((state) => ({
          measurements: [...state.measurements, measurement],
        })),

      updateMeasurement: (id, updatedMeasurement) =>
        set((state) => ({
          measurements: state.measurements.map((m) =>
            m.id === id ? { ...m, ...updatedMeasurement } : m
          ),
          currentMeasurement:
            state.currentMeasurement?.id === id
              ? { ...state.currentMeasurement, ...updatedMeasurement }
              : state.currentMeasurement,
        })),

      deleteMeasurement: (id) =>
        set((state) => ({
          measurements: state.measurements.filter((m) => m.id !== id),
          currentMeasurement:
            state.currentMeasurement?.id === id
              ? null
              : state.currentMeasurement,
        })),

      setCurrentMeasurement: (measurement) =>
        set(() => ({ currentMeasurement: measurement })),

      addLine: (line) =>
        set((state) => {
          if (!state.currentMeasurement) return state;

          const updatedMeasurement = {
            ...state.currentMeasurement,
            lines: [...state.currentMeasurement.lines, line],
          };

          return {
            currentMeasurement: updatedMeasurement,
            measurements: state.measurements.map((m) =>
              m.id === updatedMeasurement.id ? updatedMeasurement : m
            ),
          };
        }),

      updateLine: (lineId, updatedLine) =>
        set((state) => {
          if (!state.currentMeasurement) return state;

          const updatedLines = state.currentMeasurement.lines.map((line) =>
            line.id === lineId ? { ...line, ...updatedLine } : line
          );

          const updatedMeasurement = {
            ...state.currentMeasurement,
            lines: updatedLines,
          };

          return {
            currentMeasurement: updatedMeasurement,
            measurements: state.measurements.map((m) =>
              m.id === updatedMeasurement.id ? updatedMeasurement : m
            ),
          };
        }),

      deleteLine: (lineId) =>
        set((state) => {
          if (!state.currentMeasurement) return state;

          const updatedLines = state.currentMeasurement.lines.filter(
            (line) => line.id !== lineId
          );

          const updatedMeasurement = {
            ...state.currentMeasurement,
            lines: updatedLines,
          };

          return {
            currentMeasurement: updatedMeasurement,
            measurements: state.measurements.map((m) =>
              m.id === updatedMeasurement.id ? updatedMeasurement : m
            ),
          };
        }),

      setPreferredUnit: (unit) => set(() => ({ preferredUnit: unit })),

      setCalibrationFactor: (factor) =>
        set(() => ({ calibrationFactor: factor })),
    }),
    {
      name: "measure-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
