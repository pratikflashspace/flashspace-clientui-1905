import React from "react";
import { Wrench } from "lucide-react";

export default function GenericCalculator({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-[#E8E2D9] text-center min-h-[400px] flex flex-col items-center justify-center">
      <div className="w-20 h-20 rounded-full bg-[#F0F4EE] flex items-center justify-center mb-6">
        <Wrench className="w-10 h-10 text-[#36503F]" />
      </div>
      <h2 className="text-2xl font-bold text-[#36503F] mb-4">{title} is Coming Soon</h2>
      <p className="text-gray-500 max-w-md mx-auto">
        We are currently building this calculator. Our financial engineers are hard at work to bring you an accurate and easy-to-use tool very soon!
      </p>
    </div>
  );
}
