import { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Header } from '../../components/ui/Header';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { customerService } from '../../services/customerService';
import { useTheme } from '../../hooks/useTheme';
import type { RootStackParamList } from '../../navigation/types';

export const CustomerFormScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'CustomerForm'>>();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const isEdit = !!route.params?.customerId;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const { data: customer } = useQuery({
    queryKey: ['customer', route.params?.customerId],
    queryFn: async () => {
      const res = await customerService.getById(route.params!.customerId!);
      return res.data.data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setPhone(customer.phone);
      setEmail(customer.email || '');
      setAddress(customer.address || '');
    }
  }, [customer]);

  const mutation = useMutation({
    mutationFn: () => {
      const payload = { name, phone, email, address };
      if (isEdit) return customerService.update(route.params!.customerId!, payload);
      return customerService.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      navigation.goBack();
    },
    onError: (e: Error) => Alert.alert('Error', e.message),
  });

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`}>
      <Header title={isEdit ? 'Edit Customer' : 'Add Customer'} showBack />
      <ScrollView className="px-4 pt-4">
        <Input label="Name *" value={name} onChangeText={setName} />
        <Input label="Phone *" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Input label="Address" value={address} onChangeText={setAddress} multiline />
        <Button title="Save" onPress={() => mutation.mutate()} loading={mutation.isPending} className="mb-8" />
      </ScrollView>
    </SafeAreaView>
  );
};
