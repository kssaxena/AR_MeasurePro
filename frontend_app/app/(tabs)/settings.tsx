import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useMeasureStore } from "@/store/measureStore";
import { units } from "@/constants/units";
import { Ruler, Trash2, Info, Smartphone } from "lucide-react-native";
import { colors } from "@/constants/colors";

export default function SettingsScreen() {
  const {
    preferredUnit,
    setPreferredUnit,
    calibrationFactor,
    setCalibrationFactor,
    measurements,
  } = useMeasureStore();

  const handleUnitChange = (unit: string) => {
    setPreferredUnit(unit);
  };

  const handleResetCalibration = () => {
    Alert.alert(
      "Reset Calibration",
      "Are you sure you want to reset the calibration? This will affect all measurements.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          onPress: () => setCalibrationFactor(null),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Measurement Units</Text>

          {Object.entries(units).map(([key, unit]) => (
            <TouchableOpacity
              key={key}
              style={styles.unitItem}
              onPress={() => handleUnitChange(key)}
            >
              <View style={styles.unitItemLeft}>
                <Ruler size={20} color={colors.primary} />
                <Text style={styles.unitItemText}>{unit.name}</Text>
              </View>

              {preferredUnit === key && <View style={styles.selectedDot} />}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calibration</Text>

          <View style={styles.infoBox}>
            <Info size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              Calibration helps provide accurate measurements. Draw a line on an
              object of known size to calibrate.
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status:</Text>
            <Text
              style={[
                styles.statusValue,
                calibrationFactor ? styles.statusSuccess : styles.statusWarning,
              ]}
            >
              {calibrationFactor ? "Calibrated" : "Not Calibrated"}
            </Text>
          </View>

          {calibrationFactor && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetCalibration}
            >
              <Trash2 size={18} color={colors.error} />
              <Text style={styles.resetButtonText}>Reset Calibration</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.aboutItem}>
            <View style={styles.aboutItemLeft}>
              <Smartphone size={20} color={colors.primary} />
              <Text style={styles.aboutItemText}>App Version</Text>
            </View>
            <Text style={styles.aboutItemValue}>1.0.0</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, styles.statsSection]}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <Text style={styles.statsText}>
            {measurements.length} measurement
            {measurements.length !== 1 ? "s" : ""}
          </Text>
          <Text style={styles.statsText}>
            {measurements.reduce((total, m) => total + m.lines.length, 0)} line
            {measurements.reduce((total, m) => total + m.lines.length, 0) !== 1
              ? "s"
              : ""}{" "}
            measured
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    padding: 16,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  unitItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  unitItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  unitItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  selectedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  infoBox: {
    backgroundColor: colors.border,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    marginBottom: 16,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 14,
    flex: 1,
    marginLeft: 12,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 16,
    color: colors.text,
    marginRight: 8,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusSuccess: {
    color: colors.success,
  },
  statusWarning: {
    color: colors.warning,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.border,
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  resetButtonText: {
    color: colors.error,
    fontWeight: "bold",
    marginLeft: 8,
  },
  aboutItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  aboutItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  aboutItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  aboutItemValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsSection: {
    alignItems: "center",
  },
  statsText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
});
