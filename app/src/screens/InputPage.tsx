import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

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
    <View style={styles.card}>
      <Text style={styles.title}>재료 입력</Text>
      <Text style={styles.description}>냉장고 재료를 추가한 뒤 추천을 시작하세요.</Text>

      <View style={styles.inputRow}>
        <TextInput
          placeholder="예: 계란"
          style={styles.input}
          value={input}
          onChangeText={onInputChange}
          onSubmitEditing={onAddIngredient}
        />
        <Pressable style={styles.smallButton} onPress={onAddIngredient}>
          <Text style={styles.smallButtonText}>추가</Text>
        </Pressable>
      </View>

      <View style={styles.tagWrap}>
        {ingredients.map((item) => (
          <Pressable key={item} style={styles.tag} onPress={() => onRemoveIngredient(item)}>
            <Text style={styles.tagText}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.altInputRow}>
        <Pressable style={styles.outlineButton} onPress={onOpenCamera}>
          <Text style={styles.outlineButtonText}>카메라로 추가</Text>
        </Pressable>
        <Pressable style={styles.outlineButton} onPress={onOpenVoice}>
          <Text style={styles.outlineButtonText}>음성으로 추가</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.primaryButton, ingredients.length === 0 && styles.buttonDisabled]}
        disabled={ingredients.length === 0}
        onPress={onSearch}
      >
        <Text style={styles.primaryButtonText}>레시피 찾기</Text>
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
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  smallButton: {
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  smallButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: {
    color: '#374151',
    fontSize: 13,
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
  outlineButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    flex: 1,
  },
  outlineButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  altInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
});
