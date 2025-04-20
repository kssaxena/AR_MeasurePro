import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ruler } from "lucide-react-native";
import { colors } from "@/constants/colors";

interface EmptyStateProps {
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ruler size={48} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  iconContainer: {
    backgroundColor: colors.card,
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: "80%",
  },
});

export default EmptyState;
