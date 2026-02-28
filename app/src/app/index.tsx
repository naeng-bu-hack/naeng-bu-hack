import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { InputPage } from '@/screens/InputPage';
import { useFlowContext } from '@/store/flow-context';
import { Screen } from '@/ui/Screen';

export default function InputRoute() {
  const router = useRouter();
  const { ingredients, addIngredient, removeIngredient } = useFlowContext();
  const [input, setInput] = useState('');

  function handleAddIngredient() {
    addIngredient(input);
    setInput('');
  }

  function handleOpenCamera() {
    ['대파', '두부', '양파'].forEach((item) => addIngredient(item));
    Alert.alert('카메라 Mock', '재료 3개를 추가했습니다.');
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
    </Screen>
  );
}
