import React from 'react';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { DollarSign, ShoppingCart, Package, Users, AlertCircle, Eye } from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { salesData, categoryData, topProducts, mockOrders, mockInventory } from '../data/mockData';

const COLORS = ['#1E40AF', '#059669', '#F59E0B', '#7C3AED', '#6B7280'];

export function Dashboard() {
  const lowStockItems = mockInventory.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock');
  const recentOrders = mockOrders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl text-[#1F2937] mb-1">Dashboard</h1>
        <p className="text-sm text-[#6B7280]">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value="৳ 3,24,500"
          change={12.5}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Total Orders"
          value="234"
          change={8.2}
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="Total Products"
          value="1,247"
          change={-2.4}
          icon={Package}
          color="purple"
        />
        <StatCard
          title="Total Customers"
          value="892"
          change={15.3}
          icon={Users}
          color="amber"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Overview */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-[#1F2937]">Sales Overview</h3>
            <select className="px-3 py-1 border border-[#E5E7EB] rounded-lg text-sm text-[#6B7280]">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1E40AF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#1E40AF"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Category */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E5E7EB]">
          <h3 className="text-lg text-[#1F2937] mb-4">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Selling Products Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E5E7EB]">
        <h3 className="text-lg text-[#1F2937] mb-4">Top Selling Products</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProducts} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" tick={{ fill: '#6B7280', fontSize: 12 }} />
            <YAxis dataKey="name" type="category" tick={{ fill: '#6B7280', fontSize: 12 }} width={150} />
            <Tooltip />
            <Bar dataKey="revenue" fill="#1E40AF" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-[#1F2937]">Recent Orders</h3>
            <button className="text-sm text-[#1E40AF] hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  <th className="text-left py-3 px-2 text-xs text-[#6B7280]">Order ID</th>
                  <th className="text-left py-3 px-2 text-xs text-[#6B7280]">Customer</th>
                  <th className="text-left py-3 px-2 text-xs text-[#6B7280]">Amount</th>
                  <th className="text-left py-3 px-2 text-xs text-[#6B7280]">Status</th>
                  <th className="text-left py-3 px-2 text-xs text-[#6B7280]">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[#E5E7EB] last:border-0">
                    <td className="py-3 px-2 text-sm text-[#1F2937]">{order.orderId}</td>
                    <td className="py-3 px-2 text-sm text-[#1F2937]">{order.customer}</td>
                    <td className="py-3 px-2 text-sm text-[#1F2937]">৳ {order.total.toLocaleString()}</td>
                    <td className="py-3 px-2">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="py-3 px-2">
                      <button className="p-1 hover:bg-[#F9FAFB] rounded">
                        <Eye size={16} className="text-[#6B7280]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={20} className="text-[#F59E0B]" />
            <h3 className="text-lg text-[#1F2937]">Low Stock Alerts</h3>
          </div>
          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-[#FEF3C7] rounded-lg border border-[#F59E0B]/20"
              >
                <div>
                  <p className="text-sm text-[#1F2937]">{item.productName}</p>
                  <p className="text-xs text-[#6B7280]">{item.variant} - SKU: {item.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#DC2626]">{item.currentStock} left</p>
                  <StatusBadge status={item.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
