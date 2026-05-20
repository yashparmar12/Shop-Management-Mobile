import { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '../../components/ui/Header';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/authService';
import { useTheme } from '../../hooks/useTheme';
import type { AuthStackParamList } from '../../navigation/types';

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Enter your email');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authService.forgotPassword(email.trim());
      Alert.alert('Success', data.message || 'Check your email', [
        {
          text: 'Reset Password',
          onPress: () =>
            navigation.navigate('ResetPassword', {
              token: (data as { resetToken?: string }).resetToken,
            }),
        },
        { text: 'OK' },
      ]);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`}>
      <Header title="Forgot Password" showBack />
      <ScrollView className="px-4 pt-4">
        <Text className={`mb-4 ${colors.textMuted}`}>
          Enter your email to receive a password reset token (demo mode).
        </Text>
        <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Button title="Send Reset Link" onPress={handleSubmit} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
};
