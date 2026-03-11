import React from 'react';

interface ActionCardProps {
    title: string;
    description: string;
    badge?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, badge }) => (
    <div className="bg-[#f7f7f7] p-7 rounded-2xl border border-gray-200 shadow transition-all duration-300 h-full flex flex-col group cursor-pointer">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-[#1a2d1d] text-[15px] group-hover:text-[#334d3d] transition-colors leading-tight">
                {title}
            </h3>
            {badge && (
                <span className="px-2 py-0.5 bg-[#fefce8] rounded text-[10px] font-bold text-[#854d0e] border border-[#fef08a] uppercase tracking-wider">
                    {badge}
                </span>
            )}
        </div>
        <div className="text-[13px] text-[#64748b] font-medium leading-[1.6]">
            {description}
        </div>
    </div>
);

export default ActionCard;
