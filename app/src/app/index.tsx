import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { detectIngredientsFromImages } from '@/api/client';
import { IngredientConfirmModal } from '@/screens/IngredientConfirmModal';
import { IngredientDetectModal } from '@/screens/IngredientDetectModal';
import { InputPage } from '@/screens/InputPage';
import { useFlowContext } from '@/store/flow-context';
import { Screen } from '@/ui/Screen';

export default function InputRoute() {
  const router = useRouter();
  const { ingredients, addIngredient, removeIngredient } = useFlowContext();
  const [input, setInput] = useState('');
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, boolean>>({});
  const [detecting, setDetecting] = useState(false);

  function handleAddIngredient() {
    addIngredient(input);
    setInput('');
  }

  function handleOpenCamera() {
    setCameraModalVisible(true);
  }

  async function handleDetectFromCamera() {
    try {
      setDetecting(true);
      const detected = await detectIngredientsFromImages();
      const names = detected.map((item) => item.name);
      const selected = names.reduce<Record<string, boolean>>((acc, item) => {
        acc[item] = true;
        return acc;
      }, {});

      setCandidates(names);
      setSelectedCandidates(selected);
      setCameraModalVisible(false);
      setConfirmModalVisible(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : '이미지 분석에 실패했습니다.';
      Alert.alert('카메라 분석 실패', message);
    } finally {
      setDetecting(false);
    }
  }

  function toggleCandidate(name: string) {
    setSelectedCandidates((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  }

  function applySelectedCandidates() {
    const selected = candidates.filter((item) => selectedCandidates[item]);
    selected.forEach((item) => addIngredient(item));
    setConfirmModalVisible(false);
    setCandidates([]);
    setSelectedCandidates({});
    Alert.alert('반영 완료', `${selected.length}개 재료를 반영했습니다.`);
  }

  function handleOpenVoice() {
    ['감자', '계란'].forEach((item) => addIngredient(item));
    Alert.alert('음성 Mock', '재료 2개를 추가했습니다.');
  }

  function handleSearch() {
    if (ingredients.length === 0) return;
    router.push('/loading');
  }

  return (
    <Screen>
      <InputPage
        input={input}
        ingredients={ingredients}
        onInputChange={setInput}
        onAddIngredient={handleAddIngredient}
        onRemoveIngredient={removeIngredient}
        onOpenCamera={handleOpenCamera}
        onOpenVoice={handleOpenVoice}
        onSearch={handleSearch}
      />
      <IngredientDetectModal
        visible={cameraModalVisible}
        detecting={detecting}
        onClose={() => setCameraModalVisible(false)}
        onDetect={handleDetectFromCamera}
      />
      <IngredientConfirmModal
        visible={confirmModalVisible}
        candidates={candidates}
        selectedMap={selectedCandidates}
        onToggle={toggleCandidate}
        onClose={() => setConfirmModalVisible(false)}
        onApply={applySelectedCandidates}
      />
    </Screen>
  );
}
