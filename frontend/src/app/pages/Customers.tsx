import React, { useState } from 'react';
import { Search, Filter, UserPlus, Eye, Edit, Trash2 } from 'lucide-react';
import { mockCustomers } from '../data/mockData';

export function Customers() {
  const [customers] = useState(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#1F2937] mb-1">Customers</h1>
          <p className="text-sm text-[#6B7280]">Manage your customer database</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E40AF]/90">
          <UserPlus size={20} />
          Add Customer
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-[#E5E7EB]">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
            />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
            <Filter size={20} />
            Filters
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Customer Name</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Email</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Phone</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Total Orders</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Total Spent</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Join Date</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB]">
                  <td className="py-4 px-6">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1E40AF] flex items-center justify-center text-white">
                        {customer.name.charAt(0)}
                      </div>
                      <span className="text-sm text-[#1F2937]">{customer.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-[#6B7280]">{customer.email}</td>
                  <td className="py-4 px-6 text-sm text-[#6B7280]">{customer.phone}</td>
                  <td className="py-4 px-6 text-sm text-[#1F2937]">{customer.totalOrders}</td>
                  <td className="py-4 px-6 text-sm text-[#1F2937]">
                    ৳ {customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-sm text-[#6B7280]">{customer.joinDate}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-[#E5E7EB] rounded-lg transition-colors">
                        <Eye size={16} className="text-[#6B7280]" />
                      </button>
                      <button className="p-2 hover:bg-[#E5E7EB] rounded-lg transition-colors">
                        <Edit size={16} className="text-[#6B7280]" />
                      </button>
                      <button className="p-2 hover:bg-[#FEE2E2] rounded-lg transition-colors">
                        <Trash2 size={16} className="text-[#DC2626]" />
                      </button>
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
            Showing {filteredCustomers.length} of {customers.length} customers
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
