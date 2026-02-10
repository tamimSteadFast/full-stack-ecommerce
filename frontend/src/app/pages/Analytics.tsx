import React from 'react';
import { StatCard } from '../components/StatCard';
import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { salesData, categoryData } from '../data/mockData';

export function Analytics() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#1F2937] mb-1">Analytics & Reports</h1>
          <p className="text-sm text-[#6B7280]">Detailed insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
          </select>
          <button className="px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E40AF]/90 text-sm">
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
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
          title="Avg Order Value"
          value="৳ 1,386"
          change={5.7}
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="New Customers"
          value="67"
          change={18.3}
          icon={Users}
          color="amber"
        />
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E5E7EB]">
        <h3 className="text-lg text-[#1F2937] mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#1E40AF"
              strokeWidth={2}
              dot={{ fill: '#1E40AF', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E5E7EB]">
        <h3 className="text-lg text-[#1F2937] mb-4">Category Performance</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="revenue" fill="#059669" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E5E7EB]">
          <h4 className="text-sm text-[#6B7280] mb-2">Conversion Rate</h4>
          <div className="text-3xl text-[#1F2937] mb-2">3.24%</div>
          <div className="text-sm text-[#059669]">+0.8% from last month</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E5E7EB]">
          <h4 className="text-sm text-[#6B7280] mb-2">Repeat Customer Rate</h4>
          <div className="text-3xl text-[#1F2937] mb-2">28.5%</div>
          <div className="text-sm text-[#059669]">+2.3% from last month</div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E5E7EB]">
          <h4 className="text-sm text-[#6B7280] mb-2">Customer Lifetime Value</h4>
          <div className="text-3xl text-[#1F2937] mb-2">৳ 4,234</div>
          <div className="text-sm text-[#DC2626]">-1.2% from last month</div>
        </div>
      </div>
    </div>
  );
}
