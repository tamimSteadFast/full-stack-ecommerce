import React, { useState } from 'react';
import { Search, Filter, Truck, Edit } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { mockShipments } from '../data/mockData';

export function Shipments() {
  const [shipments] = useState(mockShipments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#1F2937] mb-1">Shipments</h1>
          <p className="text-sm text-[#6B7280]">Track and manage order shipments</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E40AF]/90">
          <Truck size={20} />
          Add Shipment
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
              placeholder="Search by tracking number, order ID, or customer..."
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
              <option value="in-transit">In Transit</option>
              <option value="delivered">Delivered</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
              <Filter size={20} />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Tracking Number</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Order ID</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Customer</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Carrier</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Status</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Shipped Date</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id} className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB]">
                  <td className="py-4 px-6 text-sm text-[#1F2937]">{shipment.trackingNumber}</td>
                  <td className="py-4 px-6 text-sm text-[#1E40AF]">{shipment.orderId}</td>
                  <td className="py-4 px-6 text-sm text-[#1F2937]">{shipment.customer}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-[#6B7280]" />
                      <span className="text-sm text-[#1F2937]">{shipment.carrier}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={shipment.status} />
                  </td>
                  <td className="py-4 px-6 text-sm text-[#6B7280]">{shipment.shippedDate}</td>
                  <td className="py-4 px-6">
                    <button className="flex items-center gap-2 px-3 py-1 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] text-sm">
                      <Edit size={14} />
                      Update
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
            Showing {filteredShipments.length} of {shipments.length} shipments
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
