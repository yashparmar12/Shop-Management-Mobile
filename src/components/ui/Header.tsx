import { Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export const Header = ({ title, showBack, rightAction }: HeaderProps) => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();

  return (
    <View className={`flex-row items-center justify-between px-4 py-3 border-b ${colors.border}`}>
      <View className="flex-row items-center flex-1">
        {showBack && (
          <Pressable onPress={() => navigation.goBack()} className="mr-3 p-1">
            <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#0f172a'} />
          </Pressable>
        )}
        <Text className={`text-xl font-bold ${colors.text}`} numberOfLines={1}>
          {title}
        </Text>
      </View>
      {rightAction}
    </View>
  );
};
