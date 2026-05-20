import { Text, TextInput, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  error?: string;
}

export const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  multiline,
  error,
}: InputProps) => {
  const { colors } = useTheme();

  return (
    <View className="mb-4">
      {label && <Text className={`mb-1.5 text-sm font-medium ${colors.text}`}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        className={`rounded-xl border px-4 py-3 ${colors.border} ${colors.input} ${
          multiline ? 'min-h-[100px]' : ''
        }`}
      />
      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
};
