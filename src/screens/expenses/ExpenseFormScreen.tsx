import { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Header } from '../../components/ui/Header';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { expenseService } from '../../services/expenseService';
import { useTheme } from '../../hooks/useTheme';
import { EXPENSE_CATEGORIES } from '../../constants/config';
import type { RootStackParamList } from '../../navigation/types';

export const ExpenseFormScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ExpenseForm'>>();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const isEdit = !!route.params?.expenseId;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const { data: expense } = useQuery({
    queryKey: ['expense', route.params?.expenseId],
    queryFn: async () => {
      const res = await expenseService.getById(route.params!.expenseId!);
      return res.data.data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setCategory(expense.category);
      setAmount(String(expense.amount));
      setNotes(expense.notes || '');
    }
  }, [expense]);

  const mutation = useMutation({
    mutationFn: () => {
      const payload = { title, category, amount: Number(amount), notes, date: new Date().toISOString() };
      if (isEdit) return expenseService.update(route.params!.expenseId!, payload);
      return expenseService.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigation.goBack();
    },
    onError: (e: Error) => Alert.alert('Error', e.message),
  });

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`}>
      <Header title={isEdit ? 'Edit Expense' : 'Add Expense'} showBack />
      <ScrollView className="px-4 pt-4">
        <Input label="Title *" value={title} onChangeText={setTitle} />
        <Input label="Category *" value={category} onChangeText={setCategory} />
        <Input label="Amount *" value={amount} onChangeText={setAmount} keyboardType="numeric" />
        <Input label="Notes" value={notes} onChangeText={setNotes} multiline />
        <Button title={isEdit ? 'Update' : 'Save Expense'} onPress={() => mutation.mutate()} loading={mutation.isPending} className="mb-8" />
      </ScrollView>
    </SafeAreaView>
  );
};
