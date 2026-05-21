import { useState, useEffect } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/ui/Header';
import { SearchBar } from '../../components/ui/SearchBar';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { productService } from '../../services/productService';
import { saleService } from '../../services/saleService';
import { customerService } from '../../services/customerService';
import { useCartStore } from '../../stores/cartStore';
import { useTheme } from '../../hooks/useTheme';
import { formatCurrency } from '../../utils/format';
import type { RootStackParamList } from '../../navigation/types';

export const CreateBillScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [amountPaidInput, setAmountPaidInput] = useState('');

  const cart = useCartStore();
  const subtotal = cart.getSubtotal();
  const taxAmount = cart.getTaxAmount();
  const total = cart.getTotal();
  const profit = cart.getEstimatedProfit();

  useEffect(() => {
    if (!showCheckout) return;
    // default amount paid: full for non-credit, 0 for credit
    if (cart.paymentMethod === 'credit') setAmountPaidInput('0');
    else setAmountPaidInput(String(total));
  }, [showCheckout, cart.paymentMethod, total]);

  const { data: products } = useQuery({
    queryKey: ['products-bill', search],
    queryFn: async () => {
      const res = await productService.getAll({ search: search || undefined });
      return res.data.data?.filter((p) => p.stock > 0) || [];
    },
  });

  const saleMutation = useMutation({
    mutationFn: async () => {
      // Ensure customer is linked or created
      let customerId = cart.customerId;
      if (!customerId && cart.customerName?.trim()) {
        try {
          const searchRes = await customerService.getAll(cart.customerName.trim());
          const found = searchRes.data.data?.find((c) => c.name.trim().toLowerCase() === cart.customerName!.trim().toLowerCase());
          if (found) {
            customerId = found._id;
          } else {
            const createRes = await customerService.create({ name: cart.customerName!.trim() });
            const newCustomer = createRes?.data?.data;
            if (newCustomer && newCustomer._id) {
              customerId = newCustomer._id;
              cart.setCustomer(customerId, cart.customerName);
            } else {
              console.warn('Customer create returned unexpected response', createRes);
            }
          }
        } catch (err) {
          // ignore and continue without customerId
          console.warn('Customer link/create failed', err);
        }
      }

      const amtPaid = amountPaidInput !== '' ? Number(amountPaidInput) : cart.paymentMethod === 'credit' ? 0 : total;

      return saleService.create({
        items: cart.items.map((i) => ({ productId: i.product._id, quantity: i.quantity })),
        discount: cart.discount,
        taxRate: cart.taxRate,
        customerId,
        customerName: cart.customerName,
        paymentMethod: cart.paymentMethod,
        amountPaid: amtPaid,
      });
    },
    onSuccess: (res) => {
      cart.clearCart();
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      navigation.replace('InvoiceSummary', { saleId: res.data.data!._id });
    },
    onError: (e: Error) => Alert.alert('Error', e.message),
  });

  if (showCheckout) {
    return (
      <SafeAreaView className={`flex-1 ${colors.bg}`}>
        <Header title="Checkout" showBack />
        <View className="flex-1 px-4 pt-4">
          <Card className="mb-4">
            <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
            <Input label="Discount (₹)" value={String(cart.discount)} onChangeText={(t) => cart.setDiscount(Number(t) || 0)} keyboardType="numeric" />
            <Input label="GST %" value={String(cart.taxRate)} onChangeText={(t) => cart.setTaxRate(Number(t) || 0)} keyboardType="numeric" />
            <SummaryRow label="Tax" value={formatCurrency(taxAmount)} />
            <SummaryRow label="Total" value={formatCurrency(total)} bold />
            <SummaryRow label="Est. Profit" value={formatCurrency(profit)} />
          </Card>
          <Card className="mb-4">
            <Text className={`font-semibold mb-2 ${colors.text}`}>Payment Method</Text>
            <View className="flex-row space-x-2">
              {['cash', 'card', 'upi', 'credit'].map((m) => (
                <Pressable
                  key={m}
                  onPress={() => cart.setPaymentMethod(m)}
                  className={`px-3 py-2 rounded-lg ${cart.paymentMethod === m ? 'bg-primary-600' : ''}`}
                >
                  <Text className={cart.paymentMethod === m ? 'text-white font-semibold' : colors.text}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Card>
          <Input label="Amount Paid" value={amountPaidInput} onChangeText={setAmountPaidInput} keyboardType="numeric" />
          <Input label="Customer Name" value={cart.customerName || ''} onChangeText={(n) => cart.setCustomer(undefined, n)} />
          <Button title="Complete Sale" onPress={() => saleMutation.mutate()} loading={saleMutation.isPending} />
          <Button title="Back to Cart" onPress={() => setShowCheckout(false)} variant="outline" className="mt-2" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`}>
      <Header title="Create Bill" showBack />
      <View className="px-4">
        <SearchBar value={search} onChangeText={setSearch} placeholder="Add products..." />
      </View>

      {cart.items.length > 0 && (
        <View className="px-4 mb-2">
          <Text className={`font-bold mb-2 ${colors.text}`}>Cart ({cart.items.length})</Text>
          {cart.items.map((item) => (
            <Card key={item.product._id} className="mb-2 flex-row items-center">
              <View className="flex-1">
                <Text className={`font-medium ${colors.text}`}>{item.product.name}</Text>
                <Text className={colors.textMuted}>{formatCurrency(item.product.price)} each</Text>
              </View>
              <View className="flex-row items-center">
                <Pressable onPress={() => cart.updateQuantity(item.product._id, item.quantity - 1)} className="p-2">
                  <Ionicons name="remove-circle" size={28} color="#ef4444" />
                </Pressable>
                <Text className={`mx-2 font-bold ${colors.text}`}>{item.quantity}</Text>
                <Pressable onPress={() => cart.updateQuantity(item.product._id, item.quantity + 1)} className="p-2">
                  <Ionicons name="add-circle" size={28} color="#2563eb" />
                </Pressable>
              </View>
            </Card>
          ))}
          <Button title={`Checkout ${formatCurrency(total)}`} onPress={() => setShowCheckout(true)} className="mt-2 mb-2" />
        </View>
      )}

      <FlatList
        data={products}
        keyExtractor={(p) => p._id}
        contentContainerClassName="px-4 pb-6"
        renderItem={({ item }) => (
          <Pressable onPress={() => cart.addItem(item)} className={`mb-2 p-3 rounded-xl border ${colors.border} ${colors.card}`}>
            <View className="flex-row justify-between">
              <Text className={`font-medium ${colors.text}`}>{item.name}</Text>
              <Text className="text-primary-600 font-bold">{formatCurrency(item.price)}</Text>
            </View>
            <Text className={`text-xs ${colors.textMuted}`}>Stock: {item.stock}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

const SummaryRow = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <View className="flex-row justify-between py-1">
    <Text className="text-slate-500">{label}</Text>
    <Text className={bold ? 'font-bold text-lg text-primary-600' : 'font-semibold'}>{value}</Text>
  </View>
);
