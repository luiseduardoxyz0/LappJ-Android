import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LANGUAGES = [
  { id: 'pt', label: 'Português (Brasil)', icon: '🇧🇷' },
  { id: 'en', label: 'English', icon: '🇺🇸' },
  { id: 'es', label: 'Español', icon: '🇪🇸' },
];

export default function LanguageScreen() {
  const { theme, isDark } = useTheme() as any;
  const s = styles(theme, isDark);

  const [selectedLanguage, setSelectedLanguage] = useState('pt');

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.headerText}>Escolha o idioma do aplicativo. Atualmente, apenas Português está disponível em todas as telas.</Text>
      
      <View style={s.card}>
        {LANGUAGES.map((lang, index) => {
          const isSelected = selectedLanguage === lang.id;
          return (
            <TouchableOpacity
              key={lang.id}
              style={[s.row, index < LANGUAGES.length - 1 && s.divider]}
              onPress={() => setSelectedLanguage(lang.id)}
              activeOpacity={0.7}
            >
              <Text style={s.flagIcon}>{lang.icon}</Text>
              <Text style={[s.label, isSelected && s.labelSelected]}>{lang.label}</Text>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      padding: 16,
    },
    headerText: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 24,
      lineHeight: 20,
      paddingHorizontal: 8,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    flagIcon: {
      fontSize: 24,
      marginRight: 16,
    },
    label: {
      flex: 1,
      fontSize: 16,
      color: theme.textPrimary,
    },
    labelSelected: {
      fontWeight: '700',
      color: theme.primary,
    },
  });
