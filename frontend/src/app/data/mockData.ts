// Mock data for e-commerce admin panel

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  image: string;
}

export interface Order {
  id: string;
  orderId: string;
  customer: string;
  date: string;
  items: number;
  total: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
}

export interface InventoryItem {
  id: string;
  productName: string;
  variant: string;
  sku: string;
  currentStock: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastUpdated: string;
}

export interface Payment {
  id: string;
  transactionId: string;
  orderId: string;
  customer: string;
  amount: number;
  method: 'bKash' | 'Nagad' | 'Card' | 'Cash';
  status: 'success' | 'pending' | 'failed';
  date: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  orderId: string;
  customer: string;
  carrier: string;
  status: 'pending' | 'in-transit' | 'delivered';
  shippedDate: string;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Cotton T-Shirt',
    sku: 'TS-001',
    category: 'Apparel',
    brand: 'StyleCo',
    price: 1299,
    stock: 145,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop'
  },
  {
    id: '2',
    name: 'Wireless Bluetooth Headphones',
    sku: 'AU-002',
    category: 'Electronics',
    brand: 'SoundMax',
    price: 3499,
    stock: 67,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'
  },
  {
    id: '3',
    name: 'Leather Wallet',
    sku: 'AC-003',
    category: 'Accessories',
    brand: 'LeatherCraft',
    price: 899,
    stock: 23,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop'
  },
  {
    id: '4',
    name: 'Smart Watch Pro',
    sku: 'EL-004',
    category: 'Electronics',
    brand: 'TechGear',
    price: 8999,
    stock: 5,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop'
  },
  {
    id: '5',
    name: 'Running Shoes',
    sku: 'SH-005',
    category: 'Footwear',
    brand: 'RunFast',
    price: 4299,
    stock: 0,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop'
  },
  {
    id: '6',
    name: 'Backpack',
    sku: 'AC-006',
    category: 'Accessories',
    brand: 'TravelPro',
    price: 2199,
    stock: 88,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop'
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    orderId: '#12345',
    customer: 'Kamal Ahmed',
    date: '2026-02-08 14:30',
    items: 3,
    total: 7899,
    paymentStatus: 'paid',
    orderStatus: 'delivered'
  },
  {
    id: '2',
    orderId: '#12346',
    customer: 'Fatima Khan',
    date: '2026-02-08 11:20',
    items: 1,
    total: 3499,
    paymentStatus: 'paid',
    orderStatus: 'shipped'
  },
  {
    id: '3',
    orderId: '#12347',
    customer: 'Rahim Hossain',
    date: '2026-02-07 16:45',
    items: 2,
    total: 5198,
    paymentStatus: 'pending',
    orderStatus: 'processing'
  },
  {
    id: '4',
    orderId: '#12348',
    customer: 'Nusrat Jahan',
    date: '2026-02-07 09:15',
    items: 4,
    total: 12897,
    paymentStatus: 'paid',
    orderStatus: 'processing'
  },
  {
    id: '5',
    orderId: '#12349',
    customer: 'Shafiq Rahman',
    date: '2026-02-06 18:30',
    items: 1,
    total: 899,
    paymentStatus: 'failed',
    orderStatus: 'pending'
  }
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Kamal Ahmed',
    email: 'kamal.ahmed@example.com',
    phone: '+880 1712-345678',
    totalOrders: 15,
    totalSpent: 45000,
    joinDate: '2025-08-15'
  },
  {
    id: '2',
    name: 'Fatima Khan',
    email: 'fatima.khan@example.com',
    phone: '+880 1823-456789',
    totalOrders: 8,
    totalSpent: 28000,
    joinDate: '2025-10-22'
  },
  {
    id: '3',
    name: 'Rahim Hossain',
    email: 'rahim.h@example.com',
    phone: '+880 1934-567890',
    totalOrders: 22,
    totalSpent: 67500,
    joinDate: '2025-06-10'
  },
  {
    id: '4',
    name: 'Nusrat Jahan',
    email: 'nusrat.jahan@example.com',
    phone: '+880 1645-678901',
    totalOrders: 5,
    totalSpent: 15000,
    joinDate: '2025-12-05'
  }
];

