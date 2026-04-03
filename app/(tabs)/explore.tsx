import { ENTREGAS_MOCK, Entrega } from '@/constants/entregas';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Dados importados de constants/entregas.ts

const STATUS_CONFIG = {
  transito: {
    label: 'EM TRÂNSITO',
    borderColor: '#F5A623',
    badgeBackground: 'rgba(245, 166, 35, 0.15)',
    badgeText: '#F5A623',
  },
  pendente: {
    label: 'PENDENTE',
    borderColor: '#9E9E9E',
    badgeBackground: 'rgba(158, 158, 158, 0.15)',
    badgeText: '#9E9E9E',
  },
  entregue: {
    label: 'ENTREGUE',
    borderColor: '#3949AB',
    badgeBackground: 'rgba(57, 73, 171, 0.15)',
    badgeText: '#3949AB',
  },
};

export default function EntregasScreen() {
  const { theme, isDark } = useTheme();
  const [busca, setBusca] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState('todos');

  const s = styles(theme, isDark);

  const entregasFiltradas = ENTREGAS_MOCK.filter((e) => {
    const matchBusca =
      e.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      e.pedido.toLowerCase().includes(busca.toLowerCase());
    const matchFiltro = filtroAtivo === 'todos' || e.status === filtroAtivo;
    return matchBusca && matchFiltro;
  });

  const renderCard = ({ item }: { item: Entrega }) => {
    const config = STATUS_CONFIG[item.status];
    const isAberta = item.status !== 'entregue';

    return (
      <TouchableOpacity
        style={[s.card, { borderLeftColor: config.borderColor }]}
        activeOpacity={isAberta ? 0.7 : 1}
      >
        {/* Linha superior: cliente + badge status */}
        <View style={s.cardHeader}>
          <View style={s.cardHeaderLeft}>
            <Text style={s.clienteNome}>{item.cliente}</Text>
            <Text style={s.pedidoNumero}>{item.pedido}</Text>
          </View>
          <View style={[s.badge, { backgroundColor: config.badgeBackground }]}>
            <Text style={[s.badgeText, { color: config.badgeText }]}>
              {config.label}
            </Text>
          </View>
        </View>

        {/* Endereço */}
        <View style={s.enderecoRow}>
          <Ionicons name="location-outline" size={14} color={theme.textMuted} />
          <Text style={s.enderecoText}>{item.endereco}</Text>
        </View>

        {/* Linha inferior: ETA + seta */}
        <View style={s.cardFooter}>
          <View style={s.etaRow}>
            <Ionicons
              name={item.status === 'entregue' ? 'checkmark-circle' : 'time-outline'}
              size={14}
              color={item.status === 'entregue' ? '#4CAF50' : theme.textMuted}
            />
            <Text style={[s.etaText, item.status === 'entregue' && { color: '#4CAF50' }]}>
              {item.status === 'entregue' ? `Entregue às ${item.eta}` : `ETA ${item.eta}`}
            </Text>
          </View>
          {isAberta && (
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const totais = {
    todos: ENTREGAS_MOCK.length,
    transito: ENTREGAS_MOCK.filter((e) => e.status === 'transito').length,
    pendente: ENTREGAS_MOCK.filter((e) => e.status === 'pendente').length,
    entregue: ENTREGAS_MOCK.filter((e) => e.status === 'entregue').length,
  };

  const filtros = [
    { key: 'todos', label: `Todos (${totais.todos})` },
    { key: 'transito', label: `Em Trânsito (${totais.transito})` },
    { key: 'pendente', label: `Pendente (${totais.pendente})` },
    { key: 'entregue', label: `Entregue (${totais.entregue})` },
  ];

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>JS</Text>
          </View>
          <Text style={s.headerTitle}>Entregas do Dia</Text>
        </View>
        <Ionicons name="notifications-outline" size={24} color={theme.textPrimary} />
      </View>

      {/* Campo de Busca */}
      <View style={s.searchContainer}>
        <Ionicons name="search-outline" size={18} color={theme.textMuted} />
        <TextInput
          style={s.searchInput}
          placeholder="Buscar cliente ou pedido..."
          placeholderTextColor={theme.textMuted}
          value={busca}
          onChangeText={setBusca}
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={() => setBusca('')}>
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros */}
      <FlatList
        horizontal
        data={filtros}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filtrosContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[s.filtroBtn, filtroAtivo === item.key && s.filtroBtnAtivo]}
            onPress={() => setFiltroAtivo(item.key)}
          >
            <Text style={[s.filtroText, filtroAtivo === item.key && s.filtroTextAtivo]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Lista de Entregas */}
      <FlatList
        data={entregasFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={s.listaContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.emptyContainer}>
            <Ionicons name="cube-outline" size={48} color={theme.textMuted} />
            <Text style={s.emptyText}>Nenhuma entrega encontrada</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
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
      gap: 12,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 13,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBackground,
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 8,
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
    filtrosContainer: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      gap: 8,
    },
    filtroBtn: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      marginRight: 8,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    filtroBtnAtivo: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    filtroText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textSecondary,
      lineHeight: 18,
    },
    filtroTextAtivo: {
      color: 'white',
    },
    listaContainer: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 80,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      borderLeftWidth: 4,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? theme.border : 'transparent',
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    cardHeaderLeft: {
      flex: 1,
      marginRight: 10,
    },
    clienteNome: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 2,
    },
    pedidoNumero: {
      fontSize: 12,
      color: theme.textMuted,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    badgeText: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    enderecoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: 10,
    },
    enderecoText: {
      fontSize: 13,
      color: theme.textSecondary,
      flex: 1,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    etaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    etaText: {
      fontSize: 12,
      color: theme.textMuted,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 60,
      gap: 12,
    },
    emptyText: {
      fontSize: 15,
      color: theme.textMuted,
    },
  });
