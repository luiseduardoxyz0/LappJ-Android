import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FAQ_DATA = [
  {
    q: 'Como inicio minha jornada de trabalho?',
    a: 'Na tela inicial (Dashboard), clique no botão verde "Iniciar Jornada". O horário de início será registrado no sistema.',
  },
  {
    q: 'O que eu faço se esquecer a senha?',
    a: 'Se você estiver deslogado, use a opção "Esqueci minha senha" na tela de login. Se estiver logado, vá em Mais > Alterar Senha.',
  },
  {
    q: 'Como registro uma entrega realizada?',
    a: 'Vá na aba "Entregas do Dia" e toque na entrega desejada para marcá-la como concluída.',
  },
  {
    q: 'Como atualizo a placa do meu veículo?',
    a: 'Acesse Mais > Editar Perfil e altere o campo "Placa do Veículo". Em seguida, clique em Salvar.',
  },
];

export default function FAQScreen() {
  const { theme, isDark } = useTheme() as any;
  const s = styles(theme, isDark);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.headerText}>Dúvidas frequentes sobre o uso do aplicativo LappJ.</Text>
      
      <View style={s.card}>
        {FAQ_DATA.map((item, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <View key={index} style={[s.faqItem, index < FAQ_DATA.length - 1 && s.divider]}>
              <TouchableOpacity
                style={s.questionRow}
                onPress={() => toggleExpand(index)}
                activeOpacity={0.7}
              >
                <Text style={s.question}>{item.q}</Text>
                <Ionicons 
                  name={isExpanded ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={theme.textMuted} 
                />
              </TouchableOpacity>
              {isExpanded && (
                <View style={s.answerContainer}>
                  <Text style={s.answer}>{item.a}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      padding: 16,
    },
    headerText: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 20,
      paddingHorizontal: 8,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      overflow: 'hidden',
    },
    faqItem: {
      backgroundColor: theme.surface,
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    questionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
    },
    question: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: theme.textPrimary,
      paddingRight: 16,
    },
    answerContainer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    answer: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
    },
  });
