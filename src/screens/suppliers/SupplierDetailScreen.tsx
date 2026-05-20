import { useState } from 'react';
import { Alert, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { supplierService } from '../../services/supplierService';
import { useTheme } from '../../hooks/useTheme';
import { formatCurrency, formatDate } from '../../utils/format';
import type { RootStackParamList } from '../../navigation/types';

export const SupplierDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'SupplierDetail'>>();
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  const [items, setItems] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const { data: supplier, refetch } = useQuery({
    queryKey: ['supplier', route.params.supplierId],
    queryFn: async () => {
      const res = await supplierService.getById(route.params.supplierId);
      return res.data.data;
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: () =>
      supplierService.addPurchase(route.params.supplierId, {
        items,
        amount: Number(amount),
        purchaseDate: new Date().toISOString(),
        notes,
      }),
    onSuccess: () => {
      setItems('');
      setAmount('');
      setNotes('');
      refetch();
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
    onError: (e: Error) => Alert.alert('Error', e.message),
  });

  if (!supplier) return null;

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`}>
      <Header title={supplier.shopName} showBack />
      <ScrollView className="px-4 pt-4">
        <Card className="mb-4">
          <Text className={colors.textMuted}>Owner</Text>
          <Text className={`font-semibold ${colors.text}`}>{supplier.ownerName}</Text>
          <Text className={`mt-2 ${colors.text}`}>{supplier.mobile}</Text>
          {supplier.address && <Text className={`mt-1 ${colors.textMuted}`}>{supplier.address}</Text>}
        </Card>

        <Card className="mb-4">
          <Text className={`font-bold mb-3 ${colors.text}`}>Add Purchase</Text>
          <Input label="Purchased Items *" value={items} onChangeText={setItems} />
          <Input label="Amount *" value={amount} onChangeText={setAmount} keyboardType="numeric" />
          <Input label="Notes" value={notes} onChangeText={setNotes} />
          <Button title="Add Purchase" onPress={() => purchaseMutation.mutate()} loading={purchaseMutation.isPending} />
        </Card>

        <Text className={`text-lg font-bold mb-2 ${colors.text}`}>Purchase History</Text>
        {supplier.purchases?.length ? (
          supplier.purchases.map((p, i) => (
            <Card key={p._id || i} className="mb-2">
              <Text className={`font-medium ${colors.text}`}>{p.items}</Text>
              <Text className="text-primary-600 font-bold">{formatCurrency(p.amount)}</Text>
              <Text className={`text-xs ${colors.textMuted}`}>{formatDate(p.purchaseDate)}</Text>
            </Card>
          ))
        ) : (
          <Text className={colors.textMuted}>No purchases yet</Text>
        )}
        <Text className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
};
