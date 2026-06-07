import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SupportScreen() {
  const { theme, isDark } = useTheme() as any;
  const s = styles(theme, isDark);

  const WHATSAPP_NUMBER = '5563992475340';

  const handleWhatsApp = () => {
    Linking.openURL(`whatsapp://send?phone=${WHATSAPP_NUMBER}&text=Olá! Preciso de ajuda com o aplicativo LappJ.`);
  };

  const handleEmail = () => {
    Linking.openURL('mailto:suporte@lappj.com.br?subject=Suporte LappJ');
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.headerText}>Escolha um canal para falar com nossa equipe de suporte.</Text>

      <TouchableOpacity style={s.card} onPress={handleWhatsApp} activeOpacity={0.8}>
        <View style={[s.iconContainer, { backgroundColor: '#25D366' }]}>
          <Ionicons name="logo-whatsapp" size={28} color="#FFF" />
        </View>
        <View style={s.textContainer}>
          <Text style={s.title}>WhatsApp</Text>
          <Text style={s.description}>Atendimento rápido em horário comercial.</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
      </TouchableOpacity>

      <TouchableOpacity style={s.card} onPress={handleEmail} activeOpacity={0.8}>
        <View style={[s.iconContainer, { backgroundColor: theme.primary }]}>
          <Ionicons name="mail-outline" size={28} color="#FFF" />
        </View>
        <View style={s.textContainer}>
          <Text style={s.title}>E-mail</Text>
          <Text style={s.description}>Para dúvidas menos urgentes ou envios de arquivos.</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
      </TouchableOpacity>

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
      marginBottom: 20,
      paddingHorizontal: 8,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.2 : 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    textContainer: {
      flex: 1,
      marginRight: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 4,
    },
    description: {
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 18,
    },
  });
