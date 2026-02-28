import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';

import { colors, typography } from '@/theme/tokens';
import { Card } from '@/ui/Card';

export function LoadingPage() {
  const messages = [
    '완벽한 레시피를 찾아내고 있어요.',
    '냉장고 재료를 하나씩 분석하고 있어요.',
    '지금 딱 맞는 조합을 추리는 중이에요.',
  ];
  const [messageIndex, setMessageIndex] = useState(0);
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1200);
    return () => clearInterval(timer);
  }, [messages.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 350);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.title}>{`추천 생성 중${'.'.repeat(dotCount)}`}</Text>
      <Text style={styles.description}>{messages[messageIndex]}</Text>
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
