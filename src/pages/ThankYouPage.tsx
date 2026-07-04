import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Update progress bar smoothly over 5 seconds
    // Update progress bar smoothly over 10 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + (100 / (10000 / 50));
      });
    }, 50);

    // Redirect to home after 10 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-[#FAF9F6]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Dynamic Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#36503F]/10 blur-[100px] animate-pulse duration-1000"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#FEF8C5]/60 blur-[120px] animate-pulse" style={{ animationDuration: '3s' }}></div>
      <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-[#10B981]/10 blur-[80px]"></div>

      {/* Main Glassmorphism Card */}
      <div 
        className="relative z-10 bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-14 max-w-xl w-full text-center border border-white shadow-[0_40px_80px_-20px_rgba(54,80,63,0.15)] transform transition-all duration-700 hover:scale-[1.01]"
      >
        {/* Floating 3D-like Icon */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#36503F] to-[#25362B] rounded-3xl shadow-2xl shadow-[#36503F]/40 transition-all duration-500 hover:scale-110 cursor-default">
            <CheckCircle2 className="w-12 h-12 text-[#FEF8C5] transition-transform duration-500" />
          </div>
        </div>
        
        <div className="mt-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F2E26] mb-5 tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
            You're All Set!
          </h1>
          
          <p className="text-gray-600 mb-10 leading-relaxed text-lg font-medium">
            Thank you for choosing us. Our team is already on it and will connect with you shortly with our premium solutions.
          </p>

          <div className="flex flex-col items-center gap-6">
            {/* Smooth Progress Bar */}
            <div className="w-full bg-gray-200/50 rounded-full h-2 overflow-hidden backdrop-blur-sm">
              <div 
                className="h-full bg-gradient-to-r from-[#36503F] to-[#10B981] transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <p className="text-sm text-gray-500 font-bold tracking-wide uppercase animate-pulse">Redirecting to homepage...</p>

            {/* Premium Interactive Button */}
            <button
              onClick={() => navigate("/")}
              className="group relative w-full flex items-center justify-center gap-3 bg-[#36503F] overflow-hidden text-[#FEF8C5] px-6 py-4 rounded-2xl font-bold hover:bg-[#25362B] transition-all duration-300 active:scale-[0.98] shadow-xl shadow-[#36503F]/20 mt-4"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              <span className="relative z-10 text-base">Return to Homepage</span> 
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
