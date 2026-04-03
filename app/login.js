import { signIn } from '@/constants/localAuth';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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

export default function LoginScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const REMEMBER_KEY = '@lappj_remember_access';

  useEffect(() => {
    AsyncStorage.getItem(REMEMBER_KEY).then((saved) => {
      if (saved) {
        const { email: savedEmail, password: savedPassword } = JSON.parse(saved);
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    });
  }, []);

  const s = styles(theme, isDark);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      const session = await signIn(email.trim(), password);
      if (rememberMe) {
        await AsyncStorage.setItem(REMEMBER_KEY, JSON.stringify({ email: email.trim(), password }));
      } else {
        await AsyncStorage.removeItem(REMEMBER_KEY);
      }
      if (session.perfil === 'dev') {
        router.replace('/admin');
      } else if (session.perfil === 'coordenador') {
        router.replace('/coordenador');
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('Erro de acesso', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Recuperar senha',
      'Entre em contato com o administrador do sistema para redefinir sua senha.',
      [{ text: 'OK' }]
    );
  };

  const handleGoogleLogin = () => {
    Alert.alert('Em breve', 'Login com Google será implementado em breve.');
  };

  const handleMicrosoftLogin = () => {
    Alert.alert('Em breve', 'Login com Microsoft será implementado em breve.');
  };

  const handleSupportContact = () => {
    Alert.alert('Suporte LappJ', 'Entre em contato: suporte@lappj.com');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={s.container}
    >
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header com logo */}
        <View style={s.headerContainer}>
          <View style={s.logoBox}>
            <Ionicons name="car" size={28} color="white" />
          </View>
          <Text style={s.logoText}>LappJ</Text>
        </View>

        {/* Subtítulo */}
        <Text style={s.subtitle}>GESTÃO DE JORNADA E ENTREGAS</Text>

        {/* Card principal */}
        <View style={s.card}>
          {/* Label Email */}
          <Text style={s.label}>E-MAIL CORPORATIVO</Text>

          {/* Input Email */}
          <View style={s.inputContainer}>
            <Ionicons name="mail" size={20} color={theme.textMuted} />
            <TextInput
              style={s.input}
              placeholder="nome@lappj.com"
              placeholderTextColor={theme.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={true}
            />
          </View>

          {/* Label Senha */}
          <View style={s.passwordLabelContainer}>
            <Text style={s.label}>SENHA DE ACESSO</Text>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={s.forgotPasswordLink}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </View>

          {/* Input Senha */}
          <View style={s.inputContainer}>
            <Ionicons name="lock-closed" size={20} color={theme.textMuted} />
            <TextInput
              style={s.input}
              placeholder="••••••••"
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

          {/* Lembrar acesso */}
          <TouchableOpacity style={s.rememberRow} onPress={() => setRememberMe(!rememberMe)}>
            <View style={[s.checkbox, rememberMe && s.checkboxActive]}>
              {rememberMe && <Ionicons name="checkmark" size={13} color="white" />}
            </View>
            <Text style={s.rememberText}>Lembrar acesso</Text>
          </TouchableOpacity>

          {/* Botão Entrar */}
          <TouchableOpacity style={s.loginButton} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={s.loginButtonText}>Entrar na Jornada</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>

          {/* Botão Criar Conta */}
          <TouchableOpacity style={s.registerButton} onPress={() => router.push('/register')}>
            <Ionicons name="person-add-outline" size={20} color={theme.primary} />
            <Text style={s.registerButtonText}>Criar Conta</Text>
          </TouchableOpacity>

          {/* Divisor OU CONTINUE COM */}
          <View style={s.dividerContainer}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>OU CONTINUE COM</Text>
            <View style={s.dividerLine} />
          </View>

          {/* Botões Google e Microsoft */}
          <View style={s.socialButtonsContainer}>
            <TouchableOpacity style={s.socialButton} onPress={handleGoogleLogin}>
              <Ionicons name="logo-google" size={24} color="#F5A623" />
              <Text style={s.socialButtonText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.socialButton} onPress={handleMicrosoftLogin}>
              <Ionicons name="logo-microsoft" size={24} color="#00A4EF" />
              <Text style={s.socialButtonText}>Microsoft</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Link de suporte */}
        <View style={s.supportContainer}>
          <Text style={s.supportTextMuted}>Problemas no acesso?</Text>
          <TouchableOpacity onPress={handleSupportContact}>
            <Text style={s.supportLink}>Contate o Suporte LappJ</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>© 2026 LAPPJ LOGISTICS</Text>
          <Text style={s.footerVersion}>VERSÃO 1.0.0-BETA</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = (theme, isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingVertical: 20,
      justifyContent: 'space-between',
    },
    headerContainer: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 8,
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
      fontSize: 32,
      fontWeight: '700',
      color: theme.primary,
    },
    subtitle: {
      fontSize: 13,
      fontWeight: '600',
      letterSpacing: 2,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 28,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      paddingHorizontal: 20,
      paddingVertical: 24,
      borderWidth: 1,
      borderColor: isDark ? theme.border : theme.border,
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
    passwordLabelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    forgotPasswordLink: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.primary,
    },
    rememberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
      gap: 10,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 5,
      borderWidth: 1.5,
      borderColor: theme.border,
      backgroundColor: isDark ? theme.surfaceSecondary : '#F5F6FA',
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    rememberText: {
      fontSize: 14,
      color: theme.textSecondary,
      fontWeight: '500',
    },
    loginButton: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 12,
      marginBottom: 24,
    },
    loginButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
      marginRight: 8,
    },
    registerButton: {
      borderWidth: 1.5,
      borderColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
      gap: 8,
    },
    registerButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.primary,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 20,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.border,
    },
    dividerText: {
      marginHorizontal: 12,
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 1,
      color: theme.textSecondary,
    },
    socialButtonsContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    socialButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: isDark ? theme.surfaceSecondary : '#F5F6FA',
    },
    socialButtonText: {
      marginLeft: 8,
      fontSize: 14,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    supportContainer: {
      alignItems: 'center',
      marginVertical: 20,
    },
    supportTextMuted: {
      fontSize: 14,
      color: theme.textMuted,
      marginBottom: 4,
    },
    supportLink: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.primary,
    },
    footer: {
      alignItems: 'center',
      marginBottom: 16,
    },
    footerText: {
      fontSize: 12,
      color: theme.textMuted,
      marginBottom: 2,
    },
    footerVersion: {
      fontSize: 11,
      color: theme.textMuted,
      letterSpacing: 0.5,
    },
  });
