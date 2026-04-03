import { getSession, signOut } from '@/constants/localAuth';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const MOTORISTAS_MOCK = [
  {
    id: '1',
    name: 'João da Silva',
    initials: 'JS',
    rota: 'Zona Norte',
    entregas: 12,
    total: 18,
    status: 'Em Jornada',
    statusColor: '#4CAF50',
    eta: '15:30',
    atraso: false,
  },
  {
    id: '2',
    name: 'Ana Rodrigues',
    initials: 'AR',
    rota: 'Centro',
    entregas: 8,
    total: 14,
    status: 'Em Almoço',
    statusColor: '#FF9800',
    eta: '16:00',
    atraso: false,
  },
  {
    id: '3',
    name: 'Carlos Mendes',
    initials: 'CM',
    rota: 'Zona Sul',
    entregas: 5,
    total: 20,
    status: 'Em Espera',
    statusColor: '#607D8B',
    eta: '17:45',
    atraso: true,
  },
  {
    id: '4',
    name: 'Patrícia Lima',
    initials: 'PL',
    rota: 'Zona Oeste',
    entregas: 18,
    total: 18,
    status: 'Jornada Encerrada',
    statusColor: '#5C7CFA',
    eta: '—',
    atraso: false,
  },
  {
    id: '5',
    name: 'Roberto Souza',
    initials: 'RS',
    rota: 'Grande ABC',
    entregas: 3,
    total: 22,
    status: 'Em Jornada',
    statusColor: '#4CAF50',
    eta: '19:00',
    atraso: true,
  },
];

