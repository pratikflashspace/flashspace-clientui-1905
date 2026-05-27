import React from 'react';

interface ActionCardProps {
    title: string;
    description: string;
    badge?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, badge }) => (
    <div className="bg-white border border-[#D4E0D0] rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-5 hover:border-[#36503F]/60 hover:shadow-md transition-all group relative h-full flex flex-col cursor-pointer">
        <div className="flex justify-between items-start mb-2">
            <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold text-[#1A1A1A] leading-tight">
                {title}
            </h3>
            {badge && (
                <span className="px-2.5 py-0.5 bg-[#F0F4EE] rounded-full text-xs font-semibold text-[#36503F] border border-[#D4E0D0]">
                    {badge}
                </span>
            )}
        </div>
        <div className="text-sm font-medium text-[#6B8F78]">
            {description}
        </div>
    </div>
);

export default ActionCard;
