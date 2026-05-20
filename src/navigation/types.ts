import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Product, Sale, Customer, Supplier, Expense } from '../types';

export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token?: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Products: undefined;
  Billing: undefined;
  More: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ProductForm: { productId?: string };
  ProductDetail: { productId: string };
  CreateBill: undefined;
  InvoiceSummary: { saleId: string };
  SalesHistory: undefined;
  SaleDetail: { saleId: string };
  Expenses: undefined;
  ExpenseForm: { expenseId?: string };
  Customers: undefined;
  CustomerForm: { customerId?: string };
  CustomerDetail: { customerId: string };
  Suppliers: undefined;
  SupplierForm: { supplierId?: string };
  SupplierDetail: { supplierId: string };
  Reports: undefined;
  Settings: undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
