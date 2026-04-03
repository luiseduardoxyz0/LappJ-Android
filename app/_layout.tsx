import { EntregasProvider } from '@/constants/EntregasContext';
import { ThemeProvider } from '@/constants/ThemeContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
    <ThemeProvider>
      <EntregasProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="coordenador" />
          <Stack.Screen name="admin" />
          <Stack.Screen name="entrega/[id]" />
          <Stack.Screen name="motorista/[id]" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </EntregasProvider>
    </ThemeProvider>
    </SafeAreaProvider>
  );
}
