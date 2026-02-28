import { ActivityIndicator, StyleSheet, Text } from 'react-native';

import { colors, typography } from '@/theme/tokens';
import { Card } from '@/ui/Card';

export function LoadingPage() {
  return (
    <Card>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.title}>추천 생성 중</Text>
      <Text style={styles.description}>입력 재료를 기준으로 레시피를 찾고 있어요.</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  description: {
    ...typography.subtitle,
    color: colors.textSecondary,
  },
});
