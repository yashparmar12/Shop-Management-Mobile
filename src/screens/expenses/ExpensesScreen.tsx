import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { expenseService } from '../../services/expenseService';
import { useTheme } from '../../hooks/useTheme';
import { formatCurrency, formatDate } from '../../utils/format';
import type { RootStackParamList } from '../../navigation/types';

export const ExpensesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const now = new Date();

  const { data, isLoading } = useQuery({
    queryKey: ['expenses', now.getMonth(), now.getFullYear()],
    queryFn: async () => {
      const res = await expenseService.getAll({
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      });
      return res.data;
    },
  });

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`}>
      <Header
        title="Expenses"
        showBack
        rightAction={
          <Pressable onPress={() => navigation.navigate('ExpenseForm', {})} className="p-2">
            <Ionicons name="add-circle" size={28} color="#2563eb" />
          </Pressable>
        }
      />
      <View className="px-4 py-3">
        <Card>
          <Text className={colors.textMuted}>Monthly Total</Text>
          <Text className={`text-2xl font-bold text-red-600`}>{formatCurrency(data?.total ?? 0)}</Text>
        </Card>
      </View>
      <FlatList
        data={data?.data}
        keyExtractor={(e) => e._id}
        contentContainerClassName="px-4 pb-6"
        refreshing={isLoading}
        ListEmptyComponent={<EmptyState title="No expenses this month" />}
        renderItem={({ item }) => (
          <Card
            onPress={() => navigation.navigate('ExpenseForm', { expenseId: item._id })}
            className="mb-2"
          >
            <View className="flex-row justify-between">
              <View>
                <Text className={`font-semibold ${colors.text}`}>{item.title}</Text>
                <Text className={`text-xs ${colors.textMuted}`}>{item.category} • {formatDate(item.date)}</Text>
              </View>
              <Text className="text-red-600 font-bold">{formatCurrency(item.amount)}</Text>
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
};
