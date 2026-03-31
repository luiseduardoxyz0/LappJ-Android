import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function DashboardMotoristaScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const [time, setTime] = useState(new Date());
  const [journeyStatus, setJourneyStatus] = useState('started');

  const s = styles(theme, isDark);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    return { hours, minutes, seconds };
  };

  const formatDate = () => {
    const days = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const months = ['de janeiro', 'de fevereiro', 'de março', 'de abril', 'de maio', 'de junho',
                    'de julho', 'de agosto', 'de setembro', 'de outubro', 'de novembro', 'de dezembro'];
    
    const day = time.getDate();
    const dayName = days[time.getDay()];
    const monthName = months[time.getMonth()];
    
    return `${dayName}, ${day} ${monthName}`;
  };

  const { hours, minutes, seconds } = formatTime();

  const handleJourneyAction = (action) => {
    console.log('Ação:', action);
  };

  return (
    <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>JS</Text>
          </View>
          <View>
            <Text style={s.userName}>João da Silva</Text>
            <Text style={s.journeyText}>Em Jornada</Text>
          </View>
        </View>
        <View style={s.headerIcons}>
          <Ionicons name="location" size={24} color={theme.accent} style={s.icon} />
          <Ionicons name="wifi" size={24} color={theme.textPrimary} style={s.icon} />
          <Ionicons name="notifications" size={24} color={theme.textPrimary} />
        </View>
      </View>

      {/* Relógio Digital */}
      <View style={s.timeSection}>
        <Text style={s.timeLabel}>HORÁRIO ATUAL</Text>
        <View style={s.timeContainer}>
          <Text style={s.timeHours}>{hours}:{minutes}</Text>
          <Text style={s.timeSeconds}>{seconds}</Text>
        </View>
        <Text style={s.dateText}>{formatDate()}</Text>
      </View>

      {/* Status Card */}
      <View style={s.statusCard}>
        <View style={s.statusLeft}>
          <Text style={s.statusLabel}>STATUS DO MOTORISTA</Text>
          <View style={s.statusRow}>
            <View style={s.statusDot} />
            <Text style={s.statusValue}>Em Jornada</Text>
          </View>
        </View>
      </View>

      {/* Métricas - 2 colunas */}
      <View style={s.metricsContainer}>
        <View style={s.metricCard}>
          <Ionicons name="time" size={28} color={theme.primary} />
          <Text style={s.metricLabel}>HORAS{'\n'}TRABALHADAS</Text>
          <Text style={s.metricValue}>02:15h</Text>
        </View>
        <View style={s.metricCard}>
          <Ionicons name="cube" size={28} color={theme.primary} />
          <Text style={s.metricLabel}>ENTREGAS{'\n'}CONCLUÍDAS</Text>
          <Text style={s.metricValue}>12/18</Text>
        </View>
      </View>

      {/* Ações de Controle */}
      <Text style={s.actionsLabel}>AÇÕES DE CONTROLE</Text>

      {/* Iniciar Jornada (desabilitado) */}
      <View style={s.actionItem}>
        <View style={[s.actionButton, s.actionDisabled]}>
          <Ionicons name="play-circle" size={24} color={theme.textMuted} />
          <View style={s.actionTexts}>
            <Text style={s.actionTitle}>Iniciar Jornada</Text>
            <Text style={s.actionSubtitle}>Registrado às 06:27</Text>
          </View>
        </View>
        <View style={s.actionCheck}>
          <Ionicons name="checkmark-circle" size={24} color={theme.accent} />
        </View>
      </View>

      {/* Grid 2x2 de Ações */}
      <View style={s.actionGrid}>
        <TouchableOpacity
          style={[s.gridButton, s.gridButtonActive]}
          onPress={() => handleJourneyAction('lunch')}
        >
          <Ionicons name="restaurant" size={32} color="white" />
          <Text style={s.gridButtonText}>INICIAR ALMOÇO</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.gridButton}
          onPress={() => handleJourneyAction('endLunch')}
        >
          <Ionicons name="cut" size={32} color={theme.primary} />
          <Text style={[s.gridButtonText, { color: theme.primary }]}>FIM DO ALMOÇO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.gridButton, s.gridButtonWaiting]}
          onPress={() => handleJourneyAction('waiting')}
        >
          <Ionicons name="hourglass" size={32} color="white" />
          <Text style={s.gridButtonText}>INICIAR ESPERA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.gridButton}
          onPress={() => handleJourneyAction('endWaiting')}
        >
          <Ionicons name="ban" size={32} color={theme.textSecondary} />
          <Text style={[s.gridButtonText, { color: theme.textSecondary }]}>FIM DA ESPERA</Text>
        </TouchableOpacity>
      </View>

      {/* Botão Fim da Jornada */}
      <TouchableOpacity style={s.endJourneyButton} onPress={() => handleJourneyAction('end')}>
        <Ionicons name="stop-circle" size={20} color="white" style={{ marginRight: 8 }} />
        <Text style={s.endJourneyText}>Fim da Jornada</Text>
      </TouchableOpacity>

      {/* Próxima Parada */}
      <View style={s.nextStopCard}>
        <Text style={s.nextStopLabel}>PRÓXIMA PARADA</Text>
        <Text style={s.nextStopName}>CD Logística Central</Text>
        <View style={s.nextStopLocation}>
          <Ionicons name="location" size={16} color={theme.textSecondary} />
          <Text style={s.nextStopAddress}>Rua das Indústrias, 450 • 2.4km</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = (theme, isDark) =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 80,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 14,
    },
    userName: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 2,
    },
    journeyText: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    headerIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    icon: {
      marginLeft: 4,
    },
    timeSection: {
      alignItems: 'center',
      paddingVertical: 32,
      paddingHorizontal: 16,
      backgroundColor: isDark ? theme.surfaceSecondary : theme.surfaceSecondary,
    },
    timeLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.5,
      color: theme.textSecondary,
      marginBottom: 12,
    },
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
      marginBottom: 8,
    },
    timeHours: {
      fontSize: 64,
      fontWeight: '700',
      color: theme.primary,
    },
    timeSeconds: {
      fontSize: 20,
      color: theme.primary,
      marginTop: 8,
      marginLeft: 4,
      opacity: 0.6,
    },
    dateText: {
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 8,
    },
    statusCard: {
      marginHorizontal: 16,
      marginTop: 20,
      padding: 16,
      backgroundColor: theme.surface,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
      borderWidth: 1,
      borderColor: isDark ? theme.border : 'transparent',
    },
    statusLeft: {
      flex: 1,
    },
    statusLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.5,
      color: theme.textMuted,
      marginBottom: 8,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#4CAF50',
      marginRight: 8,
    },
    statusValue: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.primary,
    },
    metricsContainer: {
      flexDirection: 'row',
      marginHorizontal: 16,
      marginTop: 20,
      gap: 12,
    },
    metricCard: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.surface,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDark ? theme.border : 'transparent',
    },
    metricLabel: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1,
      color: theme.textMuted,
      textAlign: 'center',
      marginVertical: 8,
      lineHeight: 14,
    },
    metricValue: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.primary,
    },
    actionsLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.5,
      color: theme.textMuted,
      marginHorizontal: 16,
      marginTop: 24,
      marginBottom: 12,
    },
    actionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginBottom: 16,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      padding: 12,
      backgroundColor: theme.surface,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: isDark ? theme.border : 'transparent',
      alignItems: 'center',
    },
    actionDisabled: {
      opacity: 0.6,
    },
    actionTexts: {
      marginLeft: 12,
      flex: 1,
    },
    actionTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textMuted,
    },
    actionSubtitle: {
      fontSize: 12,
      color: theme.textMuted,
      opacity: 0.7,
      marginTop: 2,
    },
    actionCheck: {
      marginLeft: 8,
    },
    actionGrid: {
      marginHorizontal: 16,
      marginBottom: 16,
      gap: 12,
    },
    gridButton: {
      paddingVertical: 24,
      paddingHorizontal: 16,
      backgroundColor: theme.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? theme.border : 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 0,
    },
    gridButtonActive: {
      backgroundColor: theme.accent,
      borderColor: theme.accent,
      marginBottom: 12,
    },
    gridButtonWaiting: {
      backgroundColor: theme.textSecondary,
      borderColor: theme.textSecondary,
    },
    gridButtonText: {
      fontSize: 13,
      fontWeight: '700',
      color: 'white',
      marginTop: 12,
      textAlign: 'center',
    },
    endJourneyButton: {
      marginHorizontal: 16,
      marginBottom: 16,
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: theme.primary,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    endJourneyText: {
      fontSize: 15,
      fontWeight: '700',
      color: 'white',
    },
    nextStopCard: {
      marginHorizontal: 16,
      marginBottom: 20,
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: theme.primary,
      borderRadius: 12,
    },
    nextStopLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.5,
      color: isDark ? theme.accent : 'rgba(255, 255, 255, 0.7)',
      marginBottom: 8,
    },
    nextStopName: {
      fontSize: 18,
      fontWeight: '700',
      color: 'white',
      marginBottom: 8,
    },
    nextStopLocation: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    nextStopAddress: {
      fontSize: 13,
      color: 'rgba(255, 255, 255, 0.8)',
      marginLeft: 6,
    },
  });
