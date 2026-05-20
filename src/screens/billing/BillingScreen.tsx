import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';
import { useCartStore } from '../../stores/cartStore';
import { useTheme } from '../../hooks/useTheme';
import { formatCurrency } from '../../utils/format';
import type { RootStackParamList } from '../../navigation/types';

export const BillingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const itemCount = useCartStore((s) => s.items.length);
  const total = useCartStore((s) => s.getTotal());

  const actions = [
    { title: 'Create New Bill', icon: 'add-circle' as const, screen: 'CreateBill' as const, color: '#2563eb' },
    { title: 'Sales History', icon: 'time' as const, screen: 'SalesHistory' as const, color: '#8b5cf6' },
  ];

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`} edges={['top']}>
      <View className="px-4 pt-4">
        <Text className={`text-2xl font-bold ${colors.text}`}>Billing</Text>
        <Text className={`text-sm ${colors.textMuted}`}>Create bills and track sales</Text>
      </View>

      {itemCount > 0 && (
        <Pressable onPress={() => navigation.navigate('CreateBill')} className="mx-4 mt-4">
          <Card className="bg-primary-50 border-primary-200">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-primary-700 font-semibold">Cart in progress</Text>
                <Text className="text-primary-600 text-sm">{itemCount} items • {formatCurrency(total)}</Text>
              </View>
              <Ionicons name="arrow-forward-circle" size={32} color="#2563eb" />
            </View>
          </Card>
        </Pressable>
      )}

      <View className="px-4 mt-6 gap-3">
        {actions.map((action) => (
          <Pressable key={action.screen} onPress={() => navigation.navigate(action.screen)}>
            <Card>
              <View className="flex-row items-center">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: `${action.color}20` }}
                >
                  <Ionicons name={action.icon} size={28} color={action.color} />
                </View>
                <Text className={`flex-1 text-lg font-semibold ${colors.text}`}>{action.title}</Text>
                <Ionicons name="chevron-forward" size={22} color="#94a3b8" />
              </View>
            </Card>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
};
