import React, { useState } from 'react';
import { Search, Filter, Download, Eye } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { mockPayments } from '../data/mockData';

export function Payments() {
  const [payments] = useState(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPaymentMethodIcon = (method: string) => {
    const iconMap: { [key: string]: string } = {
      bKash: '💳',
      Nagad: '💰',
      Card: '💳',
      Cash: '💵'
    };
    return iconMap[method] || '💳';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#1F2937] mb-1">Payments</h1>
          <p className="text-sm text-[#6B7280]">Track and manage all payment transactions</p>
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
              placeholder="Search by transaction ID, order ID, or customer..."
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
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
              <Filter size={20} />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Transaction ID</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Order ID</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Customer</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Amount</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Payment Method</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Status</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Date & Time</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB]">
                  <td className="py-4 px-6 text-sm text-[#6B7280]">{payment.transactionId}</td>
                  <td className="py-4 px-6 text-sm text-[#1E40AF]">{payment.orderId}</td>
                  <td className="py-4 px-6 text-sm text-[#1F2937]">{payment.customer}</td>
                  <td className="py-4 px-6 text-sm text-[#1F2937]">
                    ৳ {payment.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getPaymentMethodIcon(payment.method)}</span>
                      <span className="text-sm text-[#1F2937]">{payment.method}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={payment.status} />
                  </td>
                  <td className="py-4 px-6 text-sm text-[#6B7280]">{payment.date}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-[#E5E7EB] rounded-lg transition-colors">
                        <Eye size={16} className="text-[#6B7280]" />
                      </button>
                      {payment.status === 'success' && (
                        <button className="px-3 py-1 text-xs border border-[#DC2626] text-[#DC2626] rounded-lg hover:bg-[#FEE2E2]">
                          Refund
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB]">
          <div className="text-sm text-[#6B7280]">
            Showing {filteredPayments.length} of {payments.length} payments
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-[#E5E7EB] rounded-lg text-sm text-[#6B7280] hover:bg-[#F9FAFB]">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#1E40AF] text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1 border border-[#E5E7EB] rounded-lg text-sm text-[#6B7280] hover:bg-[#F9FAFB]">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
