import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../hooks/useTheme';
import type { AuthStackParamList } from '../../navigation/types';

export const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { colors } = useTheme();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('admin@shop.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authService.login(email.trim(), password);
      if (data.token && data.user) {
        await setAuth(data.user, data.token);
      }
    } catch (e) {
      Alert.alert('Login Failed', e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-8">
          <View className="items-center mb-10">
            <View className="w-20 h-20 rounded-2xl bg-primary-600 items-center justify-center mb-4">
              <Text className="text-white text-3xl font-bold">SI</Text>
            </View>
            <Text className={`text-2xl font-bold ${colors.text}`}>Shop Inventory</Text>
            <Text className={`text-sm mt-1 ${colors.textMuted}`}>Manage your shop efficiently</Text>
          </View>

          <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="admin@shop.com" />
          <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />

          <Button title="Sign In" onPress={handleLogin} loading={loading} className="mt-2" />

          <Button
            title="Forgot Password?"
            onPress={() => navigation.navigate('ForgotPassword')}
            variant="outline"
            className="mt-3"
          />

          <Text className={`text-center text-xs mt-8 ${colors.textMuted}`}>
            Demo: admin@shop.com / admin123
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
