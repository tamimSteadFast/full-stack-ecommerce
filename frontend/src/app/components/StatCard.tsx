import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'amber' | 'purple';
}

export function StatCard({ title, value, change, icon: Icon, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-[#1E40AF]/10 text-[#1E40AF]',
    green: 'bg-[#059669]/10 text-[#059669]',
    amber: 'bg-[#F59E0B]/10 text-[#F59E0B]',
    purple: 'bg-[#7C3AED]/10 text-[#7C3AED]'
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E5E7EB]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#6B7280] mb-1">{title}</p>
          <h3 className="text-2xl text-[#1F2937] mb-2">{value}</h3>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {change >= 0 ? (
                <TrendingUp size={16} className="text-[#059669]" />
              ) : (
                <TrendingDown size={16} className="text-[#DC2626]" />
              )}
              <span
                className={`text-sm ${
                  change >= 0 ? 'text-[#059669]' : 'text-[#DC2626]'
                }`}
              >
                {Math.abs(change)}%
              </span>
              <span className="text-sm text-[#6B7280]">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
