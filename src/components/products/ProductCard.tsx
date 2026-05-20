import { Image, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { formatCurrency } from '../../utils/format';
import { getImageUrl } from '../../services/api';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard = ({ product, onPress }: ProductCardProps) => {
  const { colors } = useTheme();
  const isLowStock = product.stock <= product.lowStockThreshold;
  const imageUri = getImageUrl(product.image);

  return (
    <Card onPress={onPress} className="mb-3 flex-row">
      <View className="w-16 h-16 rounded-xl bg-slate-200 items-center justify-center overflow-hidden mr-3">
        {imageUri ? (
          <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <Ionicons name="cube-outline" size={28} color="#94a3b8" />
        )}
      </View>
      <View className="flex-1">
        <Text className={`font-semibold ${colors.text}`} numberOfLines={1}>
          {product.name}
        </Text>
        <Text className={`text-xs ${colors.textMuted}`}>{product.category}</Text>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-primary-600 font-bold">{formatCurrency(product.price)}</Text>
          <View className={`px-2 py-0.5 rounded-full ${isLowStock ? 'bg-red-100' : 'bg-green-100'}`}>
            <Text className={`text-xs font-medium ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
              Stock: {product.stock}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};
