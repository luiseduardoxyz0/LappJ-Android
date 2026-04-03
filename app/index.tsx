import { getSession } from '@/constants/localAuth';
import { Redirect } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

function SplashScreen() {
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo aparece e escala
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
      ]),
      // Nome do app aparece
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      // Tagline aparece
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Dots de loading aparecem
      Animated.timing(dotsOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo — ícone de caminhão estilizado */}
      <Animated.View
        style={[
          styles.logoWrapper,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <Text style={styles.logoIcon}>🚚</Text>
      </Animated.View>

      {/* Nome do app */}
      <Animated.Text style={[styles.appName, { opacity: textOpacity }]}>
        LappJ
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Gestão de Jornada & Entregas
      </Animated.Text>

      {/* Indicador de carregamento */}
      <Animated.View style={[styles.dotsRow, { opacity: dotsOpacity }]}>
        {[0, 1, 2].map((i) => (
          <PulseDot key={i} delay={i * 200} />
        ))}
      </Animated.View>
    </View>
  );
}

function PulseDot({ delay }: { delay: number }) {
  const anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return <Animated.View style={[styles.dot, { opacity: anim }]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B3E',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: 'rgba(92,124,250,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(92,124,250,0.3)',
  },
  logoIcon: {
    fontSize: 48,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
    marginBottom: 56,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5C7CFA',
  },
});

export default function App() {
  const [target, setTarget] = useState<'loading' | '/login' | '/(tabs)' | '/coordenador'>('loading');

  useEffect(() => {
    // Mínimo de 2s para a splash ser visível mesmo com sessão já salva
    const minDelay = new Promise((res) => setTimeout(res, 2000));
    const sessionCheck = getSession()
      .then((session) => {
        if (!session) return '/login';
        return session.perfil === 'coordenador' ? '/coordenador' : '/(tabs)';
      })
      .catch(() => '/login');

    Promise.all([minDelay, sessionCheck]).then(([, dest]) => {
      setTarget(dest as any);
    });
  }, []);

  if (target === 'loading') {
    return <SplashScreen />;
  }

  return <Redirect href={target as any} />;
}
