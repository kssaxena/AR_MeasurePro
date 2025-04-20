import * as ImageManipulator from "expo-image-manipulator";
import { Platform } from "react-native";

/**
 * Scales and sends a photo to a specified endpoint
 * @param imageUri The URI of the captured image
 * @param maxWidth Maximum width to scale the image to
 * @param maxHeight Maximum height to scale the image to
 * @param endpoint API endpoint to send the image to
 * @returns Promise with the server response
 */
export const scaleAndSendPhoto = async (
  imageUri: string,
  maxWidth = 1200,
  maxHeight = 1200,
  endpoint = "https://api.example.com/upload"
): Promise<any> => {
  try {
    // First, scale/resize the image to reduce file size
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: maxWidth, height: maxHeight } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );

    // Create form data for the upload
    const formData = new FormData();

    // Append the image file
    const filename = imageUri.split("/").pop() || "photo.jpg";
    const fileType = "image/jpeg";

    // Handle file object differently for web vs native
    if (Platform.OS === "web") {
      // For web, we need to fetch the file and convert it to a blob
      const response = await fetch(manipulatedImage.uri);
      const blob = await response.blob();
      formData.append("photo", blob as any, filename);
    } else {
      // For native platforms
      formData.append("photo", {
        uri: manipulatedImage.uri,
        name: filename,
        type: fileType,
      } as any);
    }

    // Add any additional metadata
    formData.append("timestamp", Date.now().toString());

    // Send the image to the server
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });

    // Parse and return the response
    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error scaling and sending photo:", error);
    throw error;
  }
};

/**
 * Scales an image to specified dimensions
 * @param imageUri The URI of the image to scale
 * @param maxWidth Maximum width to scale to
 * @param maxHeight Maximum height to scale to
 * @returns Promise with the manipulated image result
 */
export const scaleImage = async (
  imageUri: string,
  maxWidth = 1200,
  maxHeight = 1200
): Promise<ImageManipulator.ImageResult> => {
  return await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: maxWidth, height: maxHeight } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );
};
