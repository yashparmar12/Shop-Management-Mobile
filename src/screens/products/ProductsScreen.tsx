import { useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '../../components/ui/SearchBar';
import { ProductCard } from '../../components/products/ProductCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { productService } from '../../services/productService';
import { useTheme } from '../../hooks/useTheme';
import type { RootStackParamList } from '../../navigation/types';

export const ProductsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | undefined>();
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const res = await productService.getCategories();
      return res.data.data || [];
    },
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', search, category, lowStockOnly],
    queryFn: async () => {
      const res = await productService.getAll({
        search: search || undefined,
        category,
        lowStock: lowStockOnly || undefined,
      });
      return res.data.data || [];
    },
  });

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`} edges={['top']}>
      <View className="px-4 pt-4 flex-row justify-between items-center">
        <Text className={`text-2xl font-bold ${colors.text}`}>Products</Text>
        <Pressable
          onPress={() => navigation.navigate('ProductForm', {})}
          className="bg-primary-600 w-10 h-10 rounded-full items-center justify-center"
        >
          <Ionicons name="add" size={24} color="#fff" />
        </Pressable>
      </View>

      <View className="px-4">
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search products..." />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
          <Pressable
            onPress={() => setLowStockOnly(!lowStockOnly)}
            className={`mr-2 px-3 py-1.5 rounded-full border ${lowStockOnly ? 'bg-red-100 border-red-300' : colors.border}`}
          >
            <Text className={lowStockOnly ? 'text-red-600 text-sm' : `text-sm ${colors.textMuted}`}>
              Low Stock
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setCategory(undefined)}
            className={`mr-2 px-3 py-1.5 rounded-full ${!category ? 'bg-primary-600' : `border ${colors.border}`}`}
          >
            <Text className={!category ? 'text-white text-sm' : `text-sm ${colors.textMuted}`}>All</Text>
          </Pressable>
          {categories?.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setCategory(cat)}
              className={`mr-2 px-3 py-1.5 rounded-full ${category === cat ? 'bg-primary-600' : `border ${colors.border}`}`}
            >
              <Text className={category === cat ? 'text-white text-sm' : `text-sm ${colors.textMuted}`}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        contentContainerClassName="px-4 pb-6"
        refreshing={isLoading}
        ListEmptyComponent={
          <EmptyState icon="cube-outline" title="No products found" message="Add your first product" />
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
          />
        )}
      />
    </SafeAreaView>
  );
};
