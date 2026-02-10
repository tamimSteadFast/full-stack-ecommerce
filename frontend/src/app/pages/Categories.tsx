import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

const categories = [
  { id: '1', name: 'Electronics', products: 245, description: 'Electronic devices and gadgets' },
  { id: '2', name: 'Apparel', products: 432, description: 'Clothing and fashion items' },
  { id: '3', name: 'Footwear', products: 187, description: 'Shoes and sandals' },
  { id: '4', name: 'Accessories', products: 156, description: 'Fashion accessories' },
  { id: '5', name: 'Home & Living', products: 89, description: 'Home decor and furniture' }
];

export function Categories() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#1F2937] mb-1">Categories</h1>
          <p className="text-sm text-[#6B7280]">Organize your products into categories</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E40AF]/90">
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg p-6 shadow-sm border border-[#E5E7EB]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg text-[#1F2937] mb-1">{category.name}</h3>
                <p className="text-sm text-[#6B7280]">{category.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-[#F9FAFB] rounded-lg">
                  <Edit size={16} className="text-[#6B7280]" />
                </button>
                <button className="p-2 hover:bg-[#FEE2E2] rounded-lg">
                  <Trash2 size={16} className="text-[#DC2626]" />
                </button>
              </div>
            </div>
            <div className="pt-4 border-t border-[#E5E7EB]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Total Products</span>
                <span className="text-lg text-[#1F2937]">{category.products}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
