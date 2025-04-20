import React from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  Alert,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useMeasureStore } from "@/store/measureStore";
import MeasurementItem from "@/components/MeasurementItem";
import EmptyState from "@/components/EmptyState";
import { colors } from "@/constants/colors";

export default function HistoryScreen() {
  const { measurements, deleteMeasurement } = useMeasureStore();

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Measurement",
      "Are you sure you want to delete this measurement?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteMeasurement(id),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Measurement History</Text>
      </View>

      {measurements.length > 0 ? (
        <FlatList
          data={measurements}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MeasurementItem measurement={item} onDelete={handleDelete} />
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <EmptyState
          title="No Measurements Yet"
          message="Take a photo and start measuring objects to see your history here."
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  listContent: {
    padding: 16,
  },
});
