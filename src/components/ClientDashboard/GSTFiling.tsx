import React from "react";
import { Clock } from "lucide-react";

const GSTFiling: React.FC = () => {
  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-[1400px] mx-auto min-h-[85vh] flex flex-col">
        <div className="text-left mb-8">
          <h1 className="text-[30px] font-extrabold tracking-tight mb-4">
            <span className="text-black">GST</span> <span className="text-[#36503F]">Filing</span>
          </h1>
          <p className="text-[#6B7280] text-[16px] max-w-xl">
            Manage and file your GST returns seamlessly from your dashboard.
          </p>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center pb-20">
          <div className="w-20 h-20 flex items-center justify-center mb-6">
            <Clock className="w-10 h-10 text-[#35503F]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Coming Soon!</h2>
        </div>
      </div>
    </div>
  );
};

export default GSTFiling;
