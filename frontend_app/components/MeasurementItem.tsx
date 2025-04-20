import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Measurement } from "@/types/measurement";
import { formatDate } from "@/utils/dateUtils";
import { Ruler, Trash2 } from "lucide-react-native";
import { colors } from "@/constants/colors";

interface MeasurementItemProps {
  measurement: Measurement;
  onDelete: (id: string) => void;
}

const MeasurementItem: React.FC<MeasurementItemProps> = ({
  measurement,
  onDelete,
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/measurement/${measurement.id}`);
  };

  const handleDelete = () => {
    onDelete(measurement.id);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: measurement.imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.badge}>
          <Ruler size={14} color={colors.text} />
          <Text style={styles.badgeText}>{measurement.lines.length}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {measurement.name}
        </Text>
        <Text style={styles.date}>{formatDate(measurement.createdAt)}</Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <Trash2 size={18} color={colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    marginRight: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  badge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  badgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 2,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
  },
});

export default MeasurementItem;
