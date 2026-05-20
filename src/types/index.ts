export interface User {
  _id: string;
  name: string;
  email: string;
  shopName?: string;
  phone?: string;
  address?: string;
}

export interface Product {
  _id: string;
  name: string;
  category: string;
  sku?: string;
  price: number;
  costPrice: number;
  stock: number;
  lowStockThreshold: number;
  image?: string;
  description?: string;
  stockHistory?: StockHistoryEntry[];
}

export interface StockHistoryEntry {
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  previousStock: number;
  newStock: number;
  note?: string;
  createdAt?: string;
}

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  costPrice: number;
  total: number;
}

export interface Sale {
  _id: string;
  invoiceNumber: string;
  customerId?: string;
  customerName?: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  totalCost: number;
  profit: number;
  paymentMethod: string;
  amountPaid: number;
  dueAmount: number;
  notes?: string;
  createdAt?: string;
}

export interface Expense {
  _id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  dueAmount: number;
  paymentHistory: PaymentRecord[];
}

export interface PaymentRecord {
  amount: number;
  method: string;
  note?: string;
  createdAt: string;
}

export interface Supplier {
  _id: string;
  shopName: string;
  ownerName: string;
  mobile: string;
  address?: string;
  purchases: PurchaseRecord[];
}

export interface PurchaseRecord {
  _id?: string;
  items: string;
  amount: number;
  purchaseDate: string;
  notes?: string;
}

export interface DashboardData {
  totalProducts: number;
  totalSales: number;
  monthlySales: number;
  monthlyProfit: number;
  monthlyExpenses: number;
  profitLoss: number;
  lowStockCount: number;
  lowStockItems: Product[];
  recentSales: Sale[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
  user?: User;
}
