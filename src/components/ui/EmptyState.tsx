import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
}

export const EmptyState = ({ icon = 'file-tray-outline', title, message }: EmptyStateProps) => {
  const { colors } = useTheme();

  return (
    <View className="flex-1 items-center justify-center py-16 px-8">
      <Ionicons name={icon} size={64} color="#94a3b8" />
      <Text className={`text-lg font-semibold mt-4 text-center ${colors.text}`}>{title}</Text>
      {message && (
        <Text className={`text-sm mt-2 text-center ${colors.textMuted}`}>{message}</Text>
      )}
    </View>
  );
};
