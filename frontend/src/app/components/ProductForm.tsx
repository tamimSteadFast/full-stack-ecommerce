import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Wand2 } from 'lucide-react';
import { CreateProductPayload, CreateProductVariant } from '../../services/productService';

interface ProductFormProps {
  onSubmit: (data: CreateProductPayload) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface Attribute {
  id: string;
  name: string;
  values: string[];
  currentValue: string; // Temporary input for adding values
}

export const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, onCancel, isLoading }) => {
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    brand: '',
    description: '',
  });

  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [variations, setVariations] = useState<CreateProductVariant[]>([]);

  // Add a new attribute definition (e.g., "Color")
  const addAttribute = () => {
    setAttributes([
      ...attributes,
      { id: Date.now().toString(), name: '', values: [], currentValue: '' }
    ]);
  };

  // Remove an attribute definition
  const removeAttribute = (id: string) => {
    setAttributes(attributes.filter(attr => attr.id !== id));
  };

  // Update attribute name
  const updateAttributeName = (id: string, name: string) => {
    setAttributes(attributes.map(attr => 
      attr.id === id ? { ...attr, name } : attr
    ));
  };

  // Add a value to an attribute (e.g., "Red" to "Color")
  const addAttributeValue = (id: string) => {
    setAttributes(attributes.map(attr => {
      if (attr.id === id && attr.currentValue.trim()) {
        return {
          ...attr,
          values: [...attr.values, attr.currentValue.trim()],
          currentValue: ''
        };
      }
      return attr;
    }));
  };

  // Remove a value from an attribute
  const removeAttributeValue = (attrId: string, valueIdx: number) => {
    setAttributes(attributes.map(attr => {
      if (attr.id === attrId) {
        return {
          ...attr,
          values: attr.values.filter((_, idx) => idx !== valueIdx)
        };
      }
      return attr;
    }));
  };

  // Generate variations based on attributes
  const generateVariations = () => {
    if (attributes.length === 0) return;

    // Filter out attributes with no values
    const validAttributes = attributes.filter(attr => attr.values.length > 0 && attr.name);
    
    if (validAttributes.length === 0) return;

    // Helper to generate cartesian product
    const cartesian = (args: string[][]): string[][] => {
      const r: string[][] = [];
      const max = args.length - 1;
      function helper(arr: string[], i: number) {
        for (let j = 0, l = args[i].length; j < l; j++) {
          const a = arr.slice(0);
          a.push(args[i][j]);
          if (i === max) r.push(a);
          else helper(a, i + 1);
        }
      }
      helper([], 0);
      return r;
    };

    const combinations = cartesian(validAttributes.map(attr => attr.values));

    const newVariations: CreateProductVariant[] = combinations.map(combo => {
      const variantAttributes = validAttributes.map((attr, idx) => ({
        name: attr.name,
        value: combo[idx]
      }));

      // Generate a basic SKU
      const skuSuffix = combo.join('-').toUpperCase().replace(/[^A-Z0-9-]/g, '');
      const sku = `${basicInfo.name.substring(0, 3).toUpperCase()}-${skuSuffix}`;

      return {
        sku,
        price: 0,
        stock: 0,
        attributes: variantAttributes
      };
    });

    setVariations(newVariations);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...basicInfo,
      status: 'ACTIVE',
      variants: variations.length > 0 ? variations : undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              required
              value={basicInfo.name}
              onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="e.g., Classic T-Shirt"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input
              type="text"
              value={basicInfo.brand}
              onChange={(e) => setBasicInfo({ ...basicInfo, brand: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="e.g., Nike"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            rows={3}
            value={basicInfo.description}
            onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Product description..."
          />
        </div>
      </div>

      {/* Attributes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-medium text-gray-900">Attributes & Variations</h3>
          <button
            type="button"
            onClick={addAttribute}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus size={16} />
            Add Attribute
          </button>
        </div>

        {attributes.length === 0 && (
          <p className="text-sm text-gray-500 italic">No attributes added. Add attributes (e.g., Color, Size) to generate variations.</p>
        )}

        {attributes.map((attr) => (
          <div key={attr.id} className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={attr.name}
                onChange={(e) => updateAttributeName(attr.id, e.target.value)}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Attribute Name (e.g., Color)"
              />
              <button
                type="button"
                onClick={() => removeAttribute(attr.id)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {attr.values.map((val, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {val}
                  <button
                    type="button"
                    onClick={() => removeAttributeValue(attr.id, idx)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={attr.currentValue}
                  onChange={(e) => {
                    const newAttrs = [...attributes];
                    const current = newAttrs.find(a => a.id === attr.id);
                    if (current) current.currentValue = e.target.value;
                    setAttributes(newAttrs);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addAttributeValue(attr.id);
                    }
                  }}
                  className="w-32 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Value"
                />
                <button
                  type="button"
                  onClick={() => addAttributeValue(attr.id)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {attributes.length > 0 && (
          <button
            type="button"
            onClick={generateVariations}
            className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 font-medium transition-colors"
          >
            <Wand2 size={18} />
            Generate Variations
          </button>
        )}
      </div>

      {/* Generated Variations Table */}
      {variations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Variations ({variations.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-2 rounded-tl-lg">Attributes</th>
                  <th className="px-4 py-2">SKU</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2 rounded-tr-lg">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {variations.map((variant, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2">
                      {variant.attributes?.map(a => `${a.name}: ${a.value}`).join(', ')}
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) => {
                          const newVars = [...variations];
                          newVars[idx].sku = e.target.value;
                          setVariations(newVars);
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) => {
                          const newVars = [...variations];
                          newVars[idx].price = parseFloat(e.target.value) || 0;
                          setVariations(newVars);
                        }}
                        className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => {
                          const newVars = [...variations];
                          newVars[idx].stock = parseInt(e.target.value) || 0;
                          setVariations(newVars);
                        }}
                        className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating Product...' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};
