import { RefreshControl, ScrollView, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { dashboardService } from '../../services/dashboardService';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../hooks/useTheme';
import { formatCurrency, formatDateTime } from '../../utils/format';
import type { RootStackParamList } from '../../navigation/types';

export const DashboardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await dashboardService.getDashboard();
      return res.data.data;
    },
  });

  const d = data;

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`} edges={['top']}>
      <ScrollView
        className="flex-1 px-4"
        refreshControl={<RefreshControl refreshing={isLoading || isRefetching} onRefresh={refetch} />}
      >
        <View className="py-4">
          <Text className={`text-sm ${colors.textMuted}`}>Welcome back,</Text>
          <Text className={`text-2xl font-bold ${colors.text}`}>{user?.name || 'Shopkeeper'}</Text>
          <Text className={`text-sm ${colors.textMuted}`}>{user?.shopName}</Text>
        </View>

        <View className="flex-row flex-wrap gap-3 mb-4">
          <StatCard title="Products" value={String(d?.totalProducts ?? 0)} icon="cube" color="#3b82f6" />
          <StatCard title="Total Sales" value={formatCurrency(d?.totalSales ?? 0)} icon="trending-up" color="#10b981" />
          <StatCard title="Monthly Sales" value={formatCurrency(d?.monthlySales ?? 0)} icon="calendar" color="#8b5cf6" />
          <StatCard
            title="Profit/Loss"
            value={formatCurrency(d?.profitLoss ?? 0)}
            icon="wallet"
            color={(d?.profitLoss ?? 0) >= 0 ? '#10b981' : '#ef4444'}
            subtitle="This month"
          />
        </View>

        {(d?.lowStockCount ?? 0) > 0 && (
          <Pressable onPress={() => navigation.navigate('Main')}>
            <Card className="mb-4 border-l-4 border-l-red-500">
              <View className="flex-row items-center">
                <Ionicons name="warning" size={24} color="#ef4444" />
                <View className="ml-3 flex-1">
                  <Text className={`font-semibold ${colors.text}`}>Low Stock Alert</Text>
                  <Text className={`text-sm ${colors.textMuted}`}>
                    {d?.lowStockCount} items need restocking
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
              </View>
            </Card>
          </Pressable>
        )}

        <View className="flex-row justify-between items-center mb-3">
          <Text className={`text-lg font-bold ${colors.text}`}>Recent Sales</Text>
          <Pressable onPress={() => navigation.navigate('SalesHistory')}>
            <Text className="text-primary-600 text-sm font-medium">View All</Text>
          </Pressable>
        </View>

        {d?.recentSales?.length ? (
          d.recentSales.map((sale) => (
            <Card
              key={sale._id}
              onPress={() => navigation.navigate('SaleDetail', { saleId: sale._id })}
              className="mb-2"
            >
              <View className="flex-row justify-between">
                <View>
                  <Text className={`font-semibold ${colors.text}`}>{sale.invoiceNumber}</Text>
                  <Text className={`text-xs ${colors.textMuted}`}>{formatDateTime(sale.createdAt || '')}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-primary-600 font-bold">{formatCurrency(sale.total)}</Text>
                  <Text className={`text-xs ${colors.textMuted}`}>Profit: {formatCurrency(sale.profit)}</Text>
                </View>
              </View>
            </Card>
          ))
        ) : (
          <Card>
            <Text className={`text-center py-4 ${colors.textMuted}`}>No recent sales</Text>
          </Card>
        )}

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
};
