import React from 'react';

interface LeadStatCardProps {
  label: string;
  value: string | number;
  highlightColor?: string;
}

const LeadStatCard = ({ label, value, highlightColor = "text-gray-900" }: LeadStatCardProps) => (
  <div className="bg-[#f8f8f8] p-6 rounded-2xl border border-gray-200 shadow transition-all duration-300 flex flex-col justify-center min-h-[120px]">
    <p className="text-4xl font-bold mb-1 transition-all group-hover:scale-105">
      <span className={highlightColor}>{value}</span>
    </p>
    <p className="text-sm text-gray-400 font-medium">{label}</p>
  </div>
);

export default LeadStatCard;