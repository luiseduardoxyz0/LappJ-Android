import { cancelGoogleSignup, updateUserPerfil } from '@/constants/firebaseAuth';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Perfil = 'motorista' | 'coordenador';

const OPTIONS: { perfil: Perfil; icon: string; titulo: string; descricao: string; cor: string }[] = [
  {
    perfil: 'motorista',
    icon: 'car-sport',
    titulo: 'Motorista',
    descricao: 'Registro de jornada, lista de entregas e navegação por mapa',
    cor: '#5C7CFA',
  },
  {
    perfil: 'coordenador',
    icon: 'briefcase',
    titulo: 'Coordenador',
    descricao: 'Monitoramento de cargas, motoristas em rota e gestão de atrasos',
    cor: '#F5A623',
  },
];

export default function EscolhaPerfilScreen() {
  const { theme, isDark } = useTheme() as any;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { uid, name } = useLocalSearchParams<{ uid: string; name: string }>();

  const [selecionado, setSelecionado] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(false);
  const [canceling, setCanceling] = useState(false);

  // Animações de entrada
  const headerAnim = useRef(new Animated.Value(0)).current;
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.spring(headerAnim, { toValue: 1, friction: 7, useNativeDriver: true }),
      Animated.spring(card1Anim, { toValue: 1, friction: 7, useNativeDriver: true }),
      Animated.spring(card2Anim, { toValue: 1, friction: 7, useNativeDriver: true }),
      Animated.spring(btnAnim, { toValue: 1, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  const animStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
  });

  const s = styles(theme, isDark);

  const handleConfirmar = async () => {
    if (!selecionado) {
      Alert.alert('Escolha seu perfil', 'Selecione Motorista ou Coordenador para continuar.');
      return;
    }
    if (!uid) {
      Alert.alert('Erro', 'Usuário não identificado. Faça login novamente.');
      router.replace('/login' as any);
      return;
    }
    setLoading(true);
    try {
      await updateUserPerfil(uid, selecionado);
      if (selecionado === 'coordenador') {
        router.replace('/coordenador');
      } else {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível salvar seu perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async () => {
    Alert.alert(
      'Cancelar cadastro',
      'Sua conta Google será removida do LappJ. Você poderá entrar novamente quando quiser.',
      [
        { text: 'Não, continuar', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            setCanceling(true);
            try {
              if (uid) await cancelGoogleSignup(uid);
            } finally {
              setCanceling(false);
              router.replace('/login' as any);
            }
          },
        },
      ]
    );
  };

  const firstName = name?.split(' ')[0] || 'você';

  return (
    <View style={[s.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>

      {/* Header */}
      <Animated.View style={[s.header, animStyle(headerAnim)]}>
        <View style={s.logoRow}>
          <View style={s.logoBadge}>
            <Ionicons name="car" size={22} color="white" />
          </View>
          <Text style={s.logoText}>LappJ</Text>
        </View>
        <Text style={s.titulo}>Olá, {firstName}! 👋</Text>
        <Text style={s.subtitulo}>
          Como você vai usar o LappJ?{'\n'}Escolha seu perfil de acesso.
        </Text>
      </Animated.View>

      {/* Cards de escolha */}
      <View style={s.cardsContainer}>
        {OPTIONS.map((opt, idx) => {
          const anim = idx === 0 ? card1Anim : card2Anim;
          const ativo = selecionado === opt.perfil;
          return (
            <Animated.View key={opt.perfil} style={animStyle(anim)}>
              <TouchableOpacity
                style={[
                  s.card,
                  ativo && { borderColor: opt.cor, borderWidth: 2, backgroundColor: opt.cor + '12' },
                ]}
                onPress={() => setSelecionado(opt.perfil)}
                activeOpacity={0.85}
              >
                {/* Ícone */}
                <View style={[s.cardIconBg, { backgroundColor: opt.cor + (ativo ? '25' : '15') }]}>
                  <Ionicons name={opt.icon as any} size={32} color={opt.cor} />
                </View>

                {/* Texto */}
                <View style={s.cardContent}>
                  <Text style={[s.cardTitulo, ativo && { color: opt.cor }]}>{opt.titulo}</Text>
                  <Text style={s.cardDescricao}>{opt.descricao}</Text>
                </View>

                {/* Check */}
                <View style={[s.check, ativo && { backgroundColor: opt.cor, borderColor: opt.cor }]}>
                  {ativo && <Ionicons name="checkmark" size={16} color="white" />}
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      {/* Aviso */}
      <View style={s.avisoRow}>
        <Ionicons name="information-circle-outline" size={16} color={theme.textMuted} />
        <Text style={s.avisoText}>
          Você pode solicitar a alteração de perfil ao administrador depois.
        </Text>
      </View>

      {/* Botões de ação */}
      <Animated.View style={[s.btnWrapper, animStyle(btnAnim)]}>
        <TouchableOpacity
          style={[
            s.btnConfirmar,
            !selecionado && s.btnDisabled,
            selecionado === 'coordenador' && { backgroundColor: '#F5A623' },
          ]}
          onPress={handleConfirmar}
          disabled={loading || canceling || !selecionado}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={s.btnText}>Confirmar e Entrar</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={s.btnCancelar}
          onPress={handleCancelar}
          disabled={loading || canceling}
          activeOpacity={0.7}
        >
          {canceling ? (
            <ActivityIndicator color={theme.textSecondary} size="small" />
          ) : (
            <Text style={s.btnCancelarText}>Cancelar</Text>
          )}
        </TouchableOpacity>
      </Animated.View>

    </View>
  );
}

const styles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
    },
    header: {
      alignItems: 'center',
      paddingTop: 32,
      paddingBottom: 32,
    },
    logoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 24,
    },
    logoBadge: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoText: {
      fontSize: 26,
      fontWeight: '800',
      color: theme.primary,
    },
    titulo: {
      fontSize: 26,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 10,
    },
    subtitulo: {
      fontSize: 15,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    cardsContainer: {
      gap: 16,
      flex: 1,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: 18,
      padding: 20,
      borderWidth: 1.5,
      borderColor: theme.border,
      gap: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.07,
      shadowRadius: 8,
      elevation: 3,
    },
    cardIconBg: {
      width: 64,
      height: 64,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardContent: {
      flex: 1,
      gap: 4,
    },
    cardTitulo: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    cardDescricao: {
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 18,
    },
    check: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: theme.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avisoRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      marginVertical: 20,
      paddingHorizontal: 4,
    },
    avisoText: {
      flex: 1,
      fontSize: 12,
      color: theme.textMuted,
      lineHeight: 17,
    },
    btnWrapper: {
      marginBottom: 8,
    },
    btnConfirmar: {
      backgroundColor: theme.primary,
      borderRadius: 14,
      paddingVertical: 16,
      paddingHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
    },
    btnDisabled: {
      opacity: 0.45,
    },
    btnText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    btnCancelar: {
      marginTop: 12,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnCancelarText: {
      fontSize: 15,
      fontWeight: '500',
      color: theme.textSecondary,
      textDecorationLine: 'underline',
    },
  });
