
import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { Button } from "./ui/button";
import { PenTool, X } from "lucide-react";

interface DrawingCanvasProps {
  imageUrl: string;
}

export const DrawingCanvas = ({ imageUrl }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current && imageUrl) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        width: 400,
        height: 400,
        isDrawingMode: true
      });

      if (fabricCanvasRef.current.freeDrawingBrush) {
        fabricCanvasRef.current.freeDrawingBrush.color = '#9b87f5';
        fabricCanvasRef.current.freeDrawingBrush.width = 2;
      }

      fabric.Image.fromURL(imageUrl, (img) => {
        img.scaleToWidth(400);
        fabricCanvasRef.current?.setBackgroundImage(img, () => {
          fabricCanvasRef.current?.renderAll();
        });
      });

      return () => {
        fabricCanvasRef.current?.dispose();
      };
    }
  }, [imageUrl]);

  const handleClearSelection = () => {
    if (fabricCanvasRef.current) {
      const backgroundImage = fabricCanvasRef.current.backgroundImage;
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.setBackgroundImage(backgroundImage, () => {
        fabricCanvasRef.current?.renderAll();
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="relative w-full max-w-md rounded-lg overflow-hidden bg-gray-100">
        <canvas ref={canvasRef} />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
          onClick={handleClearSelection}
        >
          <X className="w-5 h-5 mr-2" />
          Clear Selection
        </Button>
      </div>
    </div>
  );
};
