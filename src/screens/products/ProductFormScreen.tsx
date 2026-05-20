import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Header } from '../../components/ui/Header';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { productService } from '../../services/productService';
import { useTheme } from '../../hooks/useTheme';
import { PRODUCT_CATEGORIES } from '../../constants/config';
import type { RootStackParamList } from '../../navigation/types';

export const ProductFormScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ProductForm'>>();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const isEdit = !!route.params?.productId;

  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>(PRODUCT_CATEGORIES[0]);
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [stock, setStock] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('10');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const { data: product } = useQuery({
    queryKey: ['product', route.params?.productId],
    queryFn: async () => {
      const res = await productService.getById(route.params!.productId!);
      return res.data.data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setSku(product.sku || '');
      setPrice(String(product.price));
      setCostPrice(String(product.costPrice));
      setStock(String(product.stock));
      setLowStockThreshold(String(product.lowStockThreshold));
      setDescription(product.description || '');
    }
  }, [product]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append('name', name);
    fd.append('category', category);
    fd.append('sku', sku);
    fd.append('price', price);
    fd.append('costPrice', costPrice);
    fd.append('stock', stock);
    fd.append('lowStockThreshold', lowStockThreshold);
    fd.append('description', description);
    if (imageUri) {
      const filename = imageUri.split('/').pop() || 'image.jpg';
      fd.append('image', { uri: imageUri, name: filename, type: 'image/jpeg' } as unknown as Blob);
    }
    return fd;
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const fd = buildFormData();
      if (isEdit) return productService.update(route.params!.productId!, fd);
      return productService.create(fd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigation.goBack();
    },
    onError: (e: Error) => Alert.alert('Error', e.message),
  });

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`}>
      <Header title={isEdit ? 'Edit Product' : 'Add Product'} showBack />
      <ScrollView className="px-4 pt-2">
        <Pressable onPress={pickImage} className="mb-4 items-center">
          <View className="w-24 h-24 rounded-2xl bg-slate-200 items-center justify-center overflow-hidden">
            {imageUri ? (
              <Image source={{ uri: imageUri }} className="w-full h-full" />
            ) : (
              <Text className={colors.textMuted}>Tap to add image</Text>
            )}
          </View>
        </Pressable>
        <Input label="Product Name *" value={name} onChangeText={setName} />
        <Input label="Category *" value={category} onChangeText={setCategory} />
        <Input label="SKU" value={sku} onChangeText={setSku} />
        <Input label="Selling Price *" value={price} onChangeText={setPrice} keyboardType="numeric" />
        <Input label="Cost Price *" value={costPrice} onChangeText={setCostPrice} keyboardType="numeric" />
        <Input label="Stock *" value={stock} onChangeText={setStock} keyboardType="numeric" />
        <Input label="Low Stock Alert" value={lowStockThreshold} onChangeText={setLowStockThreshold} keyboardType="numeric" />
        <Input label="Description" value={description} onChangeText={setDescription} multiline />
        <Button
          title={isEdit ? 'Update Product' : 'Add Product'}
          onPress={() => mutation.mutate()}
          loading={mutation.isPending}
          className="mb-8"
        />
      </ScrollView>
    </SafeAreaView>
  );
};
