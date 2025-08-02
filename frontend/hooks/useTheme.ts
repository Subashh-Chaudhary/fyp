import { useAppStore } from '../store';

/**
 * Custom hook for theme management
 * Provides theme state and actions for switching between light and dark themes
 */
export const useTheme = () => {
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  const isDark = theme === 'dark';

  const colors = {
    primary: isDark ? '#4ade80' : '#22c55e',
    secondary: isDark ? '#fde047' : '#eab308',
    background: isDark ? '#171717' : '#ffffff',
    surface: isDark ? '#262626' : '#f8fafc',
    text: isDark ? '#fafafa' : '#171717',
    textSecondary: isDark ? '#a3a3a3' : '#525252',
    border: isDark ? '#404040' : '#e5e5e5',
    error: isDark ? '#f87171' : '#ef4444',
    success: isDark ? '#86efac' : '#22c55e',
    warning: isDark ? '#fde047' : '#f59e0b',
  };

  return {
    theme,
    isDark,
    colors,
    switchTheme: toggleTheme,
    setSpecificTheme: setTheme,
  };
};
