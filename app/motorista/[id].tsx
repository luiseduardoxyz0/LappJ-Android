import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Espelha os dados de coordenador.tsx
const MOTORISTAS_MOCK = [
  {
    id: '1',
    name: 'João da Silva',
    initials: 'JS',
    rota: 'Zona Norte',
    telefone: '(11) 99001-1111',
    entregas: 12,
    total: 18,
    status: 'Em Jornada',
    statusColor: '#4CAF50',
    eta: '15:30',
    atraso: false,
    jornadaInicio: '07:45',
    ultimaAtualizacao: '14:20',
    endereco: 'Av. Luiz Dumont Villares, 620 - Zona Norte',
  },
  {
    id: '2',
    name: 'Ana Rodrigues',
    initials: 'AR',
    rota: 'Centro',
    telefone: '(11) 99002-2222',
    entregas: 8,
    total: 14,
    status: 'Em Almoço',
    statusColor: '#FF9800',
    eta: '16:00',
    atraso: false,
    jornadaInicio: '08:00',
    ultimaAtualizacao: '12:05',
    endereco: 'R. Direita, 100 - Centro Histórico',
  },
  {
    id: '3',
    name: 'Carlos Mendes',
    initials: 'CM',
    rota: 'Zona Sul',
    telefone: '(11) 99003-3333',
    entregas: 5,
    total: 20,
    status: 'Em Espera',
    statusColor: '#607D8B',
    eta: '17:45',
    atraso: true,
    jornadaInicio: '08:30',
    ultimaAtualizacao: '13:55',
    endereco: 'Av. Interlagos, 800 - Zona Sul',
  },
  {
    id: '4',
    name: 'Patrícia Lima',
    initials: 'PL',
    rota: 'Zona Oeste',
    telefone: '(11) 99004-4444',
    entregas: 18,
    total: 18,
    status: 'Jornada Encerrada',
    statusColor: '#5C7CFA',
    eta: '—',
    atraso: false,
    jornadaInicio: '07:00',
    ultimaAtualizacao: '16:30',
    endereco: 'Av. Faria Lima, 1500 - Pinheiros',
  },
  {
    id: '5',
    name: 'Roberto Souza',
    initials: 'RS',
    rota: 'Grande ABC',
    telefone: '(11) 99005-5555',
    entregas: 3,
    total: 22,
    status: 'Em Jornada',
    statusColor: '#4CAF50',
    eta: '19:00',
    atraso: true,
    jornadaInicio: '09:00',
    ultimaAtualizacao: '14:50',
    endereco: 'Av. Industrial, 3200 - Santo André',
  },
];

