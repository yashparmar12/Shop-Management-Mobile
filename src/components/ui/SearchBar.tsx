import { TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChangeText, placeholder = 'Search...' }: SearchBarProps) => {
  const { colors } = useTheme();

  return (
    <View className={`flex-row items-center rounded-xl border px-3 mb-4 ${colors.border} ${colors.input}`}>
      <Ionicons name="search" size={20} color="#94a3b8" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        className={`flex-1 py-3 px-2 ${colors.text}`}
      />
    </View>
  );
};
