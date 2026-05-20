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

export const SignupScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { colors } = useTheme();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please enter name, email, and password');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authService.register({
        name: name.trim(),
        email: email.trim(),
        password,
        shopName: shopName.trim() || undefined,
      });

      if (data.token && data.user) {
        await setAuth(data.user, data.token);
      }
    } catch (e) {
      Alert.alert('Registration Failed', e instanceof Error ? e.message : 'Unknown error');
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
            <Text className={`text-2xl font-bold ${colors.text}`}>Create Account</Text>
            <Text className={`text-sm mt-1 ${colors.textMuted}`}>Start managing your shop today</Text>
          </View>

          <Input label="Name" value={name} onChangeText={setName} placeholder="John Doe" />
          <Input label="Shop Name" value={shopName} onChangeText={setShopName} placeholder="My Awesome Shop" />
          <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="you@example.com" />
          <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />

          <Button title="Create Account" onPress={handleSignup} loading={loading} className="mt-2" />

          <Button
            title="Already have an account? Sign In"
            onPress={() => navigation.navigate('Login')}
            variant="outline"
            className="mt-3"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
