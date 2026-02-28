import { Modal, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme/tokens';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';

type IngredientDetectModalProps = {
  visible: boolean;
  detecting: boolean;
  onClose: () => void;
  onDetect: () => void;
};

export function IngredientDetectModal({ visible, detecting, onClose, onDetect }: IngredientDetectModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View>
          <Card>
            <Text style={styles.title}>카메라 재료 인식</Text>
            <Text style={styles.description}>사진 분석 결과를 확인한 뒤 재료 리스트에 반영할 수 있습니다.</Text>
            <View style={styles.buttons}>
              <Button label="취소" variant="outline" flex onPress={onClose} />
              <Button label={detecting ? '분석 중...' : '분석 시작'} flex onPress={onDetect} disabled={detecting} />
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
});
