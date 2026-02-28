import { StyleSheet, Text, View } from 'react-native';

type StepCardProps = {
  step: number;
  totalSteps: number;
  title: string;
  description: string;
};

export function StepCard({ step, totalSteps, title, description }: StepCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.meta}>{`Step ${step} / ${totalSteps}`}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 20,
    gap: 10,
  },
  meta: {
    fontSize: 13,
    color: '#6b7280',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
  },
});
