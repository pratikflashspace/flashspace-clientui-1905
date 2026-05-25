import React from 'react';
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
    icon: LucideIcon;
    title: string;
    subtitle: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center gap-4 mb-6 pt-10 border-t border-[#D4E0D0]">
        <div className="w-12 h-12 flex items-center justify-center bg-[#F0F4EE] rounded-xl text-[#36503F]">
            <Icon className="w-6 h-6" strokeWidth={2} />
        </div>
        <div className="space-y-0.5">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#1A1A1A]">{title}</h2>
            <p className="text-sm font-medium text-[#6B8F78]">{subtitle}</p>
        </div>
    </div>
);

export default SectionHeader;
