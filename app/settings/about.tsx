import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AboutScreen() {
  const { theme, isDark } = useTheme() as any;
  const s = styles(theme, isDark);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.logoContainer}>
        <View style={s.logoCircle}>
          <Ionicons name="cube-outline" size={64} color="#FFF" />
        </View>
        <Text style={s.appName}>LappJ</Text>
        <Text style={s.version}>Versão 1.0.0-BETA</Text>
      </View>

      <View style={s.card}>
        <Text style={s.description}>
          LappJ é uma plataforma completa para coordenação de entregas logísticas, projetada para simplificar a rotina de motoristas e facilitar a gestão de frotas para coordenadores.
        </Text>
      </View>

      <Text style={s.sectionTitle}>Desenvolvimento</Text>
      <View style={s.linksCard}>
        <TouchableOpacity style={s.linkRow} onPress={() => Linking.openURL('https://lappj.com.br')} activeOpacity={0.7}>
          <Ionicons name="globe-outline" size={22} color={theme.primary} />
          <Text style={s.linkLabel}>Site Oficial</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
        </TouchableOpacity>
        <View style={s.divider} />
        <TouchableOpacity style={s.linkRow} onPress={() => Linking.openURL('https://instagram.com')} activeOpacity={0.7}>
          <Ionicons name="logo-instagram" size={22} color={theme.primary} />
          <Text style={s.linkLabel}>Instagram</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
        </TouchableOpacity>
      </View>

      <Text style={s.footer}>© 2026 LappJ Logística. Todos os direitos reservados.</Text>
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
    logoContainer: {
      alignItems: 'center',
      marginTop: 32,
      marginBottom: 32,
    },
    logoCircle: {
      width: 100,
      height: 100,
      borderRadius: 32,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    appName: {
      fontSize: 28,
      fontWeight: '800',
      color: theme.textPrimary,
      marginBottom: 4,
    },
    version: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
    },
    description: {
      fontSize: 15,
      color: theme.textSecondary,
      lineHeight: 24,
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 8,
      marginLeft: 8,
    },
    linksCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 32,
    },
    linkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    linkLabel: {
      flex: 1,
      fontSize: 16,
      fontWeight: '500',
      color: theme.textPrimary,
      marginLeft: 16,
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginLeft: 54,
    },
    footer: {
      textAlign: 'center',
      fontSize: 12,
      color: theme.textMuted,
      marginBottom: 32,
    },
  });
