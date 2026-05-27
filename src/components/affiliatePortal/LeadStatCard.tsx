import React from 'react';

interface LeadStatCardProps {
  label: string;
  value: string | number;
  highlightColor?: string;
}

const LeadStatCard = ({ label, value, highlightColor = "text-gray-900" }: LeadStatCardProps) => (
  <div className="bg-white border border-[#D4E0D0] rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 transition-all hover:shadow-lg flex flex-col justify-center min-h-[120px]">
    <p className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight mb-1">
      <span className={highlightColor}>{value}</span>
    </p>
    <p className="text-sm text-[#6B8F78] font-medium">{label}</p>
  </div>
);

export default LeadStatCard;
