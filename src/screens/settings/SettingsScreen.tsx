import { Alert, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from '@tanstack/react-query';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useTheme } from '../../hooks/useTheme';
import { authService } from '../../services/authService';

export const SettingsScreen = () => {
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const isDark = useThemeStore((s) => s.isDark);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const [name, setName] = useState(user?.name || '');
  const [shopName, setShopName] = useState(user?.shopName || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const updateMutation = useMutation({
    mutationFn: () => authService.updateProfile({ name, shopName, phone }),
    onSuccess: (res) => {
      if (res.data.user) setUser(res.data.user);
      Alert.alert('Success', 'Profile updated');
    },
    onError: (e: Error) => Alert.alert('Error', e.message),
  });

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`}>
      <Header title="Settings" showBack />
      <ScrollView className="px-4 pt-4">
        <Card className="mb-4 flex-row items-center justify-between">
          <Text className={`font-semibold ${colors.text}`}>Dark Mode</Text>
          <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ true: '#2563eb' }} />
        </Card>

        <Text className={`text-lg font-bold mb-3 ${colors.text}`}>Profile</Text>
        <Input label="Name" value={name} onChangeText={setName} />
        <Input label="Shop Name" value={shopName} onChangeText={setShopName} />
        <Input label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Text className={`mb-4 text-sm ${colors.textMuted}`}>Email: {user?.email}</Text>
        <Button title="Save Profile" onPress={() => updateMutation.mutate()} loading={updateMutation.isPending} />

        <Button title="Logout" onPress={handleLogout} variant="danger" className="mt-6 mb-8" />
      </ScrollView>
    </SafeAreaView>
  );
};
