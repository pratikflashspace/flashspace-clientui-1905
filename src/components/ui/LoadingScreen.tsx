import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FDFDFD]/90 backdrop-blur-xl">
      <div className="flex flex-col items-center gap-6">
        {/* Premium Spinner */}
        <div className="relative w-20 h-20">
          {/* Inner ring */}
          <div className="absolute inset-0 border-[3px] border-[#2D3F33]/10 rounded-full"></div>
          {/* Outer animated ring */}
          <div className="absolute inset-0 border-[3px] border-t-[#2D3F33] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin duration-700"></div>
          {/* Secondary ring for complexity */}
          <div className="absolute inset-2 border-[2px] border-b-[#EDB003] border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-reverse duration-1000"></div>
        </div>
        
        {/* Brand Label */}
        <div className="flex flex-col items-center">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#2D3F33] tracking-tighter uppercase">Flash</span>
            <span className="text-xl font-medium text-[#2D3F33]/60 lowercase italic">space</span>
          </div>
          <div className="h-1 w-24 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-[#2D3F33] w-1/2 animate-loading-progress rounded-full"></div>
          </div>
        </div>

        <style>{`
          @keyframes spin-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          .animate-spin-reverse {
            animation: spin-reverse 1.5s linear infinite;
          }
          @keyframes loading-progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
          .animate-loading-progress {
            animation: loading-progress 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default LoadingScreen;
