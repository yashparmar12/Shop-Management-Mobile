import { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Header } from '../../components/ui/Header';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../hooks/useTheme';
import type { AuthStackParamList } from '../../navigation/types';

export const ResetPasswordScreen = () => {
  const route = useRoute<RouteProp<AuthStackParamList, 'ResetPassword'>>();
  const { colors } = useTheme();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [token, setToken] = useState(route.params?.token || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!token || !password) {
      Alert.alert('Error', 'Fill all fields');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authService.resetPassword(token, password);
      if (data.token && data.user) {
        await setAuth(data.user, data.token);
      }
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`}>
      <Header title="Reset Password" showBack />
      <ScrollView className="px-4 pt-4">
        <Input label="Reset Token" value={token} onChangeText={setToken} />
        <Input label="New Password" value={password} onChangeText={setPassword} secureTextEntry />
        <Input label="Confirm Password" value={confirm} onChangeText={setConfirm} secureTextEntry />
        <Button title="Reset Password" onPress={handleReset} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
};
