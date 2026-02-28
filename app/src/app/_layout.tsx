import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { FlowProvider } from '@/store/flow-context';

export default function RootLayout() {
  return (
    <FlowProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </FlowProvider>
  );
}
