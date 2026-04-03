import { registerUser } from '@/constants/localAuth';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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

export default function RegisterScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [perfil, setPerfil] = useState<'motorista' | 'coordenador'>('motorista');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const s = styles(theme, isDark);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Senhas diferentes', 'As senhas informadas não coincidem.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Senha fraca', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await registerUser({ email: email.trim(), password, name: name.trim(), perfil });
      Alert.alert(
        'Conta criada!',
        `Bem-vindo(a), ${name.trim()}! Faça login para continuar.`,
        [{ text: 'Fazer Login', onPress: () => router.replace('/login' as any) }]
      );
    } catch (error: any) {
      Alert.alert('Erro ao cadastrar', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={s.container}
    >
      <ScrollView contentContainerStyle={[s.scrollContent, { paddingTop: insets.top, paddingBottom: insets.bottom }]} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.headerContainer}>
          <TouchableOpacity style={s.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.primary} />
          </TouchableOpacity>
          <View style={s.logoBox}>
            <Ionicons name="person-add" size={28} color="white" />
          </View>
          <Text style={s.logoText}>Criar Conta</Text>
          <Text style={s.subtitle}>CADASTRE-SE NO LAPPJ</Text>
        </View>

        {/* Card */}
        <View style={s.card}>
          {/* Toggle perfil */}
          <View style={s.profileToggleContainer}>
            <TouchableOpacity
              style={[s.toggleButton, perfil === 'motorista' && s.toggleButtonActive]}
              onPress={() => setPerfil('motorista')}
            >
              <Text style={[s.toggleButtonText, perfil === 'motorista' && s.toggleButtonTextActive]}>
                Motorista
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.toggleButton, perfil === 'coordenador' && s.toggleButtonActive]}
              onPress={() => setPerfil('coordenador')}
            >
              <Text style={[s.toggleButtonText, perfil === 'coordenador' && s.toggleButtonTextActive]}>
                Coordenador
              </Text>
            </TouchableOpacity>
          </View>

          {/* Nome */}
          <Text style={s.label}>NOME COMPLETO</Text>
          <View style={s.inputContainer}>
            <Ionicons name="person-outline" size={20} color={theme.textMuted} />
            <TextInput
              style={s.input}
              placeholder="Seu nome completo"
              placeholderTextColor={theme.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* E-mail */}
          <Text style={s.label}>E-MAIL</Text>
          <View style={s.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={theme.textMuted} />
            <TextInput
              style={s.input}
              placeholder="nome@lappj.com"
              placeholderTextColor={theme.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Senha */}
          <Text style={s.label}>SENHA</Text>
          <View style={s.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.textMuted} />
            <TextInput
              style={s.input}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={theme.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons
                name={passwordVisible ? 'eye' : 'eye-off'}
                size={20}
                color={theme.textMuted}
              />
            </TouchableOpacity>
          </View>

          {/* Confirmar Senha */}
          <Text style={s.label}>CONFIRMAR SENHA</Text>
          <View style={s.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.textMuted} />
            <TextInput
              style={s.input}
              placeholder="Repita a senha"
              placeholderTextColor={theme.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!passwordVisible}
            />
          </View>

          {/* Botão Cadastrar */}
          <TouchableOpacity style={s.registerButton} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={s.registerButtonText}>Criar Conta</Text>
                <Ionicons name="checkmark-circle-outline" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>

          {/* Link voltar ao login */}
          <TouchableOpacity style={s.loginLink} onPress={() => router.replace('/login' as any)}>
            <Text style={s.loginLinkText}>
              Já tem conta? <Text style={s.loginLinkBold}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </View>
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
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingVertical: 20,
    },
    headerContainer: {
      alignItems: 'center',
      marginBottom: 24,
    },
    backButton: {
      alignSelf: 'flex-start',
      marginBottom: 16,
      padding: 4,
    },
    logoBox: {
      width: 56,
      height: 56,
      borderRadius: 14,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    logoText: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.primary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 2,
      color: theme.textSecondary,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      paddingHorizontal: 20,
      paddingVertical: 24,
      borderWidth: 1,
      borderColor: theme.border,
    },
    profileToggleContainer: {
      flexDirection: 'row',
      marginBottom: 20,
      backgroundColor: isDark ? theme.surfaceSecondary : '#F5F6FA',
      borderRadius: 12,
      padding: 4,
    },
    toggleButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
    },
    toggleButtonActive: {
      backgroundColor: isDark ? theme.surface : '#FFFFFF',
      borderWidth: 1,
      borderColor: theme.border,
    },
    toggleButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    toggleButtonTextActive: {
      color: theme.primary,
    },
    label: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.5,
      color: theme.textMuted,
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBackground,
      borderRadius: 10,
      paddingHorizontal: 12,
      marginBottom: 16,
      height: 50,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    input: {
      flex: 1,
      marginHorizontal: 10,
      fontSize: 15,
      color: theme.textPrimary,
    },
    registerButton: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 16,
      gap: 8,
    },
    registerButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    loginLink: {
      alignItems: 'center',
      paddingVertical: 4,
    },
    loginLinkText: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    loginLinkBold: {
      fontWeight: '700',
      color: theme.primary,
    },
  });
