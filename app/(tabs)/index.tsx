import { useEntregas } from '@/constants/EntregasContext';
import { JOURNEY_KEYS } from '@/constants/journeyKeys';
import { getSession, signOut } from '@/constants/localAuth';
import { cancelAllReminders, scheduleJourneyEndReminder, scheduleLunchReminder } from '@/constants/notifications';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const STORAGE_KEYS = JOURNEY_KEYS;

// status: 'idle' | 'started' | 'lunch' | 'waiting' | 'ended'
const STATUS_LABELS = {
  idle: 'Aguardando Início',
  started: 'Em Jornada',
  lunch: 'Em Almoço',
  waiting: 'Em Espera',
  ended: 'Jornada Encerrada',
};

const STATUS_COLORS = {
  idle: '#9E9E9E',
  started: '#4CAF50',
  lunch: '#FF9800',
  waiting: '#607D8B',
  ended: '#F44336',
};

const { width } = Dimensions.get('window');

export type JourneyEvent = { id: string; type: 'lunch' | 'wait'; start: number; end: number | null; duration: number };

export default function DashboardMotoristaScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { entregas } = useEntregas();
  const [time, setTime] = useState(new Date());
  
  const [journeyStatus, setJourneyStatus] = useState<keyof typeof STATUS_LABELS>('idle');
  const [journeyStart, setJourneyStart] = useState<number | null>(null);
  const [lunchStart, setLunchStart] = useState<number | null>(null);
  const [lunchTotal, setLunchTotal] = useState(0);
  const [waitStart, setWaitStart] = useState<number | null>(null);
  const [waitTotal, setWaitTotal] = useState(0);
  const [journeyEvents, setJourneyEvents] = useState<JourneyEvent[]>([]);
  const [journeyEnd, setJourneyEnd] = useState<number | null>(null);
  const [workedSeconds, setWorkedSeconds] = useState(0);
  const [userName, setUserName] = useState('Usuário');
  const [userInitials, setUserInitials] = useState('?');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [historicoAberto, setHistoricoAberto] = useState(false);
  const stateRef = useRef({ journeyStatus, journeyStart, lunchStart, lunchTotal, waitStart, waitTotal });

  useEffect(() => {
    stateRef.current = { journeyStatus, journeyStart, lunchStart, lunchTotal, waitStart, waitTotal };
  }, [journeyStatus, journeyStart, lunchStart, lunchTotal, waitStart, waitTotal]);

  // Carrega estado persistido ao montar e ao focar a tela
  useFocusEffect(
    useCallback(() => {
      getSession().then((session) => {
        if (!session) return;
        setUserName(session.name);
        const uid = (session as any).uid || '';
        const parts = session.name.trim().split(' ');
        const initials = parts.length >= 2
          ? parts[0][0] + parts[parts.length - 1][0]
          : parts[0].substring(0, 2);
        setUserInitials(initials.toUpperCase());
        // Carrega avatar individual por usuário
        if (uid) {
          AsyncStorage.getItem(`@lappj_avatar_uri_${uid}`).then((uri) => {
            setAvatarUri(uri || null);
          });
        }
      });
    }, [])
  );

  // Carrega jornada persistida ao montar
  useEffect(() => {
    const loadState = async () => {
      const [status, start, lStart, lTotal, wStart, wTotal, end, eventsStr] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.STATUS),
        AsyncStorage.getItem(STORAGE_KEYS.START),
        AsyncStorage.getItem(STORAGE_KEYS.LUNCH_START),
        AsyncStorage.getItem(STORAGE_KEYS.LUNCH_TOTAL),
        AsyncStorage.getItem(STORAGE_KEYS.WAIT_START),
        AsyncStorage.getItem(STORAGE_KEYS.WAIT_TOTAL),
        AsyncStorage.getItem(STORAGE_KEYS.END),
        AsyncStorage.getItem(STORAGE_KEYS.EVENTS),
      ]);
      if (status) setJourneyStatus(status as keyof typeof STATUS_LABELS);
      if (start) setJourneyStart(Number(start));
      if (lStart) setLunchStart(Number(lStart));
      if (lTotal) setLunchTotal(Number(lTotal));
      if (wStart) setWaitStart(Number(wStart));
      if (wTotal) setWaitTotal(Number(wTotal));
      if (end) setJourneyEnd(Number(end));
      if (eventsStr) setJourneyEvents(JSON.parse(eventsStr));
    };
    loadState();
  }, []);

  // Timer: atualiza relógio e horas trabalhadas a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      const { journeyStatus: st, journeyStart: jStart, lunchStart: lStart, lunchTotal: lTot, waitStart: wStart, waitTotal: wTot } = stateRef.current;
      if (st === 'idle' || st === 'ended' || !jStart) {
        setWorkedSeconds(0);
        return;
      }
      const nowMs = now.getTime();
      let elapsed = Math.floor((nowMs - jStart) / 1000);
      let pausedSec = lTot + wTot;
      if (st === 'lunch' && lStart) pausedSec += Math.floor((nowMs - lStart) / 1000);
      if (st === 'waiting' && wStart) pausedSec += Math.floor((nowMs - wStart) / 1000);
      setWorkedSeconds(Math.max(0, elapsed - pausedSec));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatClock = () => {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    const s = String(time.getSeconds()).padStart(2, '0');
    return { hours: h, minutes: m, seconds: s };
  };

  const formatDate = () => {
    const days = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const months = ['de janeiro', 'de fevereiro', 'de março', 'de abril', 'de maio', 'de junho',
                    'de julho', 'de agosto', 'de setembro', 'de outubro', 'de novembro', 'de dezembro'];
    return `${days[time.getDay()]}, ${time.getDate()} ${months[time.getMonth()]}`;
  };

  const formatWorked = () => {
    const h = String(Math.floor(workedSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((workedSeconds % 3600) / 60)).padStart(2, '0');
    return `${h}:${m}h`;
  };

  const formatTimestamp = (ts: number | null) => {
    if (!ts) return '';
    const d = new Date(ts);
    return `às ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const saveState = async (updates: Record<string, string | number>) => {
    const pairs = Object.entries(updates).map(([key, val]) => [key, String(val)] as [string, string]);
    await AsyncStorage.multiSet(pairs);
  };

  const handleJourneyAction = async (action: 'start' | 'lunch' | 'endLunch' | 'waiting' | 'endWaiting' | 'end') => {
    const now = Date.now();

    if (action === 'start') {
      if (journeyStatus !== 'idle') return;
      setJourneyStatus('started');
      setJourneyStart(now);
      setLunchTotal(0);
      setWaitTotal(0);
      setJourneyEvents([]);
      
      // Agenda lembrete de fim de jornada de 8h
      const journeyAlerts = await AsyncStorage.getItem('@lappj_notif_journey');
      if (journeyAlerts !== 'false') {
        await cancelAllReminders();
        await scheduleJourneyEndReminder();
      }

      await saveState({
        [STORAGE_KEYS.STATUS]: 'started',
        [STORAGE_KEYS.START]: now,
        [STORAGE_KEYS.LUNCH_TOTAL]: 0,
        [STORAGE_KEYS.WAIT_TOTAL]: 0,
        [STORAGE_KEYS.EVENTS]: '[]',
      });

    } else if (action === 'lunch') {
      if (journeyStatus !== 'started') return;
      setJourneyStatus('lunch');
      setLunchStart(now);
      
      const journeyAlerts = await AsyncStorage.getItem('@lappj_notif_journey');
      if (journeyAlerts !== 'false') {
        await scheduleLunchReminder();
      }

      await saveState({
        [STORAGE_KEYS.STATUS]: 'lunch',
        [STORAGE_KEYS.LUNCH_START]: now,
      });

    } else if (action === 'endLunch') {
      if (journeyStatus !== 'lunch') return;
      const elapsed = lunchStart ? Math.floor((now - lunchStart) / 1000) : 0;
      const newTotal = lunchTotal + elapsed;
      const newEvent: JourneyEvent = { id: Date.now().toString(), type: 'lunch', start: lunchStart!, end: now, duration: elapsed };
      const updatedEvents = [...journeyEvents, newEvent];
      
      setJourneyStatus('started');
      setLunchStart(null);
      setLunchTotal(newTotal);
      setJourneyEvents(updatedEvents);
      
      await cancelAllReminders(); // Cancela o alerta de almoço

      await saveState({
        [STORAGE_KEYS.STATUS]: 'started',
        [STORAGE_KEYS.LUNCH_TOTAL]: newTotal,
        [STORAGE_KEYS.EVENTS]: JSON.stringify(updatedEvents),
      });
      await AsyncStorage.removeItem(STORAGE_KEYS.LUNCH_START);

    } else if (action === 'waiting') {
      if (journeyStatus !== 'started') return;
      setJourneyStatus('waiting');
      setWaitStart(now);
      await saveState({
        [STORAGE_KEYS.STATUS]: 'waiting',
        [STORAGE_KEYS.WAIT_START]: now,
      });

    } else if (action === 'endWaiting') {
      if (journeyStatus !== 'waiting') return;
      const elapsed = waitStart ? Math.floor((now - waitStart) / 1000) : 0;
      const newTotal = waitTotal + elapsed;
      const newEvent: JourneyEvent = { id: Date.now().toString(), type: 'wait', start: waitStart!, end: now, duration: elapsed };
      const updatedEvents = [...journeyEvents, newEvent];
      
      setJourneyStatus('started');
      setWaitStart(null);
      setWaitTotal(newTotal);
      setJourneyEvents(updatedEvents);
      
      await saveState({
        [STORAGE_KEYS.STATUS]: 'started',
        [STORAGE_KEYS.WAIT_TOTAL]: newTotal,
        [STORAGE_KEYS.EVENTS]: JSON.stringify(updatedEvents),
      });
      await AsyncStorage.removeItem(STORAGE_KEYS.WAIT_START);

    } else if (action === 'end') {
      if (journeyStatus === 'idle' || journeyStatus === 'ended') return;
      Alert.alert(
        'Encerrar Jornada',
        'Tem certeza que deseja encerrar a jornada? Esta ação não pode ser desfeita.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Encerrar',
            style: 'destructive',
            onPress: async () => {
              setJourneyStatus('ended');
              setJourneyEnd(now);
              await cancelAllReminders(); // Cancela qualquer alerta pendente
              await saveState({
                [STORAGE_KEYS.STATUS]: 'ended',
                [STORAGE_KEYS.END]: now,
              });
            },
          },
        ]
      );
    }
  };

  const handleResetJourney = () => {
    Alert.alert(
      'Nova Jornada',
      'Iniciar uma nova jornada irá apagar os dados da jornada anterior.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
            setJourneyStatus('idle');
            setJourneyStart(null);
            setLunchStart(null);
            setLunchTotal(0);
            setWaitStart(null);
            setWaitTotal(0);
            setJourneyEvents([]);
            setJourneyEnd(null);
            setWorkedSeconds(0);
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja encerrar a sessão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const { hours, minutes, seconds } = formatClock();
  const s = styles(theme, isDark);

  const canStart = journeyStatus === 'idle';
  const canLunch = journeyStatus === 'started';
  const canEndLunch = journeyStatus === 'lunch';
  const canWait = journeyStatus === 'started';
  const canEndWait = journeyStatus === 'waiting';
  const canEnd = journeyStatus === 'started' || journeyStatus === 'lunch' || journeyStatus === 'waiting';
  const journeyDone = journeyStatus === 'ended';

  const statusDotColor = STATUS_COLORS[journeyStatus] || '#9E9E9E';

  return (
    <ScrollView contentContainerStyle={[s.scrollContent, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={s.avatarImage} />
          ) : (
            <View style={s.avatar}>
              <Text style={s.avatarText}>{userInitials}</Text>
            </View>
          )}
          <View>
            <Text style={s.userName}>{userName}</Text>
            <Text style={s.journeyText}>{STATUS_LABELS[journeyStatus]}</Text>
          </View>
        </View>
        <TouchableOpacity style={s.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={theme.textSecondary} />
        </TouchableOpacity>

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
            <View style={[s.statusDot, { backgroundColor: statusDotColor }]} />
            <Text style={s.statusValue}>{STATUS_LABELS[journeyStatus]}</Text>
          </View>
        </View>
      </View>

      {/* Métricas */}
      <View style={s.metricsContainer}>
        <View style={s.metricCard}>
          <Ionicons name="time" size={28} color={theme.primary} />
          <Text style={s.metricLabel}>HORAS{'\n'}TRABALHADAS</Text>
          <Text style={s.metricValue}>{formatWorked()}</Text>
        </View>
        <View style={s.metricCard}>
          <Ionicons name="cube" size={28} color={theme.primary} />
          <Text style={s.metricLabel}>ENTREGAS{'\n'}CONCLUÍDAS</Text>
          <Text style={s.metricValue}>
            {entregas.filter((e) => e.status === 'entregue').length}/{entregas.length}
          </Text>
        </View>
      </View>

      {/* Ações de Controle */}
      <Text style={s.actionsLabel}>AÇÕES DE CONTROLE</Text>

      {/* Grid de Ações */}
      <View style={s.actionGrid}>
        {/* Iniciar / Nova Jornada */}
        <TouchableOpacity
          style={[
            s.gridButton,
            canStart || journeyDone ? s.gridButtonStart : s.gridButtonInactive,
          ]}
          onPress={() => canStart ? handleJourneyAction('start') : (journeyDone ? handleResetJourney() : null)}
          disabled={!canStart && !journeyDone}
        >
          <Ionicons name={journeyDone ? 'refresh-circle' : 'play-circle'} size={32} color={canStart || journeyDone ? 'white' : theme.textMuted} />
          <Text style={[s.gridButtonText, !canStart && !journeyDone && { color: theme.textMuted }]}>
            {journeyDone ? 'NOVA JORNADA' : 'INICIAR JORNADA'}
          </Text>
          {journeyStart && !journeyDone && (
            <Text style={[s.gridButtonSub, { color: theme.textMuted }]}>iniciado {formatTimestamp(journeyStart)}</Text>
          )}
        </TouchableOpacity>
        {/* Iniciar Almoço */}
        <TouchableOpacity
          style={[
            s.gridButton,
            canLunch ? s.gridButtonActive : canEndLunch ? s.gridButtonActiveDone : s.gridButtonInactive,
          ]}
          onPress={() => handleJourneyAction('lunch')}
          disabled={!canLunch}
        >
          <Ionicons name="restaurant" size={32} color={canLunch ? 'white' : canEndLunch ? theme.accent : theme.textMuted} />
          <Text style={[s.gridButtonText, !canLunch && !canEndLunch && { color: theme.textMuted }, canEndLunch && { color: theme.accent }]}>
            INICIAR ALMOÇO
          </Text>
          {canEndLunch && (
            <Text style={[s.gridButtonSub, { color: theme.accent }]}>em andamento</Text>
          )}
        </TouchableOpacity>

        {/* Fim do Almoço */}
        <TouchableOpacity
          style={[s.gridButton, canEndLunch ? s.gridButtonActive : s.gridButtonInactive]}
          onPress={() => handleJourneyAction('endLunch')}
          disabled={!canEndLunch}
        >
          <Ionicons name="cut" size={32} color={canEndLunch ? 'white' : theme.textMuted} />
          <Text style={[s.gridButtonText, !canEndLunch && { color: theme.textMuted }]}>
            FIM DO ALMOÇO
          </Text>
        </TouchableOpacity>

        {/* Iniciar Espera */}
        <TouchableOpacity
          style={[
            s.gridButton,
            canWait ? s.gridButtonWaiting : canEndWait ? s.gridButtonWaitingDone : s.gridButtonInactive,
          ]}
          onPress={() => handleJourneyAction('waiting')}
          disabled={!canWait}
        >
          <Ionicons name="hourglass" size={32} color={canWait ? 'white' : canEndWait ? theme.textSecondary : theme.textMuted} />
          <Text style={[s.gridButtonText, !canWait && !canEndWait && { color: theme.textMuted }, canEndWait && { color: theme.textSecondary }]}>
            INICIAR ESPERA
          </Text>
          {canEndWait && (
            <Text style={[s.gridButtonSub, { color: theme.textSecondary }]}>em andamento</Text>
          )}
        </TouchableOpacity>

        {/* Fim da Espera */}
        <TouchableOpacity
          style={[s.gridButton, canEndWait ? s.gridButtonWaiting : s.gridButtonInactive]}
          onPress={() => handleJourneyAction('endWaiting')}
          disabled={!canEndWait}
        >
          <Ionicons name="ban" size={32} color={canEndWait ? 'white' : theme.textMuted} />
          <Text style={[s.gridButtonText, !canEndWait && { color: theme.textMuted }]}>
            FIM DA ESPERA
          </Text>
        </TouchableOpacity>

        {/* Fim da Jornada */}
        <TouchableOpacity
          style={[s.gridButton, canEnd ? s.gridButtonEnd : s.gridButtonInactive]}
          onPress={() => handleJourneyAction('end')}
          disabled={!canEnd}
        >
          <Ionicons name="stop-circle" size={32} color={canEnd ? 'white' : theme.textMuted} />
          <Text style={[s.gridButtonText, !canEnd && { color: theme.textMuted }]}>FIM DA JORNADA</Text>
        </TouchableOpacity>
      </View>

      {/* Próxima Parada */}
      <View style={s.nextStopCard}>
        <Text style={s.nextStopLabel}>PRÓXIMA PARADA</Text>
        <Text style={s.nextStopName}>CD Logística Central</Text>
        <View style={s.nextStopLocation}>
          <Ionicons name="location" size={16} color={theme.textSecondary} />
          <Text style={s.nextStopAddress}>Rua das Indústrias, 450 • 2.4km</Text>
        </View>
      </View>

      {/* Histórico da Jornada */}
      {journeyStatus !== 'idle' && (
        <View style={s.historicoCard}>
          <TouchableOpacity
            style={s.historicoHeader}
            onPress={() => setHistoricoAberto((v) => !v)}
            activeOpacity={0.7}
          >
            <View style={s.historicoHeaderLeft}>
              <Ionicons name="time" size={18} color={theme.primary} />
              <Text style={s.historicoTitle}>HISTÓRICO DA JORNADA</Text>
            </View>
            <Ionicons
              name={historicoAberto ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={theme.textMuted}
            />
          </TouchableOpacity>

          {historicoAberto && (
            <View style={s.historicoBody}>
              {/* Início */}
              {journeyStart && (
                <View style={s.historicoEvento}>
                  <View style={[s.historicoDot, { backgroundColor: '#4CAF50' }]} />
                  <View style={s.historicoInfo}>
                    <Text style={s.historicoEventoLabel}>Início da Jornada</Text>
                    <Text style={s.historicoEventoTime}>{formatTimestamp(journeyStart)}</Text>
                  </View>
                </View>
              )}

              {/* Eventos Concluídos (Almoços e Esperas) */}
              {journeyEvents.map((ev) => (
                <View key={ev.id} style={s.historicoEvento}>
                  <View style={[s.historicoDot, { backgroundColor: ev.type === 'lunch' ? '#FF9800' : '#607D8B', opacity: 0.5 }]} />
                  <View style={s.historicoInfo}>
                    <Text style={s.historicoEventoLabel}>
                      {ev.type === 'lunch' ? 'Almoço (Concluído)' : 'Espera (Concluída)'}
                    </Text>
                    <Text style={s.historicoEventoTime}>
                      {formatTimestamp(ev.start)} até {formatTimestamp(ev.end)} • duração: {Math.floor(ev.duration / 60)}min
                    </Text>
                  </View>
                </View>
              ))}

              {/* Almoço em andamento */}
              {lunchStart && (
                <View style={s.historicoEvento}>
                  <View style={[s.historicoDot, { backgroundColor: '#FF9800' }]} />
                  <View style={s.historicoInfo}>
                    <Text style={s.historicoEventoLabel}>Almoço iniciado</Text>
                    <Text style={s.historicoEventoTime}>{formatTimestamp(lunchStart)}</Text>
                  </View>
                  {journeyStatus === 'lunch' && (
                    <View style={s.historicoBadge}>
                      <Text style={[s.historicoBadgeText, { color: '#FF9800' }]}>EM ANDAMENTO</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Espera em andamento */}
              {waitStart && (
                <View style={s.historicoEvento}>
                  <View style={[s.historicoDot, { backgroundColor: '#607D8B' }]} />
                  <View style={s.historicoInfo}>
                    <Text style={s.historicoEventoLabel}>Espera iniciada</Text>
                    <Text style={s.historicoEventoTime}>{formatTimestamp(waitStart)}</Text>
                  </View>
                  {journeyStatus === 'waiting' && (
                    <View style={s.historicoBadge}>
                      <Text style={[s.historicoBadgeText, { color: '#607D8B' }]}>EM ANDAMENTO</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Fim */}
              {journeyStatus === 'ended' && (
                <View style={s.historicoEvento}>
                  <View style={[s.historicoDot, { backgroundColor: '#F44336' }]} />
                  <View style={s.historicoInfo}>
                    <Text style={s.historicoEventoLabel}>Fim da Jornada</Text>
                    <Text style={s.historicoEventoTime}>
                      {journeyEnd ? formatTimestamp(journeyEnd) + ' • ' : ''}total: {formatWorked()}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = (theme: any, isDark: boolean) =>
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
    logoutButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: isDark ? theme.surfaceSecondary : '#F0F2F8',
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
    avatarImage: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 12,
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
    gridButtonStart: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    gridButtonEnd: {
      backgroundColor: '#D32F2F',
      borderColor: '#D32F2F',
    },
    gridButtonActive: {
      backgroundColor: theme.accent,
      borderColor: theme.accent,
    },
    gridButtonActiveDone: {
      borderColor: theme.accent,
      borderWidth: 2,
    },
    gridButtonWaiting: {
      backgroundColor: theme.textSecondary,
      borderColor: theme.textSecondary,
    },
    gridButtonWaitingDone: {
      borderColor: theme.textSecondary,
      borderWidth: 2,
    },
    gridButtonInactive: {
      opacity: 0.45,
    },
    gridButtonText: {
      fontSize: 13,
      fontWeight: '700',
      color: 'white',
      marginTop: 12,
      textAlign: 'center',
    },
    gridButtonSub: {
      fontSize: 10,
      fontWeight: '600',
      marginTop: 4,
      textAlign: 'center',
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
    historicoCard: {
      marginHorizontal: 16,
      marginBottom: 20,
      backgroundColor: theme.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
    },
    historicoHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    historicoHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    historicoTitle: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.2,
      color: theme.textMuted,
    },
    historicoBody: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      gap: 14,
      paddingTop: 14,
    },
    historicoEvento: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    historicoDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    historicoInfo: {
      flex: 1,
    },
    historicoEventoLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    historicoEventoTime: {
      fontSize: 12,
      color: theme.textMuted,
      marginTop: 2,
    },
    historicoBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
    },
    historicoBadgeText: {
      fontSize: 9,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
  });
