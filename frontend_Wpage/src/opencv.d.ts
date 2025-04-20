
declare namespace cv {
  class Mat {
    rows: number;
    cols: number;
    data: Uint8Array;
    data32S: Int32Array;  // Add this property for contour data
    delete(): void;
  }
  
  class MatVector {
    size(): number;
    get(index: number): Mat;
    delete(): void;
  }
  
  class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
  }
  
  function imread(canvas: HTMLCanvasElement): Mat;
  function imshow(canvas: HTMLCanvasElement, mat: Mat): void;
  function cvtColor(src: Mat, dst: Mat, code: number): void;
  function threshold(src: Mat, dst: Mat, thresh: number, maxval: number, type: number): void;
  function findContours(image: Mat, contours: MatVector, hierarchy: Mat, mode: number, method: number): void;
  function arcLength(curve: Mat, closed: boolean): number;
  function approxPolyDP(curve: Mat, approxCurve: Mat, epsilon: number, closed: boolean): void;
  function contourArea(contour: Mat): number;
  function boundingRect(contour: Mat): { x: number, y: number, width: number, height: number };
  function minEnclosingCircle(contour: Mat): { center: Point, radius: number };
  
  const COLOR_RGBA2GRAY: number;
  const THRESH_BINARY: number;
  const RETR_CCOMP: number;
  const CHAIN_APPROX_SIMPLE: number;
}

interface Window {
  cv: typeof cv;
  onOpenCvReady?: () => void;
}
