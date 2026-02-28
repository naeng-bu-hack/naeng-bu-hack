import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme/tokens';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Chip } from '@/ui/Chip';
import { Input } from '@/ui/Input';

type InputPageProps = {
  input: string;
  ingredients: string[];
  onInputChange: (value: string) => void;
  onAddIngredient: () => void;
  onRemoveIngredient: (value: string) => void;
  onOpenCamera: () => void;
  onOpenVoice: () => void;
  onSearch: () => void;
};

export function InputPage({
  input,
  ingredients,
  onInputChange,
  onAddIngredient,
  onRemoveIngredient,
  onOpenCamera,
  onOpenVoice,
  onSearch,
}: InputPageProps) {
  return (
    <Card>
      <Text style={styles.title}>재료 입력</Text>
      <Text style={styles.description}>냉장고 재료를 추가한 뒤 추천을 시작하세요.</Text>

      <View style={styles.inputRow}>
        <Input
          placeholder="예: 계란"
          value={input}
          onChangeText={onInputChange}
          onSubmitEditing={onAddIngredient}
        />
        <Button label="추가" onPress={onAddIngredient} />
      </View>

      <View style={styles.tagWrap}>
        {ingredients.map((item) => (
          <Chip key={item} label={item} onPress={() => onRemoveIngredient(item)} />
        ))}
      </View>

      <View style={styles.altInputRow}>
        <Button label="카메라로 추가" variant="outline" flex onPress={onOpenCamera} />
        <Button label="음성으로 추가" variant="outline" flex onPress={onOpenVoice} />
      </View>

      <Button label="레시피 찾기" onPress={onSearch} disabled={ingredients.length === 0} />
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
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  altInputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
