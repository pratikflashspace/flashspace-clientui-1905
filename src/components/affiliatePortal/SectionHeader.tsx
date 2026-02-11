import React from 'react';
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
    icon: LucideIcon;
    title: string;
    subtitle: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-start gap-4 mb-6 pt-8 border-t border-gray-100/50">
        <div className="p-3 bg-[#eaf4f3] rounded-xl text-[#5aa39c]">
            <Icon size={24} strokeWidth={2.5} />
        </div>
        <div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
    </div>
);

export default SectionHeader;
