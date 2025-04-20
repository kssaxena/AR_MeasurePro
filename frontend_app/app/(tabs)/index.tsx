import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { Camera, Image as ImageIcon, Upload } from "lucide-react-native";
import { useMeasureStore } from "@/store/measureStore";
import MeasureCanvas from "@/components/MeasureCanvas";
import { Measurement } from "@/types/measurement";
import { colors } from "@/constants/colors";
import { scaleAndSendPhoto } from "@/utils/imageUtils";

export default function MeasureScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [measurementName, setMeasurementName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { addMeasurement, setCurrentMeasurement } = useMeasureStore();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setShowNameModal(true);
    }
  };

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setShowNameModal(true);
    }
  };
  
  // Start measuring
  // when the user clicks on the start measuring button
  const handleStartMeasuring = () => {
    if (imageUri) {
      const newMeasurement: Measurement = {
        id: Date.now().toString(),
        imageUri,
        lines: [],
        createdAt: Date.now(),
        name: measurementName || `Measurement ${new Date().toLocaleString()}`,
      };

      addMeasurement(newMeasurement);
      setCurrentMeasurement(newMeasurement);
      setShowCanvas(true);
      setShowNameModal(false);
    }
  };

  const handleCloseCanvas = () => {
    setShowCanvas(false);
    setImageUri(null);
    setCurrentMeasurement(null);
  };

  const handleSendPhoto = async () => {
    if (!imageUri) return;

    try {
      setIsUploading(true);

      // Replace 'https://your-api-endpoint.com/upload' with your actual endpoint
      const response = await scaleAndSendPhoto(
        imageUri,
        1200,
        1200,
        "https://your-api-endpoint.com/upload"
      );

      Alert.alert("Success", "Photo uploaded successfully!", [{ text: "OK" }]);

      console.log("Upload response:", response);
    } catch (error) {
      console.error("Error uploading photo:", error);
      Alert.alert(
        "Upload Failed",
        "There was an error uploading the photo. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
        <Text style={styles.title}>Measure</Text>
        <Text style={styles.subtitle}>
          Take a photo or select an image to start measuring
        </Text>


        {/* Camera button and pick image button */}


        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={takePicture}>
            <Camera size={32} color="#FFFFFF" />
            <Text style={styles.optionText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
            <ImageIcon size={32} color="#FFFFFF" />
            <Text style={styles.optionText}>Select Image</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showCanvas && imageUri && (
        <View style={styles.canvasContainer}>
          <MeasureCanvas imageUri={imageUri} onClose={handleCloseCanvas} />
        </View>
      )}

      <Modal
        visible={showNameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNameModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Name your measurement</Text>

          {/* Name your measurement */}

            <TextInput
              style={styles.input}
              placeholder="e.g., Living Room Table"
              placeholderTextColor={colors.textSecondary}
              value={measurementName}
              onChangeText={setMeasurementName}
              autoFocus
              returnKeyType="done"
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowNameModal(false);
                  setImageUri(null);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStartMeasuring}
              >
                <Text style={styles.buttonText}>Start Measuring</Text>
              </TouchableOpacity>
            </View>

            {imageUri && (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleSendPhoto}
                disabled={isUploading}
              >
                <Upload size={18} color="#FFFFFF" />
                <Text style={styles.uploadButtonText}>
                  {isUploading ? "Uploading..." : "Upload Photo Only"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 40,
    maxWidth: "80%",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: 16,
  },
  optionButton: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    maxWidth: 160,
    height: 160,
  },
  optionText: {
    color: colors.text,
    fontWeight: "bold",
    marginTop: 12,
  },
  canvasContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    backgroundColor: colors.border,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontSize: 16,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.border,
    alignItems: "center",
  },
  startButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  buttonText: {
    color: colors.text,
    fontWeight: "bold",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  uploadButtonText: {
    color: colors.text,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
