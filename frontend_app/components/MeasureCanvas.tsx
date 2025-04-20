import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Platform,
  StyleSheet,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Svg, {
  Line as SvgLine,
  Circle,
  Text as SvgText,
} from "react-native-svg";
import { useMeasureStore } from "@/store/measureStore";
import { Line, Point } from "@/types/measurement";
import { units } from "@/constants/units";
import { Trash2, Ruler, Plus, Minus } from "lucide-react-native";
import { colors } from "@/constants/colors";

interface MeasureCanvasProps {
  imageUri: string;
  onClose: () => void;
}

const MeasureCanvas: React.FC<MeasureCanvasProps> = ({ imageUri, onClose }) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentEndPoint, setCurrentEndPoint] = useState<Point | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationValue, setCalibrationValue] = useState<number | null>(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<View>(null);

  const {
    currentMeasurement,
    addLine,
    calibrationFactor,
    setCalibrationFactor,
    preferredUnit,
  } = useMeasureStore();

  useEffect(() => {
    if (imageUri) {
      Image.getSize(
        imageUri,
        (width, height) => {
          setImageSize({ width, height });
        },
        (error) => console.error("Error getting image size:", error)
      );
    }
  }, [imageUri]);

  useEffect(() => {
    if (
      imageSize.width > 0 &&
      imageSize.height > 0 &&
      canvasSize.width > 0 &&
      canvasSize.height > 0
    ) {
      calculateImageScaleAndPosition();
    }
  }, [imageSize, canvasSize]);

  const calculateImageScaleAndPosition = () => {
    const { width: imgWidth, height: imgHeight } = imageSize;
    const { width: canvasWidth, height: canvasHeight } = canvasSize;

    // Calculate scale to fit image within canvas while maintaining aspect ratio
    const widthScale = canvasWidth / imgWidth;
    const heightScale = canvasHeight / imgHeight;
    const newScale = Math.min(widthScale, heightScale, 1); // Limit scale to 1 (original size)

    // Calculate position to center the image
    const scaledWidth = imgWidth * newScale;
    const scaledHeight = imgHeight * newScale;
    const x = (canvasWidth - scaledWidth) / 2;
    const y = (canvasHeight - scaledHeight) / 2;

    console.log("Image Scale and Position:", {
      imgWidth,
      imgHeight,
      canvasWidth,
      canvasHeight,
      newScale,
      x,
      y,
    });

    setScale(newScale);
    setImagePosition({ x, y });
  };

  const onCanvasLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setCanvasSize({ width, height });
  };

  // Convert screen coordinates to image coordinates
  const screenToImageCoords = (screenX: number, screenY: number): Point => {
    const imageCoords = {
      x: (screenX - imagePosition.x) / scale,
      y: (screenY - imagePosition.y) / scale,
    };
    console.log("Screen to Image Coords:", { screenX, screenY, imageCoords });
    return imageCoords;
  };

  // Convert image coordinates to screen coordinates
  const imageToScreenCoords = (imageX: number, imageY: number): Point => {
    return {
      x: imageX * scale + imagePosition.x,
      y: imageY * scale + imagePosition.y,
    };
  };

  const panGesture = Gesture.Pan()
    .onStart((event) => {
      console.log("Gesture Start:", event.x, event.y);
      if (!isDrawing) {
        const point = screenToImageCoords(event.x, event.y);
        console.log("Start Point (Image Coords):", point);
        setStartPoint(point);
        setCurrentEndPoint(point);
        setIsDrawing(true);
      }
    })
    .onUpdate((event) => {
      console.log("Gesture Update:", event.x, event.y);
      if (isDrawing) {
        const point = screenToImageCoords(event.x, event.y);
        console.log("Current End Point (Image Coords):", point);
        setCurrentEndPoint(point);
      }
    })
    .onEnd(() => {
      if (isDrawing && startPoint && currentEndPoint) {
        const dx = currentEndPoint.x - startPoint.x;
        const dy = currentEndPoint.y - startPoint.y;
        const pixelLength = Math.sqrt(dx * dx + dy * dy);
        
        console.log("Line Drawn:", {
          startPoint,
          currentEndPoint,
          pixelLength,
        });

        const newLine: Line = {
          id: Date.now().toString(),
          startPoint,
          endPoint: currentEndPoint,
          pixelLength,
          realLength: calibrationFactor
            ? pixelLength / calibrationFactor
            : undefined,
        };

        addLine(newLine); // Save the line to the store
        setIsDrawing(false);
        setStartPoint(null);
        setCurrentEndPoint(null);
      }
    });

  const calculateDistance = (line: Line): string => {
    if (!line.realLength && !calibrationFactor) {
      return `${Math.round(line.pixelLength)} px`;
    }

    const realLength =
      line.realLength || line.pixelLength / (calibrationFactor || 1);
    const unit = units[preferredUnit];
    const convertedLength = realLength / unit.conversionFactor;

    return `${convertedLength.toFixed(2)} ${unit.shortName}`;
  };

  const startCalibration = () => {
    setIsCalibrating(true);
    setCalibrationValue(10); // Default starting value
  };

  const confirmCalibration = () => {
    if (calibrationValue && currentMeasurement?.lines.length) {
      const lastLine =
        currentMeasurement.lines[currentMeasurement.lines.length - 1];
      const newCalibrationFactor =
        lastLine.pixelLength /
        (calibrationValue * units[preferredUnit].conversionFactor);
      setCalibrationFactor(newCalibrationFactor);
      setIsCalibrating(false);
      setCalibrationValue(null);
    }
  };

  const cancelCalibration = () => {
    setIsCalibrating(false);
    setCalibrationValue(null);
  };

  const increaseCalibrationValue = () => {
    setCalibrationValue((prev) => (prev || 0) + 1);
  };

  const decreaseCalibrationValue = () => {
    setCalibrationValue((prev) => Math.max(1, (prev || 0) - 1));
  };

  // Render the SVG content
  const renderSvgContent = () => {
    console.log("Rendering Lines:", currentMeasurement?.lines);
    return (
    <>
      {currentMeasurement?.lines.map((line) => (
        <React.Fragment key={line.id}>
          <SvgLine
            x1={line.startPoint.x}
            y1={line.startPoint.y}
            x2={line.endPoint.x}
            y2={line.endPoint.y}
            stroke={colors.primary}
            strokeWidth={2}
          />
          <Circle
            cx={line.startPoint.x}
            cy={line.startPoint.y}
            r={5}
            fill={colors.primary}
          />
          <Circle
            cx={line.endPoint.x}
            cy={line.endPoint.y}
            r={5}
            fill={colors.primary}
          />
          <SvgText
            x={(line.startPoint.x + line.endPoint.x) / 2}
            y={(line.startPoint.y + line.endPoint.y) / 2 - 10}
            fill={colors.text}
            fontSize={16}
            fontWeight="bold"
            textAnchor="middle"
          >
            {calculateDistance(line)}
          </SvgText>
        </React.Fragment>
      ))}

      {isDrawing && startPoint && currentEndPoint && (
        <>
          <SvgLine
            x1={startPoint.x}
            y1={startPoint.y}
            x2={currentEndPoint.x}
            y2={currentEndPoint.y}
            stroke={colors.primary}
            strokeWidth={2}
            strokeDasharray="5,5"
          />
          <Circle
            cx={startPoint.x}
            cy={startPoint.y}
            r={5}
            fill={colors.primary}
          />
          <Circle
            cx={currentEndPoint.x}
            cy={currentEndPoint.y}
            r={5}
            fill={colors.primary}
          />
        </>
      )}
    </>
  );
};

  // Render different canvas implementations for web vs native
  const renderCanvas = () => (
    <GestureDetector gesture={panGesture}>
      <View style={styles.svgContainer}>
        <Svg width="100%" height="100%">
          {renderSvgContent()}
        </Svg>
      </View>
    </GestureDetector>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={onClose}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={startCalibration}
          disabled={!currentMeasurement?.lines.length}
        >
          <Ruler color={colors.primary} size={24} />
        </TouchableOpacity>
      </View>

      <View
        style={styles.canvasContainer}
        ref={canvasRef}
        onLayout={onCanvasLayout}
      >
        <Image
          source={{ uri: imageUri }}
          style={{
            width: imageSize.width * scale,
            height: imageSize.height * scale,
            left: imagePosition.x,
            top: imagePosition.y,
            position: "absolute",
          }}
          resizeMode="contain"
        />

        {renderCanvas()}
      </View>

      {isCalibrating && (
        <View style={styles.calibrationOverlay}>
          <View style={styles.calibrationModal}>
            <Text style={styles.calibrationTitle}>Calibrate Measurement</Text>
            <Text style={styles.calibrationSubtitle}>
              Enter the real-world length of the last line you drew:
            </Text>

            <View style={styles.calibrationControls}>
              <TouchableOpacity
                style={styles.calibrationButton}
                onPress={decreaseCalibrationValue}
              >
                <Minus color={colors.text} size={20} />
              </TouchableOpacity>

              <Text style={styles.calibrationValue}>
                {calibrationValue || 0} {units[preferredUnit].shortName}
              </Text>

              <TouchableOpacity
                style={styles.calibrationButton}
                onPress={increaseCalibrationValue}
              >
                <Plus color={colors.text} size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.calibrationActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelCalibration}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmCalibration}
                disabled={!calibrationValue}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {calibrationFactor
            ? `Calibrated: ${units[preferredUnit].name}`
            : "Not calibrated - Draw a line and tap the ruler to calibrate"}
        </Text>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.card,
  },
  headerButton: {
    padding: 8,
  },
  doneButtonText: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: "black",
    position: "relative",
    overflow: "hidden",
  },
  svgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  calibrationOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  calibrationModal: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  calibrationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  calibrationSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  calibrationControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  calibrationButton: {
    backgroundColor: colors.border,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  calibrationValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 20,
  },
  calibrationActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.border,
    alignItems: "center",
    marginHorizontal: 4,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    marginHorizontal: 4,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "bold",
  },
  footer: {
    padding: 16,
    backgroundColor: colors.card,
    alignItems: "center",
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});

export default MeasureCanvas;
