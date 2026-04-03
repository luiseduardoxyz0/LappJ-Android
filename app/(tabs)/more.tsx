import { getSession, signOut } from '@/constants/localAuth';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const MENU_ITEMS = [
  {
    section: 'Conta',
    items: [
      { icon: 'person-outline', label: 'Editar Perfil', soon: true },
      { icon: 'lock-closed-outline', label: 'Alterar Senha', soon: true },
      { icon: 'notifications-outline', label: 'Notificações', soon: true },
    ],
  },
  {
    section: 'Aplicativo',
    items: [
      { icon: 'color-palette-outline', label: 'Aparência', soon: true },
      { icon: 'language-outline', label: 'Idioma', soon: true },
      { icon: 'shield-checkmark-outline', label: 'Privacidade', soon: true },
    ],
  },
  {
    section: 'Suporte',
    items: [
      { icon: 'help-circle-outline', label: 'Ajuda e FAQ', soon: true },
      { icon: 'chatbubble-outline', label: 'Falar com Suporte', soon: true },
      { icon: 'information-circle-outline', label: 'Sobre o LappJ', soon: true },
    ],
  },
];

export default function MoreScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPerfil, setUserPerfil] = useState('');
  const [userInitials, setUserInitials] = useState('');

  const s = styles(theme, isDark);

  useEffect(() => {
    getSession().then((session) => {
      if (!session) return;
      setUserName(session.name);
      setUserEmail(session.email);
      setUserPerfil(session.perfil);
      const parts = session.name.trim().split(' ');
      const initials =
        parts.length >= 2
          ? parts[0][0] + parts[parts.length - 1][0]
          : parts[0].substring(0, 2);
      setUserInitials(initials.toUpperCase());
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

  const handleSoon = (label: string) => {
    Alert.alert('Em breve', `"${label}" estará disponível em uma próxima versão.`);
  };

  const perfilLabel = userPerfil === 'coordenador' ? 'Coordenador' : 'Motorista';
  const perfilIcon = userPerfil === 'coordenador' ? 'briefcase' : 'car';

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Card de perfil */}
      <View style={s.profileCard}>
        <View style={s.avatarWrapper}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{userInitials}</Text>
          </View>
          <View style={s.perfilBadge}>
            <Ionicons name={perfilIcon as any} size={12} color="white" />
          </View>
        </View>
        <View style={s.profileInfo}>
          <Text style={s.profileName}>{userName}</Text>
          <Text style={s.profileEmail}>{userEmail}</Text>
          <View style={s.perfilPill}>
            <Text style={s.perfilPillText}>{perfilLabel}</Text>
          </View>
        </View>
      </View>

      {/* Seções do menu */}
      {MENU_ITEMS.map((section) => (
        <View key={section.section} style={s.section}>
          <Text style={s.sectionTitle}>{section.section.toUpperCase()}</Text>
          <View style={s.sectionCard}>
            {section.items.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[s.menuItem, index < section.items.length - 1 && s.menuItemBorder]}
                onPress={() => handleSoon(item.label)}
                activeOpacity={0.7}
              >
                <View style={s.menuItemLeft}>
                  <View style={s.menuIconBox}>
                    <Ionicons name={item.icon as any} size={20} color={theme.primary} />
                  </View>
                  <Text style={s.menuItemLabel}>{item.label}</Text>
                </View>
                <View style={s.menuItemRight}>
                  {item.soon && (
                    <View style={s.soonBadge}>
                      <Text style={s.soonText}>BREVE</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Botão de logout */}
      <TouchableOpacity style={s.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#D32F2F" />
        <Text style={s.logoutText}>Encerrar Sessão</Text>
      </TouchableOpacity>

      {/* Versão */}
      <Text style={s.version}>LappJ v1.0.0-BETA • © 2026</Text>
    </ScrollView>
  );
}

const styles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    content: { paddingBottom: 32 },
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 16,
      padding: 16,
      backgroundColor: theme.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isDark ? theme.border : 'transparent',
      gap: 16,
    },
    avatarWrapper: { position: 'relative' },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: { color: 'white', fontSize: 22, fontWeight: '700' },
    perfilBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.surface,
    },
    profileInfo: { flex: 1, gap: 2 },
    profileName: { fontSize: 16, fontWeight: '700', color: theme.textPrimary },
    profileEmail: { fontSize: 13, color: theme.textSecondary, marginBottom: 6 },
    perfilPill: {
      alignSelf: 'flex-start',
      backgroundColor: theme.primary + '20',
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 3,
    },
    perfilPillText: { fontSize: 11, fontWeight: '700', color: theme.primary },
    section: { marginHorizontal: 16, marginBottom: 16 },
    sectionTitle: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.2,
      color: theme.textMuted,
      marginBottom: 8,
      marginLeft: 4,
    },
    sectionCard: {
      backgroundColor: theme.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: isDark ? theme.border : 'transparent',
      overflow: 'hidden',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      paddingHorizontal: 14,
    },
    menuItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    menuIconBox: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: theme.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuItemLabel: { fontSize: 15, fontWeight: '500', color: theme.textPrimary },
    menuItemRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    soonBadge: {
      backgroundColor: theme.primary + '20',
      borderRadius: 6,
      paddingHorizontal: 7,
      paddingVertical: 2,
    },
    soonText: { fontSize: 9, fontWeight: '700', color: theme.primary, letterSpacing: 0.5 },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 16,
      marginTop: 4,
      marginBottom: 16,
      paddingVertical: 14,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: '#D32F2F',
      backgroundColor: '#D32F2F10',
      gap: 8,
    },
    logoutText: { fontSize: 15, fontWeight: '700', color: '#D32F2F' },
    version: {
      textAlign: 'center',
      fontSize: 12,
      color: theme.textMuted,
      marginBottom: 8,
    },
  });
