import React, { useState } from "react";
import { IndianRupee } from "lucide-react";

export default function EMICalculator() {
  const [principal, setPrincipal] = useState<string>("1000000");
  const [rate, setRate] = useState<string>("8.5");
  const [tenureYears, setTenureYears] = useState<string>("10");

  const calculateEMI = () => {
    const p = parseFloat(principal) || 0;
    const r = parseFloat(rate) || 0;
    const t = parseFloat(tenureYears) || 0;

    if (p <= 0 || r <= 0 || t <= 0) return { emi: 0, totalInterest: 0, totalPayment: 0 };

    const rMonthly = r / (12 * 100);
    const nMonths = t * 12;

    const emi = (p * rMonthly * Math.pow(1 + rMonthly, nMonths)) / (Math.pow(1 + rMonthly, nMonths) - 1);
    const totalPayment = emi * nMonths;
    const totalInterest = totalPayment - p;

    return { emi, totalInterest, totalPayment };
  };

  const results = calculateEMI();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E8E2D9] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 md:p-12 bg-white">
          <h2 className="text-2xl font-bold text-[#36503F] mb-8">EMI Calculator</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Amount (Principal)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupee className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className="pl-10 block w-full py-3 border border-gray-300 rounded-lg focus:ring-[#36503F] focus:border-[#36503F] sm:text-sm bg-gray-50 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Rate (% per annum)
              </label>
              <input
                type="number"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-[#36503F] focus:border-[#36503F] sm:text-sm bg-gray-50 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Tenure (Years)
              </label>
              <input
                type="number"
                value={tenureYears}
                onChange={(e) => setTenureYears(e.target.value)}
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-[#36503F] focus:border-[#36503F] sm:text-sm bg-gray-50 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#F0F4EE] p-8 md:p-12 flex flex-col justify-center border-l border-[#E8E2D9]">
          <h3 className="text-sm font-bold text-[#36503F] tracking-widest uppercase mb-8">
            Repayment Summary
          </h3>
          
          <div className="space-y-6 flex-grow">
            <div className="flex justify-between items-center border-b border-[#D4E0D0] pb-4">
              <span className="text-gray-600 font-medium">Principal Amount</span>
              <span className="text-lg font-semibold text-[#1F2E26]">
                ₹ {Math.round(parseFloat(principal) || 0).toLocaleString("en-IN")}
              </span>
            </div>
            
            <div className="flex justify-between items-center border-b border-[#D4E0D0] pb-4">
              <span className="text-gray-600 font-medium">Total Interest</span>
              <span className="text-lg font-semibold text-[#1F2E26]">
                ₹ {Math.round(results.totalInterest).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-[#D4E0D0] pb-4">
              <span className="text-gray-600 font-medium">Total Amount Payable</span>
              <span className="text-lg font-semibold text-[#1F2E26]">
                ₹ {Math.round(results.totalPayment).toLocaleString("en-IN")}
              </span>
            </div>
            
            <div className="pt-4">
              <span className="block text-sm font-bold text-gray-500 mb-1">Monthly EMI</span>
              <span className="text-4xl md:text-5xl font-bold text-[#36503F]">
                ₹ {Math.round(results.emi).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
