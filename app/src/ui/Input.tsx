import type { ComponentProps } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { colors, radius, spacing } from '@/theme/tokens';

type InputProps = ComponentProps<typeof TextInput>;

export function Input(props: InputProps) {
  return <TextInput placeholderTextColor={colors.textMuted} {...props} style={[styles.input, props.style]} />;
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceMuted,
  },
});
