import React, { useState } from 'react';
import { Search, Filter, Download, Eye } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { mockOrders } from '../data/mockData';

export function Orders() {
  const [orders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#1F2937] mb-1">Orders</h1>
          <p className="text-sm text-[#6B7280]">Manage and track all customer orders</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] text-[#1F2937]">
          <Download size={20} />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-[#E5E7EB]">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
            />
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
              <Filter size={20} />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Order ID</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Customer</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Date & Time</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Items</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Total Amount</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Payment Status</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Order Status</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB]">
                  <td className="py-4 px-6">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="py-4 px-6 text-sm text-[#1E40AF]">{order.orderId}</td>
                  <td className="py-4 px-6 text-sm text-[#1F2937]">{order.customer}</td>
                  <td className="py-4 px-6 text-sm text-[#6B7280]">{order.date}</td>
                  <td className="py-4 px-6 text-sm text-[#6B7280]">{order.items}</td>
                  <td className="py-4 px-6 text-sm text-[#1F2937]">৳ {order.total.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <StatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={order.orderStatus}
                      className="px-3 py-1 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <button className="p-2 hover:bg-[#E5E7EB] rounded-lg transition-colors">
                      <Eye size={16} className="text-[#6B7280]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB]">
          <div className="text-sm text-[#6B7280]">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-[#E5E7EB] rounded-lg text-sm text-[#6B7280] hover:bg-[#F9FAFB]">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#1E40AF] text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1 border border-[#E5E7EB] rounded-lg text-sm text-[#6B7280] hover:bg-[#F9FAFB]">
              2
            </button>
            <button className="px-3 py-1 border border-[#E5E7EB] rounded-lg text-sm text-[#6B7280] hover:bg-[#F9FAFB]">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
