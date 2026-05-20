import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';
import { useTheme } from '../../hooks/useTheme';
import type { RootStackParamList } from '../../navigation/types';

const menuItems: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen: 'Expenses' | 'Customers' | 'Suppliers' | 'Reports' | 'Settings';
  color: string;
}[] = [
  { title: 'Expenses', icon: 'wallet-outline', screen: 'Expenses', color: '#ef4444' },
  { title: 'Customers', icon: 'people-outline', screen: 'Customers', color: '#3b82f6' },
  { title: 'Suppliers', icon: 'business-outline', screen: 'Suppliers', color: '#8b5cf6' },
  { title: 'Reports', icon: 'bar-chart-outline', screen: 'Reports', color: '#10b981' },
  { title: 'Settings', icon: 'settings-outline', screen: 'Settings', color: '#64748b' },
];

export const MoreScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`} edges={['top']}>
      <View className="px-4 pt-4 pb-2">
        <Text className={`text-2xl font-bold ${colors.text}`}>More</Text>
        <Text className={`text-sm ${colors.textMuted}`}>Manage your shop</Text>
      </View>
      <ScrollView className="px-4 pt-2">
        {menuItems.map((item) => (
          <Pressable key={item.screen} onPress={() => navigation.navigate(item.screen)}>
            <Card className="mb-3">
              <View className="flex-row items-center">
                <View
                  className="w-11 h-11 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                <Text className={`flex-1 text-base font-semibold ${colors.text}`}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
              </View>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
