import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

interface StatCardProps {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  subtitle?: string;
}

export const StatCard = ({ title, value, icon, color = '#3b82f6', subtitle }: StatCardProps) => {
  const { colors } = useTheme();

  return (
    <View className={`flex-1 min-w-[45%] rounded-2xl p-4 border ${colors.card} ${colors.border}`}>
      <View className="flex-row items-center justify-between mb-2">
        <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
      </View>
      <Text className={`text-xs ${colors.textMuted}`}>{title}</Text>
      <Text className={`text-xl font-bold mt-0.5 ${colors.text}`}>{value}</Text>
      {subtitle && <Text className={`text-xs mt-1 ${colors.textMuted}`}>{subtitle}</Text>}
    </View>
  );
};
