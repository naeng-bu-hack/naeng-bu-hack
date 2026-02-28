import { Pressable, StyleSheet, Text, View } from 'react-native';

type CompletePageProps = {
  recipeTitle: string;
  shared: boolean;
  onShare: () => void;
  onReset: () => void;
};

export function CompletePage({ recipeTitle, shared, onShare, onReset }: CompletePageProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>완료</Text>
      <Text style={styles.description}>{`${recipeTitle} 요리가 완성되었습니다.`}</Text>

      <Pressable style={[styles.primaryButton, shared && styles.sharedButton]} onPress={onShare} disabled={shared}>
        <Text style={styles.primaryButtonText}>{shared ? '공유 완료' : '친구에게 공유'}</Text>
      </Pressable>

      <Pressable style={styles.outlineButton} onPress={onReset}>
        <Text style={styles.outlineButtonText}>처음으로</Text>
      </Pressable>
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
  primaryButton: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  sharedButton: {
    backgroundColor: '#16a34a',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
});
