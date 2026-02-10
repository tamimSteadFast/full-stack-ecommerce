import React, { useState } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { mockInventory } from '../data/mockData';

export function Inventory() {
  const [inventory] = useState(mockInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStock = (item: any) => {
    setSelectedItem(item);
    setShowUpdateModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl text-[#1F2937] mb-1">Inventory Management</h1>
        <p className="text-sm text-[#6B7280]">Track and manage product stock levels</p>
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
              placeholder="Search by product name or SKU..."
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
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
              <Filter size={20} />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Product Name</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Variant</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">SKU</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Current Stock</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Status</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Last Updated</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.id} className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB]">
                  <td className="py-4 px-6 text-sm text-[#1F2937]">{item.productName}</td>
                  <td className="py-4 px-6 text-sm text-[#6B7280]">{item.variant}</td>
                  <td className="py-4 px-6 text-sm text-[#6B7280]">{item.sku}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-sm ${
                        item.currentStock === 0
                          ? 'text-[#DC2626]'
                          : item.currentStock < 50
                          ? 'text-[#F59E0B]'
                          : 'text-[#059669]'
                      }`}
                    >
                      {item.currentStock}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-4 px-6 text-sm text-[#6B7280]">{item.lastUpdated}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleUpdateStock(item)}
                      className="flex items-center gap-2 px-3 py-1 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E40AF]/90 text-sm"
                    >
                      <RefreshCw size={14} />
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
            Showing {filteredInventory.length} of {inventory.length} items
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

      {/* Update Stock Modal */}
      {showUpdateModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-[#E5E7EB]">
              <h2 className="text-xl text-[#1F2937]">Update Stock</h2>
              <p className="text-sm text-[#6B7280] mt-1">{selectedItem.productName} - {selectedItem.variant}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-[#1F2937] mb-2">Current Stock</label>
                <div className="px-4 py-2 bg-[#F9FAFB] rounded-lg text-lg">
                  {selectedItem.currentStock}
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#1F2937] mb-2">Adjustment</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  placeholder="Enter quantity to add or remove"
                />
              </div>
              <div>
                <label className="block text-sm text-[#1F2937] mb-2">Reason</label>
                <select className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]">
                  <option>Select reason</option>
                  <option>Sale</option>
                  <option>Restock</option>
                  <option>Damage</option>
                  <option>Return</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#1F2937] mb-2">Notes (Optional)</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  placeholder="Add any additional notes"
                />
              </div>
            </div>
            <div className="p-6 border-t border-[#E5E7EB] flex justify-end gap-3">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-[#6B7280] hover:bg-[#F9FAFB]"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E40AF]/90"
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
