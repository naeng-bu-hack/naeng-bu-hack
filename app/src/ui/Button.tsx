import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/tokens';

type ButtonVariant = 'primary' | 'outline' | 'success' | 'camera' | 'voice';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  flex?: boolean;
  leftSlot?: ReactNode;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  flex = false,
  leftSlot,
}: ButtonProps) {
  return (
    <Pressable
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'outline' && styles.outline,
        variant === 'success' && styles.success,
        variant === 'camera' && styles.camera,
        variant === 'voice' && styles.voice,
        flex && styles.flex,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.content}>
        {leftSlot}
        <Text
          style={[
            styles.text,
            variant === 'outline' ? styles.outlineText : styles.primaryText,
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  outline: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
  },
  success: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  camera: {
    backgroundColor: colors.info,
    borderColor: colors.info,
  },
  voice: {
    backgroundColor: colors.voice,
    borderColor: colors.voice,
  },
  disabled: {
    opacity: 0.45,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  text: {
    fontWeight: '700',
  },
  primaryText: {
    color: colors.textOnPrimary,
  },
  outlineText: {
    color: colors.textSecondary,
  },
});
