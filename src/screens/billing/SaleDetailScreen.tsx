import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { saleService } from '../../services/saleService';
import { useTheme } from '../../hooks/useTheme';
import { formatCurrency, formatDateTime } from '../../utils/format';
import type { RootStackParamList } from '../../navigation/types';

export const SaleDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'SaleDetail'>>();
  const { colors } = useTheme();

  const { data: sale } = useQuery({
    queryKey: ['sale', route.params.saleId],
    queryFn: async () => {
      const res = await saleService.getById(route.params.saleId);
      return res.data.data;
    },
  });

  if (!sale) return null;

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`}>
      <Header title={sale.invoiceNumber} showBack />
      <ScrollView className="px-4 pt-2">
        <Text className={`text-sm mb-4 ${colors.textMuted}`}>{formatDateTime(sale.createdAt || '')}</Text>
        <Card>
          {sale.items.map((item, i) => (
            <View key={i} className="flex-row justify-between py-2 border-b border-slate-100">
              <Text className={colors.text}>{item.name} x{item.quantity}</Text>
              <Text className={`font-semibold ${colors.text}`}>{formatCurrency(item.total)}</Text>
            </View>
          ))}
          <View className="pt-3">
            <Text className={`text-lg font-bold text-primary-600`}>Total: {formatCurrency(sale.total)}</Text>
            <Text className={`text-sm ${colors.textMuted}`}>Profit: {formatCurrency(sale.profit)}</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};
