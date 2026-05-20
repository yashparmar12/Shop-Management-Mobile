import { useThemeStore } from '../stores/themeStore';

export const useTheme = () => {
  const isDark = useThemeStore((s) => s.isDark);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  return {
    isDark,
    toggleTheme,
    colors: {
      bg: isDark ? 'bg-background-dark' : 'bg-background-light',
      card: isDark ? 'bg-surface-dark' : 'bg-white',
      text: isDark ? 'text-white' : 'text-slate-900',
      textMuted: isDark ? 'text-slate-400' : 'text-slate-500',
      border: isDark ? 'border-slate-700' : 'border-slate-200',
      input: isDark ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900',
    },
  };
};
