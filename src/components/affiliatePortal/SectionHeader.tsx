import React from 'react';
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
    icon: LucideIcon;
    title: string;
    subtitle: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center gap-4 mb-6 pt-10 border-t border-gray-100/80">
        <div className="w-12 h-12 flex items-center justify-center bg-[#f1f5f9] rounded-full text-[#334D3D]">
            <Icon size={22} strokeWidth={2} />
        </div>
        <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-[#1a2d1d] tracking-tight">{title}</h2>
            <p className="text-sm text-[#64748b] font-medium">{subtitle}</p>
        </div>
    </div>
);

export default SectionHeader;
