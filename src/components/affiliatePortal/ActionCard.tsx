import React from 'react';

interface ActionCardProps {
    title: string;
    description: string;
    badge?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, badge }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between group cursor-default">
        <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#5aa39c] transition-colors">
                {title}
            </h3>
            {badge && (
                <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-semibold text-gray-600 border border-gray-200 uppercase tracking-wider">
                    {badge}
                </span>
            )}
        </div>
        <div className="text-sm text-gray-500 leading-relaxed">{description}</div>
    </div>
);

export default ActionCard;
