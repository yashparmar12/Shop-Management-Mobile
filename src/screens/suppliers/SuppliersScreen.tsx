import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { supplierService } from '../../services/supplierService';
import { useTheme } from '../../hooks/useTheme';
import type { RootStackParamList } from '../../navigation/types';

export const SuppliersScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();

  const { data: suppliers, isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const res = await supplierService.getAll();
      return res.data.data || [];
    },
  });

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`}>
      <Header
        title="Suppliers"
        showBack
        rightAction={
          <Pressable onPress={() => navigation.navigate('SupplierForm', {})} className="p-2">
            <Ionicons name="add-circle" size={28} color="#2563eb" />
          </Pressable>
        }
      />
      <FlatList
        data={suppliers}
        keyExtractor={(s) => s._id}
        contentContainerClassName="px-4 py-2"
        refreshing={isLoading}
        ListEmptyComponent={<EmptyState title="No suppliers" />}
        renderItem={({ item }) => (
          <Card
            onPress={() => navigation.navigate('SupplierDetail', { supplierId: item._id })}
            className="mb-2"
          >
            <Text className={`font-semibold ${colors.text}`}>{item.shopName}</Text>
            <Text className={`text-sm ${colors.textMuted}`}>{item.ownerName} • {item.mobile}</Text>
            <Text className={`text-xs mt-1 ${colors.textMuted}`}>
              {item.purchases?.length || 0} purchases recorded
            </Text>
          </Card>
        )}
      />
    </SafeAreaView>
  );
};
