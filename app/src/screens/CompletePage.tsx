import { StyleSheet, Text } from 'react-native';

import { colors, typography } from '@/theme/tokens';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';

type CompletePageProps = {
  recipeTitle: string;
  shared: boolean;
  onShare: () => void;
  onReset: () => void;
};

export function CompletePage({ recipeTitle, shared, onShare, onReset }: CompletePageProps) {
  return (
    <Card>
      <Text style={styles.title}>완료</Text>
      <Text style={styles.description}>{`${recipeTitle} 요리가 완성되었습니다.`}</Text>

      <Button label={shared ? '공유 완료' : '친구에게 공유'} onPress={onShare} disabled={shared} variant={shared ? 'success' : 'primary'} />
      <Button label="처음으로" variant="outline" onPress={onReset} />
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
