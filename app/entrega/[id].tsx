import { useEntregas } from '@/constants/EntregasContext';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const STATUS_CONFIG = {
  transito: {
    label: 'EM TRÂNSITO',
    color: '#F5A623',
    bg: 'rgba(245, 166, 35, 0.12)',
    icon: 'car-outline' as const,
  },
  pendente: {
    label: 'PENDENTE',
    color: '#9E9E9E',
    bg: 'rgba(158, 158, 158, 0.12)',
    icon: 'time-outline' as const,
  },
  entregue: {
    label: 'ENTREGUE',
    color: '#4CAF50',
    bg: 'rgba(76, 175, 80, 0.12)',
    icon: 'checkmark-circle-outline' as const,
  },
};

export default function EntregaDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { entregas, confirmarEntrega } = useEntregas();

  const entrega = entregas.find((e) => e.id === id);
  const s = styles(theme, isDark);

  if (!entrega) {
    return (
      <View style={[s.container, s.centered]}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.textMuted} />
        <Text style={s.emptyText}>Entrega não encontrada</Text>
        <TouchableOpacity style={s.voltar} onPress={() => router.back()}>
          <Text style={s.voltarText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const config = STATUS_CONFIG[entrega.status];

  const handleNavegar = () => {
    const query = encodeURIComponent(entrega.endereco);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const handleConfirmar = () => {
    Alert.alert(
      'Confirmar Entrega',
      `Confirmar entrega do pedido ${entrega.pedido} para ${entrega.cliente}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            confirmarEntrega(id as string);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Detalhe da Entrega</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Badge de Status */}
        <View style={[s.statusBadge, { backgroundColor: config.bg }]}>
          <Ionicons name={config.icon} size={22} color={config.color} />
          <Text style={[s.statusLabel, { color: config.color }]}>{config.label}</Text>
        </View>

        {/* Card — Pedido e Cliente */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Pedido</Text>
          <View style={s.row}>
            <Ionicons name="cube-outline" size={18} color={theme.textMuted} />
            <Text style={s.cardValue}>{entrega.pedido}</Text>
          </View>

          <View style={s.divider} />

          <Text style={s.cardTitle}>Cliente</Text>
          <View style={s.row}>
            <Ionicons name="business-outline" size={18} color={theme.textMuted} />
            <Text style={s.cardValue}>{entrega.cliente}</Text>
          </View>
        </View>

        {/* Card — Endereço + botão Navegar */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Endereço de Entrega</Text>
          <View style={s.row}>
            <Ionicons name="location-outline" size={18} color={theme.textMuted} />
            <Text style={[s.cardValue, { flex: 1 }]}>{entrega.endereco}</Text>
          </View>
          <TouchableOpacity
            style={s.navegarBtn}
            onPress={handleNavegar}
            activeOpacity={0.8}
          >
            <Ionicons name="navigate" size={18} color="#fff" />
            <Text style={s.navegarBtnText}>Navegar até o destino</Text>
          </TouchableOpacity>
        </View>

        {/* Card — ETA */}
        <View style={s.card}>
          <Text style={s.cardTitle}>
            {entrega.status === 'entregue' ? 'Horário de Entrega' : 'Previsão (ETA)'}
          </Text>
          <View style={s.row}>
            <Ionicons
              name={entrega.status === 'entregue' ? 'checkmark-circle' : 'time-outline'}
              size={18}
              color={entrega.status === 'entregue' ? '#4CAF50' : theme.textMuted}
            />
            <Text
              style={[
                s.cardValue,
                entrega.status === 'entregue' && { color: '#4CAF50', fontWeight: '600' },
              ]}
            >
              {entrega.status === 'entregue'
                ? `Entregue às ${entrega.eta}`
                : entrega.eta}
            </Text>
          </View>
        </View>

        {/* Botão Confirmar Entrega — só aparece se não estiver entregue */}
        {entrega.status !== 'entregue' && (
          <TouchableOpacity
            style={s.confirmarBtn}
            onPress={handleConfirmar}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={s.confirmarBtnText}>Confirmar Entrega</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
    },
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
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    scrollContent: {
      padding: 16,
      gap: 12,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 24,
      marginBottom: 4,
    },
    statusLabel: {
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      gap: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },
    cardTitle: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.textMuted,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    cardValue: {
      fontSize: 15,
      color: theme.textPrimary,
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 2,
    },
    navegarBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: '#1A237E',
      borderRadius: 10,
      paddingVertical: 12,
      marginTop: 4,
    },
    navegarBtnText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '700',
    },
    confirmarBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: '#2E7D32',
      borderRadius: 10,
      paddingVertical: 14,
      marginTop: 4,
    },
    confirmarBtnText: {
      color: '#fff',
      fontSize: 15,
      fontWeight: '700',
    },
    emptyText: {
      fontSize: 15,
      color: theme.textMuted,
    },
    voltar: {
      paddingHorizontal: 24,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: '#1A237E',
    },
    voltarText: {
      color: '#fff',
      fontWeight: '700',
    },
  });
