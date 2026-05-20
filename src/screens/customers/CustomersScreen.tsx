import { FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { Header } from '../../components/ui/Header';
import { SearchBar } from '../../components/ui/SearchBar';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { customerService } from '../../services/customerService';
import { useTheme } from '../../hooks/useTheme';
import { formatCurrency } from '../../utils/format';
import type { RootStackParamList } from '../../navigation/types';

export const CustomersScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const [search, setSearch] = useState('');

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', search],
    queryFn: async () => {
      const res = await customerService.getAll(search || undefined);
      return res.data.data || [];
    },
  });

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`}>
      <Header
        title="Customers"
        showBack
        rightAction={
          <Pressable onPress={() => navigation.navigate('CustomerForm', {})} className="p-2">
            <Ionicons name="add-circle" size={28} color="#2563eb" />
          </Pressable>
        }
      />
      <View className="px-4">
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search customers..." />
      </View>
      <FlatList
        data={customers}
        keyExtractor={(c) => c._id}
        contentContainerClassName="px-4 pb-6"
        refreshing={isLoading}
        ListEmptyComponent={<EmptyState title="No customers" />}
        renderItem={({ item }) => (
          <Card
            onPress={() => navigation.navigate('CustomerDetail', { customerId: item._id })}
            className="mb-2"
          >
            <View className="flex-row justify-between">
              <View>
                <Text className={`font-semibold ${colors.text}`}>{item.name}</Text>
                <Text className={`text-sm ${colors.textMuted}`}>{item.phone}</Text>
              </View>
              {item.dueAmount > 0 && (
                <Text className="text-red-600 font-bold">Due: {formatCurrency(item.dueAmount)}</Text>
              )}
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
};
