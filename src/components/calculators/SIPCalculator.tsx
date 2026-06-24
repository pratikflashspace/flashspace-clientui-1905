import React, { useState } from "react";
import { IndianRupee } from "lucide-react";

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<string>("5000");
  const [expectedReturn, setExpectedReturn] = useState<string>("12");
  const [timePeriod, setTimePeriod] = useState<string>("10");

  const calculateSIP = () => {
    const p = parseFloat(monthlyInvestment) || 0;
    const r = parseFloat(expectedReturn) || 0;
    const n = parseFloat(timePeriod) || 0;

    if (p <= 0 || r <= 0 || n <= 0) return { investedAmount: 0, estimatedReturns: 0, totalValue: 0 };

    const i = r / (12 * 100); // monthly rate of return
    const months = n * 12;

    // SIP Formula: M = P × ({[1 + i]^n - 1} / i) × (1 + i)
    const totalValue = p * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
    const investedAmount = p * months;
    const estimatedReturns = totalValue - investedAmount;

    return { investedAmount, estimatedReturns, totalValue };
  };

  const results = calculateSIP();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E8E2D9] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 md:p-12 bg-white">
          <h2 className="text-2xl font-bold text-[#36503F] mb-8">SIP Calculator</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Investment
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupee className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(e.target.value)}
                  className="pl-10 block w-full py-3 border border-gray-300 rounded-lg focus:ring-[#36503F] focus:border-[#36503F] sm:text-sm bg-gray-50 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Return Rate (p.a %)
              </label>
              <input
                type="number"
                step="0.1"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(e.target.value)}
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-[#36503F] focus:border-[#36503F] sm:text-sm bg-gray-50 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Period (Years)
              </label>
              <input
                type="number"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-[#36503F] focus:border-[#36503F] sm:text-sm bg-gray-50 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#F0F4EE] p-8 md:p-12 flex flex-col justify-center border-l border-[#E8E2D9]">
          <h3 className="text-sm font-bold text-[#36503F] tracking-widest uppercase mb-8">
            Investment Summary
          </h3>
          
          <div className="space-y-6 flex-grow">
            <div className="flex justify-between items-center border-b border-[#D4E0D0] pb-4">
              <span className="text-gray-600 font-medium">Invested Amount</span>
              <span className="text-lg font-semibold text-[#1F2E26]">
                ₹ {Math.round(results.investedAmount).toLocaleString("en-IN")}
              </span>
            </div>
            
            <div className="flex justify-between items-center border-b border-[#D4E0D0] pb-4">
              <span className="text-gray-600 font-medium">Est. Returns</span>
              <span className="text-lg font-semibold text-[#1F2E26]">
                ₹ {Math.round(results.estimatedReturns).toLocaleString("en-IN")}
              </span>
            </div>
            
            <div className="pt-4">
              <span className="block text-sm font-bold text-gray-500 mb-1">Total Value</span>
              <span className="text-4xl md:text-5xl font-bold text-[#36503F]">
                ₹ {Math.round(results.totalValue).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
