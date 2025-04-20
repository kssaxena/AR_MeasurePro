export type Unit = {
  name: string;
  shortName: string;
  conversionFactor: number; // relative to mm
};

export const units: Record<string, Unit> = {
  millimeter: {
    name: "Millimeter",
    shortName: "mm",
    conversionFactor: 1,
  },
  centimeter: {
    name: "Centimeter",
    shortName: "cm",
    conversionFactor: 10,
  },
  meter: {
    name: "Meter",
    shortName: "m",
    conversionFactor: 1000,
  },
  inch: {
    name: "Inch",
    shortName: "in",
    conversionFactor: 25.4,
  },
  foot: {
    name: "Foot",
    shortName: "ft",
    conversionFactor: 304.8,
  },
};

export const defaultUnit = "centimeter";
