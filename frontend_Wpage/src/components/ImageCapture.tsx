import { useState, useCallback, useEffect } from "react";
import { ImagePlus, Trash2, X } from "lucide-react";
import { Button } from "./ui/button";
import { useCamera } from "@/hooks/useCamera";
import { detectShapes, ShapeDetection } from "@/services/shapeDetection";
import { DrawingCanvas } from "./DrawingCanvas";

export function ImageCapture() {
  const { imageUrl, setImageUrl, takePicture, uploadImage } = useCamera();
  const [detectedShapes, setDetectedShapes] = useState<ShapeDetection[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [isOpenCvLoading, setIsOpenCvLoading] = useState(false);

  // Load OpenCV.js on component mount
  useEffect(() => {
    // @ts-ignore
    if (typeof cv === 'undefined') {
      setIsOpenCvLoading(true);
      const script = document.createElement('script');
      script.src = 'https://docs.opencv.org/4.7.0/opencv.js';
      script.async = true;
      script.id = 'opencv-script';
      script.onload = () => {
        setIsOpenCvLoading(false);
      };
      document.head.appendChild(script);
    }
  }, []);

  const processImage = useCallback(async (imagePath: string) => {
    setImageUrl(imagePath);
    const img = new Image();
    img.src = imagePath;
    img.onload = async () => {
      setIsProcessing(true);
      const shapes = await detectShapes(img);
      setDetectedShapes(shapes);
      if (shapes[0].shape === 'No shapes detected' || shapes[0].shape === 'Shape detection failed') {
        setIsManualMode(true);
      }
      setIsProcessing(false);
    };
  }, [setImageUrl]);

  const handleTakePicture = async () => {
    const imagePath = await takePicture();
    if (imagePath) {
      await processImage(imagePath);
    }
  };

  const handleUploadImage = async () => {
    const imagePath = await uploadImage();
    if (imagePath) {
      await processImage(imagePath);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setDetectedShapes([]);
    setIsManualMode(false);
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {imageUrl && !isManualMode && (
        <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden bg-gray-100">
          <img 
            src={imageUrl} 
            alt="Captured" 
            className="w-full h-full object-cover"
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
            onClick={handleRemoveImage}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      {imageUrl && isManualMode && <DrawingCanvas imageUrl={imageUrl} />}
      
      {detectedShapes.length > 0 && !isProcessing && !isManualMode && (
        <div className="flex gap-2">
          {detectedShapes.map((shapeDetection, index) => (
            <div 
              key={index} 
              className="px-3 py-1 rounded-full text-sm"
              style={{ 
                backgroundColor: `${shapeDetection.color}20`, 
                color: shapeDetection.color 
              }}
            >
              {shapeDetection.shape}
            </div>
          ))}
        </div>
      )}
      
      {(isProcessing || isOpenCvLoading) && (
        <div className="text-purple-300">
          {isOpenCvLoading ? "Loading OpenCV..." : "Processing image..."}
        </div>
      )}

      {!isManualMode && (
        <div className="flex gap-4">
          {!imageUrl ? (
            <>
              <Button
                variant="outline"
                onClick={handleTakePicture}
                className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                disabled={isOpenCvLoading}
              >
                <ImagePlus className="w-5 h-5" />
                Take Picture
              </Button>
              
              <Button
                variant="outline"
                onClick={handleUploadImage}
                className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                disabled={isOpenCvLoading}
              >
                <ImagePlus className="w-5 h-5" />
                Upload Image
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={handleTakePicture}
              className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
              disabled={isOpenCvLoading}
            >
              <ImagePlus className="w-5 h-5" />
              New Image
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
