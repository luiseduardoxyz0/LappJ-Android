import { getSession } from '@/constants/localAuth';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function App() {
  const [target, setTarget] = useState<'loading' | '/login' | '/(tabs)' | '/coordenador'>('loading');

  useEffect(() => {
    getSession()
      .then((session) => {
        if (!session) return setTarget('/login');
        setTarget(session.perfil === 'coordenador' ? '/coordenador' : '/(tabs)');
      })
      .catch(() => setTarget('/login'));
  }, []);

  if (target === 'loading') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0E1A' }}>
        <ActivityIndicator size="large" color="#5C7CFA" />
      </View>
    );
  }

  return <Redirect href={target as any} />;
}
