import { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { customerService } from '../../services/customerService';
import { useTheme } from '../../hooks/useTheme';
import { formatCurrency, formatDateTime } from '../../utils/format';
import type { RootStackParamList } from '../../navigation/types';

export const CustomerDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'CustomerDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const [paymentAmount, setPaymentAmount] = useState('');

  const { data: customer, refetch } = useQuery({
    queryKey: ['customer', route.params.customerId],
    queryFn: async () => {
      const res = await customerService.getById(route.params.customerId);
      return res.data.data;
    },
  });

  const paymentMutation = useMutation({
    mutationFn: () =>
      customerService.recordPayment(route.params.customerId, {
        amount: Number(paymentAmount),
        method: 'cash',
      }),
    onSuccess: () => {
      setPaymentAmount('');
      refetch();
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (e: Error) => Alert.alert('Error', e.message),
  });

  if (!customer) return null;

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`}>
      <Header title={customer.name} showBack />
      <ScrollView className="px-4 pt-4">
        <Card className="mb-4">
          <Text className={colors.textMuted}>Phone</Text>
          <Text className={`text-lg font-semibold ${colors.text}`}>{customer.phone}</Text>
          {customer.address && (
            <>
              <Text className={`mt-3 ${colors.textMuted}`}>Address</Text>
              <Text className={colors.text}>{customer.address}</Text>
            </>
          )}
          <Text className={`mt-3 text-xl font-bold ${customer.dueAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
            Due: {formatCurrency(customer.dueAmount)}
          </Text>
        </Card>

        {customer.dueAmount > 0 && (
          <Card className="mb-4">
            <Text className={`font-semibold mb-2 ${colors.text}`}>Record Payment</Text>
            <Input label="Amount" value={paymentAmount} onChangeText={setPaymentAmount} keyboardType="numeric" />
            <Button title="Record Payment" onPress={() => paymentMutation.mutate()} loading={paymentMutation.isPending} />
          </Card>
        )}

        <Text className={`text-lg font-bold mb-2 ${colors.text}`}>Payment History</Text>
        {customer.paymentHistory?.length ? (
          customer.paymentHistory.map((p, i) => (
            <Card key={i} className="mb-2">
              <Text className={`font-semibold text-green-600`}>{formatCurrency(p.amount)}</Text>
              <Text className={`text-xs ${colors.textMuted}`}>{formatDateTime(p.createdAt)} • {p.method}</Text>
            </Card>
          ))
        ) : (
          <Text className={colors.textMuted}>No payments recorded</Text>
        )}

        <Button
          title="Edit Customer"
          onPress={() => navigation.navigate('CustomerForm', { customerId: customer._id })}
          variant="outline"
          className="mt-4 mb-8"
        />
      </ScrollView>
    </SafeAreaView>
  );
};
