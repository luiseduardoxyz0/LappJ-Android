import { useTheme } from '@/constants/ThemeContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function EntregasScreen() {
  const { theme } = useTheme();
  const s = styles(theme);

  return (
    <View style={s.container}>
      <Text style={s.text}>Tela de Entregas</Text>
    </View>
  );
}

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    text: {
      fontSize: 18,
      color: theme.textPrimary,
    },
  });