export default function MotoristaDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, isDark } = useTheme();
  const router = useRouter();

  const motorista = MOTORISTAS_MOCK.find((m) => m.id === id);
  const s = styles(theme, isDark);

  if (!motorista) {
    return (
      <View style={[s.container, s.centered]}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.textMuted} />
        <Text style={s.emptyText}>Motorista não encontrado</Text>
        <TouchableOpacity style={s.voltarBtn} onPress={() => router.back()}>
          <Text style={s.voltarBtnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const progresso = motorista.total > 0 ? motorista.entregas / motorista.total : 0;
  const avatarBg = motorista.atraso ? '#D32F2F' : theme.primary;

  const handleLigar = () => {
    const numero = motorista.telefone.replace(/\D/g, '');
    Linking.openURL(`tel:${numero}`);
  };

  const handleLocalizar = () => {
    const query = encodeURIComponent(motorista.endereco);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Detalhe do Motorista</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Card perfil */}
        <View style={[s.profileCard, motorista.atraso && s.profileCardAtraso]}>
          <View style={[s.avatar, { backgroundColor: avatarBg }]}>
            <Text style={s.avatarText}>{motorista.initials}</Text>
          </View>
          <View style={s.profileInfo}>
            <View style={s.profileNameRow}>
              <Text style={s.profileName}>{motorista.name}</Text>
              {motorista.atraso && (
                <View style={s.atrasoBadge}>
                  <Text style={s.atrasoBadgeText}>ATRASO</Text>
                </View>
              )}
            </View>
            <Text style={s.profileRota}>{motorista.rota}</Text>
            <View style={[s.statusBadge, { backgroundColor: motorista.statusColor + '20' }]}>
              <View style={[s.statusDot, { backgroundColor: motorista.statusColor }]} />
              <Text style={[s.statusText, { color: motorista.statusColor }]}>
                {motorista.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Ações rápidas */}
        <View style={s.actionsRow}>
          <TouchableOpacity style={s.actionBtn} onPress={handleLigar} activeOpacity={0.8}>
            <Ionicons name="call" size={22} color="#fff" />
            <Text style={s.actionBtnText}>Ligar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.actionBtn, { backgroundColor: isDark ? '#1E3A5F' : '#1A237E' }]}
            onPress={handleLocalizar}
            activeOpacity={0.8}
          >
            <Ionicons name="navigate" size={22} color="#fff" />
            <Text style={s.actionBtnText}>Localizar</Text>
          </TouchableOpacity>
        </View>

        {/* Card — Progresso de entregas */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Progresso de Entregas</Text>
          <View style={s.progressHeader}>
            <Text style={s.progressLabel}>
              {motorista.entregas} de {motorista.total} entregues
            </Text>
            <Text style={[s.progressPct, { color: motorista.atraso ? '#D32F2F' : theme.primary }]}>
              {Math.round(progresso * 100)}%
            </Text>
          </View>
          <View style={s.progressBar}>
            <View
              style={[
                s.progressFill,
                {
                  width: `${progresso * 100}%` as any,
                  backgroundColor: motorista.atraso ? '#D32F2F' : theme.primary,
                },
              ]}
            />
          </View>
          <View style={s.progressMeta}>
            <View style={s.metaItem}>
              <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
              <Text style={s.metaText}>{motorista.entregas} entregues</Text>
            </View>
            <View style={s.metaItem}>
              <Ionicons name="cube-outline" size={14} color={theme.textMuted} />
              <Text style={s.metaText}>{motorista.total - motorista.entregas} restantes</Text>
            </View>
          </View>
        </View>

        {/* Card — Jornada */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Dados da Jornada</Text>

          <View style={s.infoRow}>
            <Ionicons name="play-circle-outline" size={18} color="#4CAF50" />
            <View style={s.infoContent}>
              <Text style={s.infoLabel}>Início</Text>
              <Text style={s.infoValue}>{motorista.jornadaInicio}</Text>
            </View>
          </View>

          <View style={s.divider} />

          <View style={s.infoRow}>
            <Ionicons name="time-outline" size={18} color={theme.textMuted} />
            <View style={s.infoContent}>
              <Text style={s.infoLabel}>Última atualização</Text>
              <Text style={s.infoValue}>{motorista.ultimaAtualizacao}</Text>
            </View>
          </View>

          <View style={s.divider} />

          <View style={s.infoRow}>
            <Ionicons
              name="flag-outline"
              size={18}
              color={motorista.status === 'Jornada Encerrada' ? '#5C7CFA' : theme.textMuted}
            />
            <View style={s.infoContent}>
              <Text style={s.infoLabel}>Previsão de encerramento (ETA)</Text>
              <Text style={s.infoValue}>{motorista.eta}</Text>
            </View>
          </View>
        </View>

        {/* Card — Localização */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Última Localização Conhecida</Text>
          <View style={s.infoRow}>
            <Ionicons name="location-outline" size={18} color={theme.textMuted} />
            <Text style={[s.infoValue, { flex: 1 }]}>{motorista.endereco}</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    centered: { justifyContent: 'center', alignItems: 'center', gap: 12 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    backButton: {
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
      alignItems: 'center', justifyContent: 'center',
    },
    headerTitle: { fontSize: 17, fontWeight: '700', color: theme.textPrimary },
    scrollContent: { padding: 16, gap: 12 },

    profileCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },
    profileCardAtraso: { borderColor: '#D32F2F', borderWidth: 2 },
    avatar: {
      width: 56, height: 56, borderRadius: 28,
      justifyContent: 'center', alignItems: 'center',
    },
    avatarText: { color: '#fff', fontWeight: '700', fontSize: 18 },
    profileInfo: { flex: 1, gap: 6 },
    profileNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    profileName: { fontSize: 16, fontWeight: '700', color: theme.textPrimary },
    profileRota: { fontSize: 13, color: theme.textMuted },
    statusBadge: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
    },
    statusDot: { width: 7, height: 7, borderRadius: 4 },
    statusText: { fontSize: 12, fontWeight: '700' },
    atrasoBadge: {
      backgroundColor: 'rgba(211,47,47,0.12)',
      paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
    },
    atrasoBadgeText: { fontSize: 9, fontWeight: '700', color: '#D32F2F', letterSpacing: 0.5 },

    actionsRow: { flexDirection: 'row', gap: 12 },
    actionBtn: {
      flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 8, backgroundColor: '#2E7D32', borderRadius: 10, paddingVertical: 13,
    },
    actionBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

    card: {
      backgroundColor: theme.card,
      borderRadius: 12, padding: 16, gap: 12,
      borderWidth: 1, borderColor: theme.border,
    },
    cardTitle: {
      fontSize: 11, fontWeight: '700', color: theme.textMuted,
      letterSpacing: 0.8, textTransform: 'uppercase',
    },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    progressLabel: { fontSize: 14, color: theme.textPrimary },
    progressPct: { fontSize: 15, fontWeight: '700' },
    progressBar: {
      height: 8, borderRadius: 4,
      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
      overflow: 'hidden',
    },
    progressFill: { height: '100%', borderRadius: 4 },
    progressMeta: { flexDirection: 'row', gap: 16 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    metaText: { fontSize: 12, color: theme.textMuted },

    infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    infoContent: { flex: 1 },
    infoLabel: { fontSize: 11, color: theme.textMuted, fontWeight: '600', marginBottom: 2 },
    infoValue: { fontSize: 14, color: theme.textPrimary, fontWeight: '500' },
    divider: { height: 1, backgroundColor: theme.border },

    emptyText: { fontSize: 15, color: theme.textMuted },
    voltarBtn: {
      paddingHorizontal: 24, paddingVertical: 10,
      borderRadius: 8, backgroundColor: '#1A237E',
    },
    voltarBtnText: { color: '#fff', fontWeight: '700' },
  });
