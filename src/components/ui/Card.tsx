import { Pressable, View, type ViewProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface CardProps extends ViewProps {
  onPress?: () => void;
  className?: string;
  children: React.ReactNode;
}

export const Card = ({ onPress, className = '', children, ...props }: CardProps) => {
  const { colors } = useTheme();
  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper
      onPress={onPress}
      className={`rounded-2xl p-4 shadow-sm border ${colors.card} ${colors.border} ${className}`}
      {...props}
    >
      {children}
    </Wrapper>
  );
};
