import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from './theme';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  // Sincroniza com mudanças de tema do sistema
  useEffect(() => {
    if (systemColorScheme) {
      setIsDark(systemColorScheme === 'dark');
    }
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
}
