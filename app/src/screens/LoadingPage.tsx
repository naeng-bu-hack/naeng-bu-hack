import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export function LoadingPage() {
  return (
    <View style={styles.card}>
      <ActivityIndicator size="large" color="#111827" />
      <Text style={styles.title}>추천 생성 중</Text>
      <Text style={styles.description}>입력 재료를 기준으로 레시피를 찾고 있어요.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
  },
});
