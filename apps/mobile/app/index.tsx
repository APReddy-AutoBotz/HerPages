import { View, Text, StyleSheet } from "react-native";
import { brand, semantic } from "@herpages/design-tokens";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{brand.name}</Text>
      <Text style={styles.tagline}>{brand.tagline}</Text>
      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Environment</Text>
        <Text style={styles.statusValue}>Development — Synthetic Data Only</Text>
      </View>
      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Vault</Text>
        <Text style={styles.statusValue}>
          Not implemented — interfaces only (HP-003)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: semantic.light.background,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: semantic.light.text,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 17,
    color: semantic.light.mutedText,
    marginBottom: 32,
  },
  statusCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: semantic.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: semantic.light.border,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: semantic.light.mutedText,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 15,
    color: semantic.light.text,
  },
});
