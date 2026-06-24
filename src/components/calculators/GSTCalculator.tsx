import React, { useState } from "react";
import { IndianRupee } from "lucide-react";

export default function GSTCalculator() {
  const [amount, setAmount] = useState<string>("10000");
  const [rate, setRate] = useState<number>(18);
  const [type, setType] = useState<"exclusive" | "inclusive">("exclusive");

  const calculateGST = () => {
    const principal = parseFloat(amount) || 0;
    
    if (type === "exclusive") {
      const gstAmount = (principal * rate) / 100;
      const totalAmount = principal + gstAmount;
      return { principal, gstAmount, totalAmount };
    } else {
      const gstAmount = principal - (principal * (100 / (100 + rate)));
      const baseAmount = principal - gstAmount;
      return { principal: baseAmount, gstAmount, totalAmount: principal };
    }
  };

  const results = calculateGST();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E8E2D9] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Input Section */}
        <div className="p-8 md:p-12 bg-white">
          <h2 className="text-2xl font-bold text-[#36503F] mb-8">GST Calculator</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupee className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10 block w-full py-3 border border-gray-300 rounded-lg focus:ring-[#36503F] focus:border-[#36503F] sm:text-sm bg-gray-50 outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tax Slab (%)
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[5, 12, 18, 28].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRate(r)}
                    className={`py-2 px-3 text-sm font-semibold rounded-lg border transition-all ${
                      rate === r
                        ? "bg-[#36503F] border-[#36503F] text-[#FEF8CF]"
                        : "bg-white border-gray-300 text-gray-600 hover:border-[#36503F]"
                    }`}
                  >
                    {r}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tax Type
              </label>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setType("exclusive")}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    type === "exclusive"
                      ? "bg-white text-[#36503F] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  GST Exclusive
                </button>
                <button
                  onClick={() => setType("inclusive")}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    type === "inclusive"
                      ? "bg-white text-[#36503F] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  GST Inclusive
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-[#F0F4EE] p-8 md:p-12 flex flex-col justify-center border-l border-[#E8E2D9]">
          <h3 className="text-sm font-bold text-[#36503F] tracking-widest uppercase mb-8">
            Calculation Results
          </h3>
          
          <div className="space-y-6 flex-grow">
            <div className="flex justify-between items-center border-b border-[#D4E0D0] pb-4">
              <span className="text-gray-600 font-medium">Base Amount</span>
              <span className="text-lg font-semibold text-[#1F2E26]">
                ₹ {results.principal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="flex justify-between items-center border-b border-[#D4E0D0] pb-4">
              <span className="text-gray-600 font-medium">Total GST ({rate}%)</span>
              <span className="text-lg font-semibold text-[#1F2E26]">
                ₹ {results.gstAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="pt-4">
              <span className="block text-sm font-bold text-gray-500 mb-1">Post-Tax Amount</span>
              <span className="text-4xl md:text-5xl font-bold text-[#36503F]">
                ₹ {results.totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
