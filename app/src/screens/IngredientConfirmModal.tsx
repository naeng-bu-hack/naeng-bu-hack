import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme/tokens';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';

type IngredientConfirmModalProps = {
  visible: boolean;
  candidates: string[];
  selectedMap: Record<string, boolean>;
  onToggle: (name: string) => void;
  onClose: () => void;
  onApply: () => void;
};

export function IngredientConfirmModal({
  visible,
  candidates,
  selectedMap,
  onToggle,
  onClose,
  onApply,
}: IngredientConfirmModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View>
          <Card>
            <Text style={styles.title}>인식 결과 확인</Text>
            <Text style={styles.description}>있는 재료만 선택하고 반영하세요.</Text>
            <View style={styles.candidateWrap}>
              {candidates.map((item) => {
                const selected = selectedMap[item];
                return (
                  <Pressable
                    key={item}
                    style={[styles.candidateChip, selected ? styles.selectedChip : styles.unselectedChip]}
                    onPress={() => onToggle(item)}
                  >
                    <Text style={selected ? styles.selectedChipText : styles.unselectedChipText}>{item}</Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.buttons}>
              <Button label="닫기" variant="outline" flex onPress={onClose} />
              <Button label="선택 반영" flex onPress={onApply} />
            </View>
          </Card>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  description: {
    ...typography.subtitle,
    color: colors.textSecondary,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  candidateWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  candidateChip: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  selectedChip: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceMuted,
  },
  unselectedChip: {
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selectedChipText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  unselectedChipText: {
    color: colors.textSecondary,
  },
});
