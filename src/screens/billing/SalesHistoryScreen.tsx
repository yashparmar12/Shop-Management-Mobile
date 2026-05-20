import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { saleService } from '../../services/saleService';
import { useTheme } from '../../hooks/useTheme';
import { formatCurrency, formatDateTime } from '../../utils/format';
import type { RootStackParamList } from '../../navigation/types';

export const SalesHistoryScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();

  const { data: sales, isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const res = await saleService.getAll({ limit: 100 });
      return res.data.data || [];
    },
  });

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`}>
      <Header title="Sales History" showBack />
      <FlatList
        data={sales}
        keyExtractor={(s) => s._id}
        contentContainerClassName="px-4 py-2"
        refreshing={isLoading}
        ListEmptyComponent={<EmptyState title="No sales yet" />}
        renderItem={({ item }) => (
          <Card onPress={() => navigation.navigate('SaleDetail', { saleId: item._id })} className="mb-2">
            <View className="flex-row justify-between">
              <View>
                <Text className={`font-semibold ${colors.text}`}>{item.invoiceNumber}</Text>
                <Text className={`text-xs ${colors.textMuted}`}>{formatDateTime(item.createdAt || '')}</Text>
                {item.customerName && (
                  <Text className={`text-xs ${colors.textMuted}`}>{item.customerName}</Text>
                )}
              </View>
              <View className="items-end">
                <Text className="text-primary-600 font-bold">{formatCurrency(item.total)}</Text>
                <Text className={`text-xs text-green-600`}>+{formatCurrency(item.profit)}</Text>
              </View>
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
};
