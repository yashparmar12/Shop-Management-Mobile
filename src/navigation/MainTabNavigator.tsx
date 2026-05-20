import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { MainTabParamList } from './types';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { ProductsScreen } from '../screens/products/ProductsScreen';
import { BillingScreen } from '../screens/billing/BillingScreen';
import { MoreScreen } from '../screens/more/MoreScreen';
import { useTheme } from '../hooks/useTheme';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator = () => {
  const { isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          borderTopColor: isDark ? '#334155' : '#e2e8f0',
          paddingBottom: 4,
          height: 60,
        },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Dashboard: 'grid-outline',
            Products: 'cube-outline',
            Billing: 'receipt-outline',
            More: 'menu-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Billing" component={BillingScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
};
