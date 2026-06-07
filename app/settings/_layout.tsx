import { useTheme } from '@/constants/ThemeContext';
import { Stack } from 'expo-router';

export default function SettingsLayout() {
  const { theme, isDark } = useTheme() as any;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.textPrimary,
        headerShadowVisible: !isDark,
        headerBackTitleVisible: false,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="edit-profile" options={{ title: 'Editar Perfil' }} />
      <Stack.Screen name="change-password" options={{ title: 'Alterar Senha' }} />
      <Stack.Screen name="notifications" options={{ title: 'Notificações' }} />
      <Stack.Screen name="language" options={{ title: 'Idioma' }} />
      <Stack.Screen name="privacy" options={{ title: 'Privacidade' }} />
      <Stack.Screen name="faq" options={{ title: 'Ajuda e FAQ' }} />
      <Stack.Screen name="support" options={{ title: 'Falar com Suporte' }} />
      <Stack.Screen name="about" options={{ title: 'Sobre o LappJ' }} />
    </Stack>
  );
}
