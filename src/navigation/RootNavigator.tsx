import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../stores/authStore';
import type { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { ProductFormScreen } from '../screens/products/ProductFormScreen';
import { ProductDetailScreen } from '../screens/products/ProductDetailScreen';
import { CreateBillScreen } from '../screens/billing/CreateBillScreen';
import { InvoiceSummaryScreen } from '../screens/billing/InvoiceSummaryScreen';
import { SalesHistoryScreen } from '../screens/billing/SalesHistoryScreen';
import { SaleDetailScreen } from '../screens/billing/SaleDetailScreen';
import { ExpensesScreen } from '../screens/expenses/ExpensesScreen';
import { ExpenseFormScreen } from '../screens/expenses/ExpenseFormScreen';
import { CustomersScreen } from '../screens/customers/CustomersScreen';
import { CustomerFormScreen } from '../screens/customers/CustomerFormScreen';
import { CustomerDetailScreen } from '../screens/customers/CustomerDetailScreen';
import { SuppliersScreen } from '../screens/suppliers/SuppliersScreen';
import { SupplierFormScreen } from '../screens/suppliers/SupplierFormScreen';
import { SupplierDetailScreen } from '../screens/suppliers/SupplierDetailScreen';
import { ReportsScreen } from '../screens/reports/ReportsScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="ProductForm" component={ProductFormScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="CreateBill" component={CreateBillScreen} />
          <Stack.Screen name="InvoiceSummary" component={InvoiceSummaryScreen} />
          <Stack.Screen name="SalesHistory" component={SalesHistoryScreen} />
          <Stack.Screen name="SaleDetail" component={SaleDetailScreen} />
          <Stack.Screen name="Expenses" component={ExpensesScreen} />
          <Stack.Screen name="ExpenseForm" component={ExpenseFormScreen} />
          <Stack.Screen name="Customers" component={CustomersScreen} />
          <Stack.Screen name="CustomerForm" component={CustomerFormScreen} />
          <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} />
          <Stack.Screen name="Suppliers" component={SuppliersScreen} />
          <Stack.Screen name="SupplierForm" component={SupplierFormScreen} />
          <Stack.Screen name="SupplierDetail" component={SupplierDetailScreen} />
          <Stack.Screen name="Reports" component={ReportsScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
