import apiClient from '../api/client';

export interface Price {
  id: number;
  amount: string;
  currency: string;
}

export interface Inventory {
  id: number;
  quantity: number;
}

export interface ProductAttribute {
  id?: number;
  name: string;
  value: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  prices: Price[];
  inventory: Inventory[];
  attributes?: ProductAttribute[];
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  brand?: string;
  category?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateProductVariant {
  sku: string;
  price: number;
  stock: number;
  attributes?: { name: string; value: string }[];
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  brand?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  variants?: CreateProductVariant[];
}

export const productService = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; brand?: string }) => {
    const response = await apiClient.get<ProductsResponse>('/products', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductPayload) => {
    const response = await apiClient.post<{ message: string }>('/products', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Product>) => {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/products/${id}`);
  }
};
