import type { ReactNode } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';

import { colors, spacing, typography } from '@/theme/tokens';

type ScreenProps = {
  children: ReactNode;
  error?: string | null;
};

export function Screen({ children, error }: ScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>naeng-bu-hack</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    ...typography.heading,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  error: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
  },
});
