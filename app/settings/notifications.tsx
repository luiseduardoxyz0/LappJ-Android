import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

export default function NotificationsScreen() {
  const { theme, isDark } = useTheme() as any;
  const s = styles(theme, isDark);

  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [journeyAlerts, setJourneyAlerts] = useState(true);

  const SettingRow = ({ icon, title, description, value, onValueChange }: any) => (
    <View style={s.row}>
      <View style={s.iconContainer}>
        <Ionicons name={icon} size={22} color={theme.primary} />
      </View>
      <View style={s.textContainer}>
        <Text style={s.title}>{title}</Text>
        <Text style={s.description}>{description}</Text>
      </View>
      <Switch
        trackColor={{ false: theme.border, true: theme.primary }}
        thumbColor={'#fff'}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.sectionTitle}>Geral</Text>
      <View style={s.card}>
        <SettingRow
          icon="notifications-outline"
          title="Notificações Push"
          description="Receba alertas sobre novas entregas."
          value={pushEnabled}
          onValueChange={setPushEnabled}
        />
        <View style={s.divider} />
        <SettingRow
          icon="volume-high-outline"
          title="Sons do Aplicativo"
          description="Tocar sons ao receber notificações."
          value={soundEnabled}
          onValueChange={setSoundEnabled}
        />
      </View>

      <Text style={s.sectionTitle}>Jornada</Text>
      <View style={s.card}>
        <SettingRow
          icon="time-outline"
          title="Alertas de Jornada"
          description="Avisos sobre o limite de tempo da jornada e pausas."
          value={journeyAlerts}
          onValueChange={setJourneyAlerts}
        />
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
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: 16,
      marginBottom: 8,
      marginLeft: 8,
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
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    textContainer: {
      flex: 1,
      marginRight: 16,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 4,
    },
    description: {
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 18,
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginLeft: 72,
    },
  });
