import { ActivityIndicator, Pressable, Text } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const variants = {
  primary: 'bg-primary-600 active:bg-primary-700',
  secondary: 'bg-slate-600 active:bg-slate-700',
  danger: 'bg-red-600 active:bg-red-700',
  outline: 'bg-transparent border-2 border-primary-600',
};

const textVariants = {
  primary: 'text-white',
  secondary: 'text-white',
  danger: 'text-white',
  outline: 'text-primary-600',
};

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  className = '',
}: ButtonProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled || loading}
    className={`rounded-xl px-4 py-3.5 items-center justify-center ${variants[variant]} ${
      disabled ? 'opacity-50' : ''
    } ${className}`}
  >
    {loading ? (
      <ActivityIndicator color={variant === 'outline' ? '#2563eb' : '#fff'} />
    ) : (
      <Text className={`font-semibold text-base ${textVariants[variant]}`}>{title}</Text>
    )}
  </Pressable>
);
