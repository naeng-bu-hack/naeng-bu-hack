import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from '@/theme/tokens';

type ChipProps = {
  label: string;
  onPress: () => void;
};

export function Chip({ label, onPress }: ChipProps) {
  return (
    <Pressable style={styles.chip} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});