export const mockInventory: InventoryItem[] = [
  {
    id: '1',
    productName: 'Premium Cotton T-Shirt',
    variant: 'Blue, M',
    sku: 'TS-001-BL-M',
    currentStock: 145,
    status: 'in-stock',
    lastUpdated: '2026-02-08'
  },
  {
    id: '2',
    productName: 'Wireless Bluetooth Headphones',
    variant: 'Black',
    sku: 'AU-002-BK',
    currentStock: 67,
    status: 'in-stock',
    lastUpdated: '2026-02-07'
  },
  {
    id: '3',
    productName: 'Leather Wallet',
    variant: 'Brown',
    sku: 'AC-003-BR',
    currentStock: 23,
    status: 'low-stock',
    lastUpdated: '2026-02-06'
  },
  {
    id: '4',
    productName: 'Smart Watch Pro',
    variant: 'Silver',
    sku: 'EL-004-SL',
    currentStock: 5,
    status: 'low-stock',
    lastUpdated: '2026-02-05'
  },
  {
    id: '5',
    productName: 'Running Shoes',
    variant: 'Red, 42',
    sku: 'SH-005-RD-42',
    currentStock: 0,
    status: 'out-of-stock',
    lastUpdated: '2026-02-04'
  }
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    transactionId: 'TXN-789456123',
    orderId: '#12345',
    customer: 'Kamal Ahmed',
    amount: 7899,
    method: 'bKash',
    status: 'success',
    date: '2026-02-08 14:30'
  },
  {
    id: '2',
    transactionId: 'TXN-789456124',
    orderId: '#12346',
    customer: 'Fatima Khan',
    amount: 3499,
    method: 'Nagad',
    status: 'success',
    date: '2026-02-08 11:20'
  },
  {
    id: '3',
    transactionId: 'TXN-789456125',
    orderId: '#12347',
    customer: 'Rahim Hossain',
    amount: 5198,
    method: 'Card',
    status: 'pending',
    date: '2026-02-07 16:45'
  },
  {
    id: '4',
    transactionId: 'TXN-789456126',
    orderId: '#12349',
    customer: 'Shafiq Rahman',
    amount: 899,
    method: 'Cash',
    status: 'failed',
    date: '2026-02-06 18:30'
  }
];

export const mockShipments: Shipment[] = [
  {
    id: '1',
    trackingNumber: 'TRACK-123456',
    orderId: '#12345',
    customer: 'Kamal Ahmed',
    carrier: 'Sundarban Courier',
    status: 'delivered',
    shippedDate: '2026-02-06'
  },
  {
    id: '2',
    trackingNumber: 'TRACK-123457',
    orderId: '#12346',
    customer: 'Fatima Khan',
    carrier: 'SA Paribahan',
    status: 'in-transit',
    shippedDate: '2026-02-07'
  },
  {
    id: '3',
    trackingNumber: 'TRACK-123458',
    orderId: '#12348',
    customer: 'Nusrat Jahan',
    carrier: 'Pathao',
    status: 'pending',
    shippedDate: '2026-02-08'
  }
];

export const salesData = [
  { date: 'Jan 30', revenue: 45000, orders: 32 },
  { date: 'Jan 31', revenue: 52000, orders: 38 },
  { date: 'Feb 01', revenue: 48000, orders: 35 },
  { date: 'Feb 02', revenue: 61000, orders: 42 },
  { date: 'Feb 03', revenue: 55000, orders: 39 },
  { date: 'Feb 04', revenue: 67000, orders: 48 },
  { date: 'Feb 05', revenue: 72000, orders: 51 },
  { date: 'Feb 06', revenue: 58000, orders: 40 },
  { date: 'Feb 07', revenue: 63000, orders: 44 },
  { date: 'Feb 08', revenue: 69000, orders: 47 },
  { date: 'Feb 09', revenue: 75000, orders: 52 }
];

export const categoryData = [
  { name: 'Electronics', value: 35, revenue: 145000 },
  { name: 'Apparel', value: 28, revenue: 98000 },
  { name: 'Footwear', value: 18, revenue: 67000 },
  { name: 'Accessories', value: 12, revenue: 43000 },
  { name: 'Others', value: 7, revenue: 21000 }
];

export const topProducts = [
  { name: 'Wireless Headphones', sales: 234, revenue: 818766 },
  { name: 'Smart Watch Pro', sales: 187, revenue: 1682813 },
  { name: 'Running Shoes', sales: 156, revenue: 670644 },
  { name: 'Cotton T-Shirt', sales: 143, revenue: 185757 },
  { name: 'Backpack', sales: 98, revenue: 215502 }
];
