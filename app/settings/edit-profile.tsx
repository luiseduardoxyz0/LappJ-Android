import { getSession, updateUserData } from '@/constants/localAuth';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

export default function EditProfileScreen() {
  const { theme, isDark } = useTheme() as any;
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uid, setUid] = useState('');
  
  // Fields
  const [name, setName] = useState('');
  const [telefone, setTelefone] = useState('');
  const [placa, setPlaca] = useState('');
  const [frota, setFrota] = useState('');

  const s = styles(theme, isDark);

  useEffect(() => {
    getSession().then((session: any) => {
      if (session) {
        setUid(session.uid);
        setName(session.name || '');
        setTelefone(session.telefone || '');
        setPlaca(session.placa || '');
        setFrota(session.frota || '');
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome não pode ficar vazio.');
      return;
    }
    setSaving(true);
    try {
      await updateUserData(uid, {
        name: name.trim(),
        telefone: telefone.trim(),
        placa: placa.trim(),
        frota: frota.trim(),
      });
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível atualizar o perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 20 }]} keyboardShouldPersistTaps="handled">
        
        <View style={s.inputGroup}>
          <Text style={s.label}>Nome Completo</Text>
          <View style={s.inputWrapper}>
            <Ionicons name="person-outline" size={20} color={theme.textMuted} style={s.inputIcon} />
            <TextInput
              style={s.input}
              placeholder="Digite seu nome"
              placeholderTextColor={theme.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        <View style={s.inputGroup}>
          <Text style={s.label}>Telefone</Text>
          <View style={s.inputWrapper}>
            <Ionicons name="call-outline" size={20} color={theme.textMuted} style={s.inputIcon} />
            <TextInput
              style={s.input}
              placeholder="(00) 00000-0000"
              placeholderTextColor={theme.textMuted}
              value={telefone}
              onChangeText={setTelefone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={s.inputGroup}>
          <Text style={s.label}>Placa do Veículo</Text>
          <View style={s.inputWrapper}>
            <Ionicons name="car-outline" size={20} color={theme.textMuted} style={s.inputIcon} />
            <TextInput
              style={s.input}
              placeholder="ABC-1234"
              placeholderTextColor={theme.textMuted}
              value={placa}
              onChangeText={(text) => setPlaca(text.toUpperCase())}
              autoCapitalize="characters"
            />
          </View>
        </View>

        <View style={s.inputGroup}>
          <Text style={s.label}>Frota</Text>
          <View style={s.inputWrapper}>
            <Ionicons name="business-outline" size={20} color={theme.textMuted} style={s.inputIcon} />
            <TextInput
              style={s.input}
              placeholder="Ex: Frota Norte"
              placeholderTextColor={theme.textMuted}
              value={frota}
              onChangeText={setFrota}
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
            <Text style={s.saveButtonText}>Salvar Alterações</Text>
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
