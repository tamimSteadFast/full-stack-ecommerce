import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { productService, Product, ProductVariant, CreateProductPayload } from '../../services/productService';
import { Modal } from '../components/ui/Modal';
import { ProductForm } from '../components/ProductForm';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    loadProducts();
  }, [pagination.page, searchTerm]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm
      });
      setProducts(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      }));
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (data: CreateProductPayload) => {
    try {
      await productService.create(data);
      setShowAddModal(false);
      loadProducts();
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Failed to create product. Please try again.');
    }
  };

  const getProductPrice = (product: Product) => {
    if (product.variants && product.variants.length > 0 && product.variants[0].prices && product.variants[0].prices.length > 0) {
      return parseFloat(product.variants[0].prices[0].amount);
    }
    return 0;
  };

  const getProductStock = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((total: number, variant: ProductVariant) => {
        const variantStock = variant.inventory && variant.inventory.length > 0 ? variant.inventory[0].quantity : 0;
        return total + variantStock;
      }, 0);
    }
    return 0;
  };

  const getProductSku = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.length > 1 ? 'Multiple' : product.variants[0].sku;
    }
    return 'N/A';
  };

  // Client-side filtering for category if needed, but better to do server-side
  // For now, we'll just show what we have.
  
  // Helper to safely get status string
  const getStatus = (status: string) => {
    return status.toLowerCase() as 'active' | 'inactive';
  };

  const categories = ['all', 'Electronics', 'Apparel', 'Accessories', 'Footwear']; // Hardcoded for now as backend doesn't list categories yet

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#1F2937] mb-1">Products</h1>
          <p className="text-sm text-[#6B7280]">Manage your product inventory</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E40AF]/90 transition-colors"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-[#E5E7EB]">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
            />
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
              <Filter size={20} />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Product</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">SKU</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Category</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Brand</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Price</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Stock</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Status</th>
                <th className="text-left py-4 px-6 text-sm text-[#6B7280]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#6B7280]">Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#6B7280]">No products found</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB]">
                    <td className="py-4 px-6">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                           {/* Placeholder for image since backend doesn't have it yet */}
                           <div className="text-xs">No Img</div>
                        </div>
                        <span className="text-sm text-[#1F2937]">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-[#6B7280]">{getProductSku(product)}</td>
                    <td className="py-4 px-6 text-sm text-[#6B7280]">{product.category || 'N/A'}</td>
                    <td className="py-4 px-6 text-sm text-[#6B7280]">{product.brand || 'N/A'}</td>
                    <td className="py-4 px-6 text-sm text-[#1F2937]">৳ {getProductPrice(product).toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-sm ${
                          getProductStock(product) === 0
                            ? 'text-[#DC2626]'
                            : getProductStock(product) < 50
                            ? 'text-[#F59E0B]'
                            : 'text-[#059669]'
                        }`}
                      >
                        {getProductStock(product)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={getStatus(product.status)} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-[#E5E7EB] rounded-lg transition-colors">
                          <Edit size={16} className="text-[#6B7280]" />
                        </button>
                        <button className="p-2 hover:bg-[#FEE2E2] rounded-lg transition-colors">
                          <Trash2 size={16} className="text-[#DC2626]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB]">
          <div className="text-sm text-[#6B7280]">
            Showing {products.length} of {pagination.total} products
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
              className="px-3 py-1 border border-[#E5E7EB] rounded-lg text-sm text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-[#1E40AF] text-white rounded-lg text-sm">{pagination.page}</span>
            <button 
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1 border border-[#E5E7EB] rounded-lg text-sm text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>


      {/* Add Product Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
        size="2xl"
      >
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </div>
  );
}
