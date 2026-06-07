import { useTheme } from '@/constants/ThemeContext';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PrivacyScreen() {
  const { theme, isDark } = useTheme() as any;
  const s = styles(theme, isDark);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.card}>
        <Text style={s.title}>Política de Privacidade e Termos de Uso</Text>
        <Text style={s.lastUpdated}>Última atualização: 07 de Junho de 2026</Text>

        <Text style={s.heading}>1. Coleta de Dados</Text>
        <Text style={s.paragraph}>
          O LappJ coleta dados essenciais para o funcionamento do serviço de entregas, incluindo localização (quando ativo), informações de perfil (nome, telefone, veículo) e histórico de jornadas.
        </Text>

        <Text style={s.heading}>2. Uso das Informações</Text>
        <Text style={s.paragraph}>
          Suas informações são utilizadas exclusivamente para coordenar as entregas diárias, registrar horários de trabalho e garantir a comunicação efetiva com o coordenador da frota.
        </Text>

        <Text style={s.heading}>3. Segurança</Text>
        <Text style={s.paragraph}>
          Seus dados são armazenados de forma segura utilizando as melhores práticas da nuvem. O acesso às senhas é criptografado e restrito ao seu próprio login.
        </Text>

        <Text style={s.heading}>4. Compartilhamento</Text>
        <Text style={s.paragraph}>
          Não compartilhamos seus dados com terceiros. Apenas a empresa coordenadora da frota tem acesso ao histórico de entregas e jornadas realizadas.
        </Text>
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
    card: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 24,
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: '800',
      color: theme.textPrimary,
      marginBottom: 8,
    },
    lastUpdated: {
      fontSize: 12,
      color: theme.textMuted,
      marginBottom: 24,
    },
    heading: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.primary,
      marginTop: 16,
      marginBottom: 8,
    },
    paragraph: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 22,
    },
  });
