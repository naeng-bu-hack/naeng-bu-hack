import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme/tokens';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';

type IngredientDetectModalProps = {
  visible: boolean;
  detecting: boolean;
  onCancel: () => void;
  onOpenCamera: () => void;
  onOpenGallery: () => void;
};

export function IngredientDetectModal({
  visible,
  detecting,
  onCancel,
  onOpenCamera,
  onOpenGallery,
}: IngredientDetectModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View>
          <Card>
            <Text style={styles.title}>카메라 재료 인식</Text>
            <Text style={styles.description}>
              {detecting ? '분석중입니다. 잠시만 기다려주세요.' : '촬영하거나 앨범에서 선택한 사진을 분석합니다.'}
            </Text>
            {detecting ? <ActivityIndicator size="small" color={colors.primary} /> : null}
            <View style={styles.buttons}>
              <Button label="촬영" variant="camera" flex onPress={onOpenCamera} disabled={detecting} />
              <Button label="앨범 선택" variant="outline" flex onPress={onOpenGallery} disabled={detecting} />
            </View>
            <Button label={detecting ? '분석 취소' : '취소'} variant="outline" onPress={onCancel} />
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
