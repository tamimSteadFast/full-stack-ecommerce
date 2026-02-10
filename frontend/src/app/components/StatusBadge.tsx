import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  // Auto-detect type based on status if not provided
  const getType = () => {
    if (type) return type;
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('success') || statusLower.includes('paid') || 
        statusLower.includes('delivered') || statusLower.includes('active') ||
        statusLower.includes('in-stock')) {
      return 'success';
    }
    if (statusLower.includes('pending') || statusLower.includes('processing') || 
        statusLower.includes('low-stock')) {
      return 'warning';
    }
    if (statusLower.includes('failed') || statusLower.includes('error') || 
        statusLower.includes('out-of-stock') || statusLower.includes('inactive')) {
      return 'error';
    }
    if (statusLower.includes('shipped') || statusLower.includes('in-transit')) {
      return 'info';
    }
    return 'neutral';
  };

  const badgeType = getType();

  const typeClasses = {
    success: 'bg-[#059669]/10 text-[#059669] border-[#059669]/20',
    warning: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
    error: 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20',
    info: 'bg-[#1E40AF]/10 text-[#1E40AF] border-[#1E40AF]/20',
    neutral: 'bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20'
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs border ${typeClasses[badgeType]}`}
    >
      {status}
    </span>
  );
}
