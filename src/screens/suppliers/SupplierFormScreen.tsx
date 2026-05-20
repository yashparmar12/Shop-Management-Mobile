import { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Header } from '../../components/ui/Header';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { supplierService } from '../../services/supplierService';
import { useTheme } from '../../hooks/useTheme';
import type { RootStackParamList } from '../../navigation/types';

export const SupplierFormScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'SupplierForm'>>();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const isEdit = !!route.params?.supplierId;

  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');

  const { data: supplier } = useQuery({
    queryKey: ['supplier', route.params?.supplierId],
    queryFn: async () => {
      const res = await supplierService.getById(route.params!.supplierId!);
      return res.data.data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (supplier) {
      setShopName(supplier.shopName);
      setOwnerName(supplier.ownerName);
      setMobile(supplier.mobile);
      setAddress(supplier.address || '');
    }
  }, [supplier]);

  const mutation = useMutation({
    mutationFn: () => {
      const payload = { shopName, ownerName, mobile, address };
      if (isEdit) return supplierService.update(route.params!.supplierId!, payload);
      return supplierService.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      navigation.goBack();
    },
    onError: (e: Error) => Alert.alert('Error', e.message),
  });

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`}>
      <Header title={isEdit ? 'Edit Supplier' : 'Add Supplier'} showBack />
      <ScrollView className="px-4 pt-4">
        <Input label="Dukan/Shop Name *" value={shopName} onChangeText={setShopName} />
        <Input label="Owner Name *" value={ownerName} onChangeText={setOwnerName} />
        <Input label="Mobile *" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
        <Input label="Address" value={address} onChangeText={setAddress} multiline />
        <Button title="Save" onPress={() => mutation.mutate()} loading={mutation.isPending} className="mb-8" />
      </ScrollView>
    </SafeAreaView>
  );
};
