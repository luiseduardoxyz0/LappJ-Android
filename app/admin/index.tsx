import {
    adminChangeRole,
    adminClearJourneyData,
    adminDeleteUser,
    adminGetAllUsers,
    adminResetDatabase,
    getSession,
    signOut,
} from '@/constants/localAuth';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type User = {
  email: string;
  name: string;
  perfil: 'motorista' | 'coordenador' | 'dev';
  password: string;
};

const PERFIL_COLORS: Record<string, string> = {
  dev: '#FF6B35',
  coordenador: '#5C7CFA',
  motorista: '#4CAF50',
};

const PERFIL_ICONS: Record<string, string> = {
  dev: 'terminal',
  coordenador: 'briefcase',
  motorista: 'car',
};

export default function AdminDashboard() {
  const { theme, isDark } = useTheme() as any;
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [adminName, setAdminName] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const s = styles(theme, isDark);

  const loadData = useCallback(async () => {
    setRefreshing(true);
    const [allUsers, session] = await Promise.all([adminGetAllUsers(), getSession()]);
    setUsers(allUsers);
    if (session?.name) setAdminName(session.name);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja encerrar a sessão de desenvolvedor?', [
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

  const handleDeleteUser = (user: User) => {
    if (user.perfil === 'dev') {
      Alert.alert('Não permitido', 'A conta de desenvolvedor não pode ser removida.');
      return;
    }
    Alert.alert(
      'Apagar conta',
      `Tem certeza que deseja apagar a conta de "${user.name}" (${user.email})?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            await adminDeleteUser(user.email);
            loadData();
          },
        },
      ]
    );
  };

  const handleChangeRole = (user: User) => {
    if (user.perfil === 'dev') {
      Alert.alert('Não permitido', 'O perfil da conta de desenvolvedor não pode ser alterado.');
      return;
    }
    const novoPerfil = user.perfil === 'coordenador' ? 'motorista' : 'coordenador';
    Alert.alert(
      'Alterar perfil',
      `Alterar "${user.name}" de ${user.perfil} para ${novoPerfil}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            await adminChangeRole(user.email, novoPerfil);
            loadData();
          },
        },
      ]
    );
  };

  const handleClearJourney = (user: User) => {
    Alert.alert(
      'Apagar jornada',
      `Limpar todos os dados de jornada do app? (Afeta o usuário motorista ativo no momento)`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await adminClearJourneyData(user.email);
            Alert.alert('Concluído', 'Dados de jornada limpos.');
          },
        },
      ]
    );
  };

  const handleResetDatabase = () => {
    Alert.alert(
      '⚠️ Resetar banco de dados',
      'Isso apagará TODOS os usuários cadastrados pelo app e restaurará apenas os usuários padrão. Não há como desfazer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar tudo',
          style: 'destructive',
          onPress: async () => {
            await adminResetDatabase();
            loadData();
          },
        },
      ]
    );
  };

  const renderUser = ({ item: user }: { item: User }) => {
    const color = PERFIL_COLORS[user.perfil] ?? theme.primary;
    const icon = (PERFIL_ICONS[user.perfil] ?? 'person') as any;
    const initials =
      user.name.trim().split(' ').length >= 2
        ? user.name.trim().split(' ')[0][0] + user.name.trim().split(' ').slice(-1)[0][0]
        : user.name.trim().substring(0, 2);

    return (
      <View style={[s.userCard, { borderLeftColor: color }]}>
        {/* Cabeçalho do card */}
        <View style={s.userCardHeader}>
          <View style={[s.userAvatar, { backgroundColor: color + '25' }]}>
            <Text style={[s.userAvatarText, { color }]}>{initials.toUpperCase()}</Text>
          </View>
          <View style={s.userInfo}>
            <Text style={s.userName}>{user.name}</Text>
            <Text style={s.userEmail}>{user.email}</Text>
          </View>
          <View style={[s.perfilBadge, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon} size={12} color={color} />
            <Text style={[s.perfilBadgeText, { color }]}>
              {user.perfil.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Ações */}
        {user.perfil !== 'dev' && (
          <View style={s.userActions}>
            <TouchableOpacity
              style={[s.actionBtn, s.actionBtnSecondary]}
              onPress={() => handleChangeRole(user)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={user.perfil === 'coordenador' ? 'car-outline' : 'briefcase-outline'}
                size={14}
                color={theme.primary}
              />
              <Text style={[s.actionBtnText, { color: theme.primary }]}>
                {user.perfil === 'coordenador' ? 'Tornar Motorista' : 'Tornar Coordenador'}
              </Text>
            </TouchableOpacity>

            {user.perfil === 'motorista' && (
              <TouchableOpacity
                style={[s.actionBtn, s.actionBtnWarn]}
                onPress={() => handleClearJourney(user)}
                activeOpacity={0.7}
              >
                <Ionicons name="refresh-outline" size={14} color="#FF9800" />
                <Text style={[s.actionBtnText, { color: '#FF9800' }]}>Limpar Jornada</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[s.actionBtn, s.actionBtnDanger]}
              onPress={() => handleDeleteUser(user)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={14} color="#D32F2F" />
              <Text style={[s.actionBtnText, { color: '#D32F2F' }]}>Apagar Conta</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const countByPerfil = (perfil: string) => users.filter((u) => u.perfil === perfil).length;

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.devBadge}>
            <Ionicons name="terminal" size={20} color="#FF6B35" />
          </View>
          <View>
            <Text style={s.headerTitle}>Painel Admin</Text>
            <Text style={s.headerSub}>{adminName}</Text>
          </View>
        </View>
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Banners de aviso */}
      <View style={s.warningBanner}>
        <Ionicons name="warning" size={16} color="#FF6B35" />
        <Text style={s.warningText}>Modo Desenvolvedor — Acesso Restrito</Text>
      </View>

      {/* Métricas */}
      <View style={s.metricsRow}>
        <View style={s.metricCard}>
          <Text style={[s.metricValue, { color: '#4CAF50' }]}>{countByPerfil('motorista')}</Text>
          <Text style={s.metricLabel}>MOTORISTAS</Text>
        </View>
        <View style={s.metricCard}>
          <Text style={[s.metricValue, { color: '#5C7CFA' }]}>{countByPerfil('coordenador')}</Text>
          <Text style={s.metricLabel}>COORD.</Text>
        </View>
        <View style={s.metricCard}>
          <Text style={[s.metricValue, { color: '#FF6B35' }]}>{countByPerfil('dev')}</Text>
          <Text style={s.metricLabel}>DEV</Text>
        </View>
        <View style={s.metricCard}>
          <Text style={[s.metricValue, { color: theme.textSecondary }]}>{users.length}</Text>
          <Text style={s.metricLabel}>TOTAL</Text>
        </View>
      </View>

      {/* Título da lista */}
      <Text style={s.listTitle}>CONTAS CADASTRADAS</Text>

      <FlatList
        data={users}
        keyExtractor={(u) => u.email}
        renderItem={renderUser}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} />}
        ListFooterComponent={
          <View style={s.footer}>
            <TouchableOpacity style={s.resetBtn} onPress={handleResetDatabase} activeOpacity={0.7}>
              <Ionicons name="nuclear-outline" size={16} color="#D32F2F" />
              <Text style={s.resetBtnText}>Resetar Banco de Dados</Text>
            </TouchableOpacity>
            <Text style={s.footerNote}>
              Ação irreversível. Restaura apenas contas padrão.
            </Text>
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
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    devBadge: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: '#FF6B3520',
      borderWidth: 1.5,
      borderColor: '#FF6B35',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: { fontSize: 16, fontWeight: '700', color: theme.textPrimary },
    headerSub: { fontSize: 12, color: theme.textSecondary, marginTop: 1 },
    logoutBtn: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: isDark ? theme.surfaceSecondary : '#F0F2F8',
    },
    warningBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginHorizontal: 16,
      marginTop: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      backgroundColor: '#FF6B3515',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#FF6B3540',
    },
    warningText: { fontSize: 13, fontWeight: '600', color: '#FF6B35' },
    metricsRow: {
      flexDirection: 'row',
      paddingHorizontal: 12,
      paddingVertical: 14,
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
    metricValue: { fontSize: 20, fontWeight: '700' },
    metricLabel: {
      fontSize: 9,
      fontWeight: '700',
      letterSpacing: 0.5,
      color: theme.textMuted,
      marginTop: 4,
    },
    listTitle: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.2,
      color: theme.textMuted,
      marginHorizontal: 20,
      marginBottom: 8,
    },
    listContent: { paddingHorizontal: 16, paddingBottom: 24 },
    userCard: {
      backgroundColor: theme.surface,
      borderRadius: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? theme.border : 'transparent',
      borderLeftWidth: 4,
      overflow: 'hidden',
    },
    userCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      gap: 12,
    },
    userAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    userAvatarText: { fontSize: 16, fontWeight: '700' },
    userInfo: { flex: 1 },
    userName: { fontSize: 14, fontWeight: '700', color: theme.textPrimary },
    userEmail: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
    perfilBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    perfilBadgeText: { fontSize: 10, fontWeight: '700' },
    userActions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      paddingHorizontal: 14,
      paddingBottom: 14,
    },
    actionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 8,
      borderWidth: 1,
    },
    actionBtnSecondary: {
      borderColor: theme.primary + '60',
      backgroundColor: theme.primary + '10',
    },
    actionBtnWarn: {
      borderColor: '#FF980060',
      backgroundColor: '#FF980010',
    },
    actionBtnDanger: {
      borderColor: '#D32F2F60',
      backgroundColor: '#D32F2F10',
    },
    actionBtnText: { fontSize: 12, fontWeight: '600' },
    footer: { alignItems: 'center', gap: 8, paddingTop: 8, paddingBottom: 24 },
    resetBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: '#D32F2F',
      backgroundColor: '#D32F2F10',
    },
    resetBtnText: { fontSize: 14, fontWeight: '700', color: '#D32F2F' },
    footerNote: { fontSize: 11, color: theme.textMuted, textAlign: 'center' },
  });
