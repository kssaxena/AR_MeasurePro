import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMeasureStore } from "@/store/measureStore";
import { units } from "@/constants/units";
import { formatDate } from "@/utils/dateUtils";
import { ArrowLeft, Ruler, Trash2, Upload } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { scaleAndSendPhoto } from "@/utils/imageUtils";

export default function MeasurementDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const {
    measurements,
    setCurrentMeasurement,
    preferredUnit,
    calibrationFactor,
    deleteMeasurement,
  } = useMeasureStore();

  const measurement = measurements.find((m) => m.id === id);

  useEffect(() => {
    if (measurement) {
      setCurrentMeasurement(measurement);
    }

    return () => {
      setCurrentMeasurement(null);
    };
  }, [measurement, setCurrentMeasurement]);

  if (!measurement) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Measurement not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const calculateDistance = (pixelLength: number): string => {
    if (!calibrationFactor) {
      return `${Math.round(pixelLength)} px`;
    }

    const realLength = pixelLength / calibrationFactor;
    const unit = units[preferredUnit];
    const convertedLength = realLength / unit.conversionFactor;

    return `${convertedLength.toFixed(2)} ${unit.shortName}`;
  };

  const handleDelete = () => {
    deleteMeasurement(measurement.id);
    router.back();
  };

  const handleSendPhoto = async () => {
    if (!measurement.imageUri) return;

    try {
      setIsUploading(true);

      // Replace 'https://your-api-endpoint.com/upload' with your actual endpoint
      const response = await scaleAndSendPhoto(
        measurement.imageUri,
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

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {measurement.name}
        </Text>

        <TouchableOpacity style={styles.headerButton} onPress={handleDelete}>
          <Trash2 size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: measurement.imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleSendPhoto}
          disabled={isUploading}
        >
          <Upload size={20} color="#FFFFFF" />
          <Text style={styles.uploadButtonText}>
            {isUploading ? "Uploading..." : "Send Photo"}
          </Text>
        </TouchableOpacity>

        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Measurement Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>
              {formatDate(measurement.createdAt)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Lines:</Text>
            <Text style={styles.detailValue}>{measurement.lines.length}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Calibration:</Text>
            <Text
              style={[
                styles.detailValue,
                calibrationFactor ? styles.successText : styles.warningText,
              ]}
            >
              {calibrationFactor ? "Calibrated" : "Not Calibrated"}
            </Text>
          </View>
        </View>

        {measurement.lines.length > 0 && (
          <View style={styles.detailsCard}>
            <Text style={styles.cardTitle}>Measurements</Text>

            {measurement.lines.map((line, index) => (
              <View key={line.id} style={styles.lineRow}>
                <View style={styles.lineInfo}>
                  <Ruler size={16} color={colors.text} />
                  <Text style={styles.lineLabel}>Line {index + 1}</Text>
                </View>
                <Text style={styles.lineValue}>
                  {calculateDistance(line.pixelLength)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: colors.error,
    fontSize: 18,
    marginBottom: 16,
  },
  backButton: {
    padding: 12,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  scrollView: {
    padding: 16,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadButtonText: {
    color: colors.text,
    fontWeight: "bold",
    marginLeft: 8,
  },
  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  detailValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "500",
  },
  successText: {
    color: colors.success,
  },
  warningText: {
    color: colors.warning,
  },
  lineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lineInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  lineLabel: {
    color: colors.text,
    fontSize: 16,
    marginLeft: 8,
  },
  lineValue: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
});
