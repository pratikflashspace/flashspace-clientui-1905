import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FDFDFD]/90 backdrop-blur-xl">
      <div className="flex flex-col items-center gap-6">
        {/* Premium Spinner */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Background ring */}
          <div className="absolute inset-0 border-[3px] border-[#2D3F33]/10 rounded-full"></div>
          {/* Outer animated ring */}
          <div className="absolute inset-0 border-[3px] border-t-[#2D3F33] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin duration-700"></div>
          
          {/* Static Favicon */}
          <img src="/favicon.png" alt="Loading..." className="w-9 h-9" />
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
