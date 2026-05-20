import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/ui/Header';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { productService } from '../../services/productService';
import { getImageUrl } from '../../services/api';
import { useTheme } from '../../hooks/useTheme';
import { formatCurrency, formatDateTime } from '../../utils/format';
import type { RootStackParamList } from '../../navigation/types';

export const ProductDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ProductDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  const { data: product } = useQuery({
    queryKey: ['product', route.params.productId],
    queryFn: async () => {
      const res = await productService.getById(route.params.productId);
      return res.data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => productService.remove(route.params.productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigation.goBack();
    },
    onError: (e: Error) => Alert.alert('Error', e.message),
  });

  const handleDelete = () => {
    Alert.alert('Delete Product', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate() },
    ]);
  };

  if (!product) return null;
  const imageUri = getImageUrl(product.image);

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`}>
      <Header title="Product Details" showBack />
      <ScrollView className="px-4">
        <View className="items-center py-4">
          <View className="w-32 h-32 rounded-2xl bg-slate-200 items-center justify-center overflow-hidden">
            {imageUri ? (
              <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <Ionicons name="cube-outline" size={48} color="#94a3b8" />
            )}
          </View>
          <Text className={`text-xl font-bold mt-3 ${colors.text}`}>{product.name}</Text>
          <Text className={colors.textMuted}>{product.category}</Text>
        </View>

        <Card className="mb-3">
          <Row label="Price" value={formatCurrency(product.price)} colors={colors.text} />
          <Row label="Cost" value={formatCurrency(product.costPrice)} colors={colors.text} />
          <Row label="Stock" value={String(product.stock)} colors={colors.text} />
          <Row label="Low Stock Alert" value={String(product.lowStockThreshold)} colors={colors.text} />
          {product.sku && <Row label="SKU" value={product.sku} colors={colors.text} />}
        </Card>

        {product.stockHistory && product.stockHistory.length > 0 && (
          <>
            <Text className={`text-lg font-bold mb-2 ${colors.text}`}>Stock History</Text>
            {product.stockHistory.slice(-10).reverse().map((h, i) => (
              <Card key={i} className="mb-2">
                <Text className={`font-medium ${colors.text}`}>
                  {h.type.toUpperCase()} — {h.quantity} units
                </Text>
                <Text className={`text-xs ${colors.textMuted}`}>
                  {h.previousStock} → {h.newStock} • {formatDateTime(h.createdAt || new Date())}
                </Text>
              </Card>
            ))}
          </>
        )}

        <Button
          title="Edit Product"
          onPress={() => navigation.navigate('ProductForm', { productId: product._id })}
          className="mt-2"
        />
        <Button title="Delete Product" onPress={handleDelete} variant="danger" className="mt-2 mb-8" />
      </ScrollView>
    </SafeAreaView>
  );
};

const Row = ({ label, value, colors }: { label: string; value: string; colors: string }) => (
  <View className="flex-row justify-between py-2 border-b border-slate-100">
    <Text className="text-slate-500">{label}</Text>
    <Text className={`font-semibold ${colors}`}>{value}</Text>
  </View>
);
