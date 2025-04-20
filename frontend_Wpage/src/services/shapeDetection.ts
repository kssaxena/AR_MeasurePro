
export interface ShapeDetection {
  shape: string;
  color: string;
}

export const detectShapes = async (imageElement: HTMLImageElement): Promise<ShapeDetection[]> => {
  try {
    // Wait for OpenCV.js to be loaded
    if (typeof cv === 'undefined') {
      await new Promise<void>((resolve) => {
        // If OpenCV is not loaded yet, we set up a callback
        // @ts-ignore
        window.onOpenCvReady = () => {
          resolve();
        };
        
        // If OpenCV script is not added yet, add it
        if (!document.getElementById('opencv-script')) {
          const script = document.createElement('script');
          script.id = 'opencv-script';
          script.src = 'https://docs.opencv.org/4.7.0/opencv.js';
          script.async = true;
          script.onload = () => {
            // @ts-ignore
            if (window.cv) {
              // @ts-ignore
              window.onOpenCvReady();
            }
          };
          document.head.appendChild(script);
        }
      });
    }
    
    // Create canvas and draw image to it
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return [{ shape: 'Canvas context not available', color: '#8E9196' }];
    }
    
    ctx.drawImage(imageElement, 0, 0);
    
    // Convert to OpenCV format
    const src = cv.imread(canvas);
    const dst = new cv.Mat();
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    
    // Convert to grayscale for better detection
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    
    // Apply threshold to make shapes more visible
    cv.threshold(dst, dst, 120, 255, cv.THRESH_BINARY);
    
    // Find contours
    cv.findContours(dst, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    
    // Color palette for different shapes with transparency
    const shapeColors = {
      'triangle': '#F97316', // Bright Orange
      'square': '#0EA5E9', // Ocean Blue
      'rectangle': '#8B5CF6', // Vivid Purple
      'circle': '#D946EF', // Magenta Pink
      'polygon': '#1EAEDB' // Bright Blue
    };
    
    // Function to convert hex to RGBA
    const hexToRgba = (hex: string, alpha: number = 0.3) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    
    const shapeDetections: ShapeDetection[] = [];
    
    // Analyze each contour to identify shapes
    for (let i = 0; i < contours.size(); i++) {
      const contour = contours.get(i);
      const perimeter = cv.arcLength(contour, true);
      const approx = new cv.Mat();
      
      cv.approxPolyDP(contour, approx, 0.04 * perimeter, true);
      const area = cv.contourArea(contour);
      
      if (area > 1000) {
        const vertices = approx.rows;
        let shape = '';
        let color = '';
        
        if (vertices === 3) {
          shape = 'triangle';
          color = shapeColors['triangle'];
          
          // Draw filled triangle with transparency
          ctx.beginPath();
          
          // Handle contour points safely
          if (contour.data32S) {
            for (let j = 0; j < vertices; j++) {
              const pointX = contour.data32S[j * 2];
              const pointY = contour.data32S[j * 2 + 1];
              if (j === 0) ctx.moveTo(pointX, pointY);
              else ctx.lineTo(pointX, pointY);
            }
            ctx.closePath();
            ctx.fillStyle = hexToRgba(color);
            ctx.fill();
          }
          
        } else if (vertices === 4) {
          const rect = cv.boundingRect(contour);
          const aspectRatio = rect.width / rect.height;
          
          if (aspectRatio >= 0.95 && aspectRatio <= 1.05) {
            shape = 'square';
            color = shapeColors['square'];
          } else {
            shape = 'rectangle';
            color = shapeColors['rectangle'];
          }
          
          // Draw filled rectangle/square with transparency
          ctx.fillStyle = hexToRgba(color);
          ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
          
        } else if (vertices >= 5 && vertices <= 10) {
          const circle = cv.minEnclosingCircle(contour);
          const circularity = area / (Math.PI * circle.radius * circle.radius);
          
          if (circularity > 0.8) {
            shape = 'circle';
            color = shapeColors['circle'];
            
            // Draw filled circle with transparency
            ctx.beginPath();
            ctx.arc(circle.center.x, circle.center.y, circle.radius, 0, 2 * Math.PI);
            ctx.fillStyle = hexToRgba(color);
            ctx.fill();
          } else {
            shape = 'polygon';
            color = shapeColors['polygon'];
            
            // Draw filled polygon with transparency
            ctx.beginPath();
            
            // Handle contour points safely
            if (contour.data32S) {
              for (let j = 0; j < vertices; j++) {
                const pointX = contour.data32S[j * 2];
                const pointY = contour.data32S[j * 2 + 1];
                if (j === 0) ctx.moveTo(pointX, pointY);
                else ctx.lineTo(pointX, pointY);
              }
              ctx.closePath();
              ctx.fillStyle = hexToRgba(color);
              ctx.fill();
            }
          }
        }
        
        if (shape) {
          shapeDetections.push({ shape, color });
        }
      }
      
      approx.delete();
      contour.delete();
    }
    
    // Update the image in ImageCapture component
    imageElement.src = canvas.toDataURL();
    
    // Clean up
    src.delete();
    dst.delete();
    contours.delete();
    hierarchy.delete();
    
    return shapeDetections.length > 0 ? shapeDetections : [{ shape: 'No shapes detected', color: '#8E9196' }];
  } catch (error) {
    console.error('Shape detection failed:', error);
    return [{ shape: 'Shape detection failed', color: '#8E9196' }];
  }
};
