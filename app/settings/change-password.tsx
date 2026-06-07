import { changeUserPassword } from '@/constants/localAuth';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChangePasswordScreen() {
  const { theme, isDark } = useTheme() as any;
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const s = styles(theme, isDark);

  const handleSave = async () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Atenção', 'A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }

    setSaving(true);
    try {
      await changeUserPassword(newPassword);
      Alert.alert('Sucesso', 'Sua senha foi alterada com sucesso.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        Alert.alert('Sessão expirada', 'Por motivos de segurança, você precisa fazer login novamente para alterar a senha. Faça logout e entre de novo.');
      } else {
        Alert.alert('Erro', error.message || 'Não foi possível alterar a senha.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 20 }]} keyboardShouldPersistTaps="handled">
        
        <View style={s.headerTextContainer}>
          <Text style={s.headerTitle}>Crie uma nova senha</Text>
          <Text style={s.headerSubtitle}>Sua nova senha deve ter no mínimo 6 caracteres e ser diferente da anterior.</Text>
        </View>

        <View style={s.inputGroup}>
          <Text style={s.label}>Nova Senha</Text>
          <View style={s.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.textMuted} style={s.inputIcon} />
            <TextInput
              style={s.input}
              placeholder="Digite a nova senha"
              placeholderTextColor={theme.textMuted}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={s.eyeIcon}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={theme.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={s.inputGroup}>
          <Text style={s.label}>Confirmar Nova Senha</Text>
          <View style={s.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.textMuted} style={s.inputIcon} />
            <TextInput
              style={s.input}
              placeholder="Repita a nova senha"
              placeholderTextColor={theme.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[s.saveButton, saving && s.saveButtonDisabled]} 
          onPress={handleSave} 
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={s.saveButtonText}>Alterar Senha</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      padding: 24,
    },
    headerTextContainer: {
      marginBottom: 32,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.textSecondary,
      marginBottom: 8,
      marginLeft: 4,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? theme.border : 'transparent',
      paddingHorizontal: 16,
      height: 52,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: theme.textPrimary,
    },
    eyeIcon: {
      padding: 4,
    },
    saveButton: {
      backgroundColor: theme.primary,
      borderRadius: 14,
      height: 54,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 12,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    saveButtonDisabled: {
      opacity: 0.7,
    },
    saveButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '700',
    },
  });
