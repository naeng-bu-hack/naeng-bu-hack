import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

import { detectIngredientsFromImages, type UploadImage } from '@/api/client';
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
  const detectAbortController = useRef<AbortController | null>(null);

  function handleAddIngredient() {
    addIngredient(input);
    setInput('');
  }

  function handleOpenCamera() {
    setCameraModalVisible(true);
  }

  async function runImageDetect(file: UploadImage) {
    const controller = new AbortController();
    detectAbortController.current = controller;
    try {
      setDetecting(true);
      const detected = await detectIngredientsFromImages(file, { signal: controller.signal });
      console.log('[detect] raw response candidates:', detected);
      const names = detected
        .map((item) => {
          const display = item.name?.trim();
          const normalized = item.normalized?.trim();
          return display || normalized || '';
        })
        .filter((value) => value.length > 0);
      console.log('[detect] display candidates:', names);

      const selected = names.reduce<Record<string, boolean>>((acc, item) => {
        acc[item] = true;
        return acc;
      }, {});

      setCandidates(names);
      console.log('[detect] setCandidates length:', names.length);
      setSelectedCandidates(selected);
      setCameraModalVisible(false);
      setConfirmModalVisible(true);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      const message = err instanceof Error ? err.message : '이미지 분석에 실패했습니다.';
      Alert.alert('카메라 분석 실패', message);
    } finally {
      detectAbortController.current = null;
      setDetecting(false);
    }
  }

  function handleCancelDetectModal() {
    if (detectAbortController.current) {
      detectAbortController.current.abort();
      detectAbortController.current = null;
    }
    setDetecting(false);
    setCameraModalVisible(false);
  }

  async function handleCaptureWithCamera() {
    if (Platform.OS === 'web') {
      await handlePickFromGallery();
      return;
    }

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('권한 필요', '카메라 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
    });
    if (result.canceled || result.assets.length === 0) {
      return;
    }

    const asset = result.assets[0];
    const file: UploadImage = {
      uri: asset.uri,
      name: asset.fileName ?? 'camera.jpg',
      type: asset.mimeType ?? 'image/jpeg',
    };
    await runImageDetect(file);
  }

  async function handlePickFromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('권한 필요', '사진 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      allowsEditing: false,
      quality: 0.7,
      selectionLimit: 1,
    });
    if (result.canceled || result.assets.length === 0) {
      return;
    }

    const asset: ImagePicker.ImagePickerAsset = result.assets[0];
    const file: UploadImage = asset.file
      ? asset.file
      : {
          uri: asset.uri,
          name: asset.fileName ?? 'gallery.jpg',
          type: asset.mimeType ?? 'image/jpeg',
        };
    await runImageDetect(file);
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
        onCancel={handleCancelDetectModal}
        onOpenCamera={handleCaptureWithCamera}
        onOpenGallery={handlePickFromGallery}
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
