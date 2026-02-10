import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Tag,
  ClipboardList,
  Users,
  Layers,
  CreditCard,
  Truck,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Search,
  Bell
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'Products', path: '/products' },
  { icon: Tag, label: 'Categories', path: '/categories' },
  { icon: ClipboardList, label: 'Orders', path: '/orders' },
  { icon: Users, label: 'Customers', path: '/customers' },
  { icon: Layers, label: 'Inventory', path: '/inventory' },
  { icon: CreditCard, label: 'Payments', path: '/payments' },
  { icon: Truck, label: 'Shipments', path: '/shipments' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' }
];

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-[#E5E7EB] transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-60' : 'w-20'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#E5E7EB]">
          {sidebarOpen && (
            <h1 className="text-xl text-[#1E40AF]">
              ShopAdmin
            </h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:block p-2 hover:bg-[#F9FAFB] rounded-lg"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#1E40AF] text-white'
                    : 'text-[#6B7280] hover:bg-[#F9FAFB]'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        {sidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F9FAFB] cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-[#1E40AF] flex items-center justify-center text-white">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm text-[#1F2937] truncate">{user?.name || 'User'}</div>
                <div className="text-xs text-[#6B7280] truncate">{user?.email || 'user@example.com'}</div>
              </div>
              <button 
                onClick={logout}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'md:ml-60' : 'md:ml-20'
        }`}
      >
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white border-b border-[#E5E7EB] px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-[#F9FAFB] rounded-lg"
            >
              <Menu size={20} />
            </button>
            
            <div className="relative flex-1 max-w-md">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
              />
              <input
                type="text"
                placeholder="Search products, orders, customers..."
                className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-[#F9FAFB] rounded-lg">
              <Bell size={20} className="text-[#6B7280]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#DC2626] rounded-full" />
            </button>

            <div className="w-10 h-10 rounded-full bg-[#1E40AF] flex items-center justify-center text-white cursor-pointer">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
