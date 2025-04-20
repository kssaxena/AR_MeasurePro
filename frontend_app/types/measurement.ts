export interface Point {
  x: number;
  y: number;
}

export interface Line {
  id: string;
  startPoint: Point;
  endPoint: Point;
  pixelLength: number;
  realLength?: number; // in mm
}

export interface Measurement {
  id: string;
  imageUri: string;
  lines: Line[];
  createdAt: number;
  name: string;
  calibrationFactor?: number; // pixels per mm
}
