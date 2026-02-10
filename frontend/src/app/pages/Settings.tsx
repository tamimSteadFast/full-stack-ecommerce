import React, { useState } from 'react';
import { Save, Upload } from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General Settings' },
    { id: 'payment', label: 'Payment Settings' },
    { id: 'shipping', label: 'Shipping Settings' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'users', label: 'User Management' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl text-[#1F2937] mb-1">Settings</h1>
        <p className="text-sm text-[#6B7280]">Manage your store settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E5E7EB]">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#1E40AF] text-[#1E40AF]'
                  : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E5E7EB] space-y-6">
          <div>
            <h3 className="text-lg text-[#1F2937] mb-4">Store Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#1F2937] mb-2">Store Name</label>
                <input
                  type="text"
                  defaultValue="My E-commerce Store"
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                />
              </div>
              
              <div>
                <label className="block text-sm text-[#1F2937] mb-2">Store Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-[#F9FAFB] rounded-lg flex items-center justify-center border border-[#E5E7EB]">
                    <span className="text-2xl text-[#6B7280]">📦</span>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB]">
                    <Upload size={16} />
                    Upload Logo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="admin@shop.com"
                    className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Phone</label>
                  <input
                    type="tel"
                    defaultValue="+880 1712-345678"
                    className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#1F2937] mb-2">Address</label>
                <textarea
                  rows={3}
                  defaultValue="123 Business Street, Dhaka 1000, Bangladesh"
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Currency</label>
                  <select className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]">
                    <option>BDT (৳)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Time Zone</label>
                  <select className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]">
                    <option>Asia/Dhaka (GMT+6)</option>
                    <option>UTC</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E5E7EB]">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E40AF]/90">
              <Save size={20} />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Payment Settings */}
      {activeTab === 'payment' && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E5E7EB] space-y-6">
          <div>
            <h3 className="text-lg text-[#1F2937] mb-4">Payment Methods</h3>
            <div className="space-y-4">
              {['bKash', 'Nagad', 'Credit/Debit Card', 'Cash on Delivery'].map((method) => (
                <div key={method} className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-lg">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-[#1F2937]">{method}</span>
                  </div>
                  <button className="text-sm text-[#1E40AF] hover:underline">Configure</button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E5E7EB]">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E40AF]/90">
              <Save size={20} />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Shipping Settings */}
      {activeTab === 'shipping' && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E5E7EB] space-y-6">
          <div>
            <h3 className="text-lg text-[#1F2937] mb-4">Shipping Carriers</h3>
            <div className="space-y-4">
              {['Sundarban Courier', 'SA Paribahan', 'Pathao', 'RedX'].map((carrier) => (
                <div key={carrier} className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-lg">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-[#1F2937]">{carrier}</span>
                  </div>
                  <button className="text-sm text-[#1E40AF] hover:underline">Configure</button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg text-[#1F2937] mb-4">Shipping Zones</h3>
            <div className="space-y-2">
              <div className="p-4 border border-[#E5E7EB] rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-[#1F2937]">Dhaka City</div>
                    <div className="text-xs text-[#6B7280]">Shipping Rate: ৳ 60</div>
                  </div>
                  <button className="text-sm text-[#1E40AF] hover:underline">Edit</button>
                </div>
              </div>
              <div className="p-4 border border-[#E5E7EB] rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-[#1F2937]">Outside Dhaka</div>
                    <div className="text-xs text-[#6B7280]">Shipping Rate: ৳ 120</div>
                  </div>
                  <button className="text-sm text-[#1E40AF] hover:underline">Edit</button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E5E7EB]">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E40AF]/90">
              <Save size={20} />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E5E7EB] space-y-6">
          <div>
            <h3 className="text-lg text-[#1F2937] mb-4">Email Notifications</h3>
            <div className="space-y-3">
              {[
                'New order placed',
                'Order status updated',
                'Low stock alert',
                'New customer registration',
                'Payment received'
              ].map((notification) => (
                <div key={notification} className="flex items-center justify-between">
                  <span className="text-sm text-[#1F2937]">{notification}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1E40AF] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E40AF]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E5E7EB]">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E40AF]/90">
              <Save size={20} />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* User Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E5E7EB] space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-[#1F2937]">Admin Users</h3>
            <button className="px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1E40AF]/90 text-sm">
              Add New Admin
            </button>
          </div>
          
          <div className="space-y-2">
            {[
              { name: 'Admin User', email: 'admin@shop.com', role: 'Super Admin' },
              { name: 'Manager User', email: 'manager@shop.com', role: 'Manager' }
            ].map((user, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1E40AF] flex items-center justify-center text-white">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm text-[#1F2937]">{user.name}</div>
                    <div className="text-xs text-[#6B7280]">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#F9FAFB] text-xs text-[#6B7280] rounded-full">{user.role}</span>
                  <button className="text-sm text-[#1E40AF] hover:underline">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
