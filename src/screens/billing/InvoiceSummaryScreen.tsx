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

export const InvoiceSummaryScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'InvoiceSummary'>>();
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
      <Header title="Invoice" showBack />
      <ScrollView className="px-4">
        <View className="items-center py-6">
          <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-3">
            <Text className="text-3xl">✓</Text>
          </View>
          <Text className={`text-xl font-bold ${colors.text}`}>Sale Complete!</Text>
          <Text className={`text-sm ${colors.textMuted}`}>{sale.invoiceNumber}</Text>
          <Text className={`text-sm ${colors.textMuted}`}>{formatDateTime(sale.createdAt || '')}</Text>
        </View>

        <Card className="mb-4">
          {sale.items.map((item, i) => (
            <View key={i} className="flex-row justify-between py-2 border-b border-slate-100">
              <View className="flex-1">
                <Text className={`font-medium ${colors.text}`}>{item.name}</Text>
                <Text className={`text-xs ${colors.textMuted}`}>
                  {item.quantity} x {formatCurrency(item.price)}
                </Text>
              </View>
              <Text className={`font-semibold ${colors.text}`}>{formatCurrency(item.total)}</Text>
            </View>
          ))}
          <View className="pt-3 gap-1">
            <Row label="Subtotal" value={formatCurrency(sale.subtotal)} />
            {sale.discount > 0 && <Row label="Discount" value={`-${formatCurrency(sale.discount)}`} />}
            {sale.taxAmount > 0 && <Row label={`GST (${sale.taxRate}%)`} value={formatCurrency(sale.taxAmount)} />}
            <Row label="Total" value={formatCurrency(sale.total)} bold />
            <Row label="Profit" value={formatCurrency(sale.profit)} />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <View className="flex-row justify-between">
    <Text className="text-slate-500">{label}</Text>
    <Text className={bold ? 'font-bold text-lg text-primary-600' : ''}>{value}</Text>
  </View>
);