export default function DashboardCoordenadorScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [userName, setUserName] = useState('Coordenador');
  const [userInitials, setUserInitials] = useState('C');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');

  const s = styles(theme, isDark);

  useEffect(() => {
    getSession().then((session) => {
      if (session?.name) {
        setUserName(session.name);
        const parts = session.name.trim().split(' ');
        const initials = parts.length >= 2
          ? parts[0][0] + parts[parts.length - 1][0]
          : parts[0].substring(0, 2);
        setUserInitials(initials.toUpperCase());
      }
    });
  }, []);

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/login' as any);
        },
      },
    ]);
  };

  const FILTERS = ['Todos', 'Em Jornada', 'Em Almoço', 'Em Espera', 'Encerrada'];

  const filtered = MOTORISTAS_MOCK.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.rota.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filterStatus === 'Todos' ||
      (filterStatus === 'Encerrada'
        ? m.status === 'Jornada Encerrada'
        : m.status === filterStatus);
    return matchSearch && matchFilter;
  });

  const totalEmJornada = MOTORISTAS_MOCK.filter((m) => m.status === 'Em Jornada').length;
  const totalAtrasos = MOTORISTAS_MOCK.filter((m) => m.atraso).length;
  const totalEntregas = MOTORISTAS_MOCK.reduce((acc, m) => acc + m.entregas, 0);
  const totalPrevisto = MOTORISTAS_MOCK.reduce((acc, m) => acc + m.total, 0);

  const renderMotorista = ({ item }: { item: typeof MOTORISTAS_MOCK[0] }) => {
    const progresso = item.total > 0 ? item.entregas / item.total : 0;
    return (
      <TouchableOpacity
        style={[s.card, item.atraso && s.cardAtraso]}
        activeOpacity={0.7}
        onPress={() => router.push({ pathname: '/motorista/[id]', params: { id: item.id } })}
      >
        <View style={s.cardHeader}>
          <View style={s.cardLeft}>
            <View style={[s.avatar, { backgroundColor: item.atraso ? '#D32F2F' : theme.primary }]}>
              <Text style={s.avatarText}>{item.initials}</Text>
            </View>
            <View style={s.cardInfo}>
              <View style={s.cardNameRow}>
                <Text style={s.cardName}>{item.name}</Text>
                {item.atraso && (
                  <View style={s.atrasoBadge}>
                    <Text style={s.atrasoBadgeText}>ATRASO</Text>
                  </View>
                )}
              </View>
              <Text style={s.cardRota}>{item.rota}</Text>
            </View>
          </View>
          <View style={[s.statusBadge, { backgroundColor: item.statusColor + '20' }]}>
            <View style={[s.statusDot, { backgroundColor: item.statusColor }]} />
            <Text style={[s.statusText, { color: item.statusColor }]}>{item.status}</Text>
          </View>
        </View>

        <View style={s.progressRow}>
          <View style={s.progressBar}>
            <View style={[s.progressFill, { width: `${progresso * 100}%` as any, backgroundColor: item.atraso ? '#D32F2F' : theme.primary }]} />
          </View>
          <Text style={s.progressText}>{item.entregas}/{item.total}</Text>
        </View>

        <View style={s.cardFooter}>
          <View style={s.cardFooterItem}>
            <Ionicons name="time-outline" size={14} color={theme.textMuted} />
            <Text style={s.cardFooterText}>ETA: {item.eta}</Text>
          </View>
          <View style={s.cardFooterItem}>
            <Ionicons name="cube-outline" size={14} color={theme.textMuted} />
            <Text style={s.cardFooterText}>{item.total - item.entregas} restantes</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{userInitials}</Text>
          </View>
          <View>
            <Text style={s.userName}>{userName}</Text>
            <Text style={s.userRole}>Coordenador</Text>
          </View>
        </View>
        <TouchableOpacity style={s.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Métricas resumo */}
      <View style={s.metricsRow}>
        <View style={s.metricCard}>
          <Ionicons name="car" size={22} color={theme.primary} />
          <Text style={s.metricValue}>{totalEmJornada}</Text>
          <Text style={s.metricLabel}>EM{'\n'}ROTA</Text>
        </View>
        <View style={s.metricCard}>
          <Ionicons name="cube" size={22} color={theme.primary} />
          <Text style={s.metricValue}>{totalEntregas}/{totalPrevisto}</Text>
          <Text style={s.metricLabel}>ENTREGAS{'\n'}HOJE</Text>
        </View>
        <View style={[s.metricCard, totalAtrasos > 0 && s.metricCardAtraso]}>
          <Ionicons name="warning" size={22} color={totalAtrasos > 0 ? '#D32F2F' : theme.primary} />
          <Text style={[s.metricValue, totalAtrasos > 0 && { color: '#D32F2F' }]}>{totalAtrasos}</Text>
          <Text style={s.metricLabel}>ATRASOS{'\n'}CRÍTICOS</Text>
        </View>
        <View style={s.metricCard}>
          <Ionicons name="people" size={22} color={theme.primary} />
          <Text style={s.metricValue}>{MOTORISTAS_MOCK.length}</Text>
          <Text style={s.metricLabel}>TOTAL{'\n'}MOTORISTAS</Text>
        </View>
      </View>

      {/* Busca */}
      <View style={s.searchContainer}>
        <Ionicons name="search" size={18} color={theme.textMuted} />
        <TextInput
          style={s.searchInput}
          placeholder="Buscar motorista ou rota..."
          placeholderTextColor={theme.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filtersScroll} contentContainerStyle={s.filtersContent} alwaysBounceHorizontal={false}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[s.filterButton, filterStatus === f && s.filterButtonActive]}
            onPress={() => setFilterStatus(f)}
          >
            <Text style={[s.filterText, filterStatus === f && s.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderMotorista}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="people-outline" size={48} color={theme.textMuted} />
            <Text style={s.emptyText}>Nenhum motorista encontrado</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarText: { color: 'white', fontWeight: '700', fontSize: 14 },
    userName: { fontSize: 14, fontWeight: '700', color: theme.textPrimary },
    userRole: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
    logoutButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: isDark ? theme.surfaceSecondary : '#F0F2F8',
    },
    metricsRow: {
      flexDirection: 'row',
      paddingHorizontal: 12,
      paddingVertical: 16,
      gap: 8,
    },
    metricCard: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDark ? theme.border : 'transparent',
    },
    metricCardAtraso: {
      borderColor: '#D32F2F',
      borderWidth: 1.5,
    },
    metricValue: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.primary,
      marginTop: 6,
    },
    metricLabel: {
      fontSize: 9,
      fontWeight: '700',
      letterSpacing: 0.5,
      color: theme.textMuted,
      textAlign: 'center',
      marginTop: 4,
      lineHeight: 13,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginBottom: 12,
      backgroundColor: theme.inputBackground,
      borderRadius: 10,
      paddingHorizontal: 12,
      height: 44,
      gap: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: theme.textPrimary,
    },
    filtersScroll: { marginBottom: 4 },
    filtersContent: { paddingHorizontal: 16, paddingVertical: 6, gap: 8 },
    filterButton: {
      paddingHorizontal: 14,
      height: 34,
      borderRadius: 17,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    filterButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    filterText: { fontSize: 12, fontWeight: '600', color: theme.textSecondary },
    filterTextActive: { color: 'white' },
    listContent: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 24 },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? theme.border : 'transparent',
    },
    cardAtraso: {
      borderColor: '#D32F2F',
      borderWidth: 1.5,
      borderLeftWidth: 4,
      borderLeftColor: '#D32F2F',
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    cardInfo: { flex: 1 },
    cardNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    cardName: { fontSize: 14, fontWeight: '700', color: theme.textPrimary },
    cardRota: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
    atrasoBadge: {
      backgroundColor: '#D32F2F20',
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    atrasoBadgeText: { fontSize: 9, fontWeight: '700', color: '#D32F2F' },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      gap: 5,
    },
    statusDot: { width: 7, height: 7, borderRadius: 4 },
    statusText: { fontSize: 11, fontWeight: '700' },
    progressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      gap: 10,
    },
    progressBar: {
      flex: 1,
      height: 6,
      backgroundColor: isDark ? theme.border : '#E8EAF6',
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressFill: { height: 6, borderRadius: 3 },
    progressText: { fontSize: 12, fontWeight: '700', color: theme.textSecondary, minWidth: 36 },
    cardFooter: { flexDirection: 'row', gap: 16 },
    cardFooterItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    cardFooterText: { fontSize: 12, color: theme.textMuted },
    empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
    emptyText: { fontSize: 15, color: theme.textMuted },
  });
