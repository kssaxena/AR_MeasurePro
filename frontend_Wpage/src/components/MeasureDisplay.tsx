import { Scale, Ruler } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ImageCapture } from "./ImageCapture";

export function MeasureDisplay() {
  const [measurement, setMeasurement] = useState<number>(0);
  const [unit, setUnit] = useState<"cm" | "in" | "m">("cm");

  const handleUnitChange = () => {
    const units: ("cm" | "in" | "m")[] = ["cm", "in", "m"];
    const currentIndex = units.indexOf(unit);
    const nextIndex = (currentIndex + 1) % units.length;
    setUnit(units[nextIndex]);
  };

  const handleMeasurementChange = (value: number) => {
    setMeasurement(value);
  };

  const getDisplayValue = () => {
    switch (unit) {
      case "in":
        return `${(measurement / 2.54).toFixed(1)} in`;
      case "m":
        return `${(measurement / 100).toFixed(2)} m`;
      default:
        return `${measurement.toFixed(1)} cm`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <Scale className="w-8 h-8 text-purple-400" />
        <h1 className="text-2xl font-medium text-gray-100">Measure</h1>
      </div>
      
      <ImageCapture />
      
      <div className="relative w-full mt-6">
        <div 
          className="text-5xl font-light text-center text-white mb-4 transition-all"
          onClick={handleUnitChange}
        >
          {getDisplayValue()}
        </div>

        <input
          type="range"
          min="0"
          max="300"
          value={measurement}
          onChange={(e) => handleMeasurementChange(Number(e.target.value))}
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
            "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
          )}
          onClick={() => setMeasurement(0)}
        >
          <Ruler className="w-5 h-5" />
          Reset
        </button>
      </div>
    </div>
  );
}
