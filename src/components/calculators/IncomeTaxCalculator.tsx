import React, { useState } from "react";
import { IndianRupee } from "lucide-react";

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState<string>("1500000");

  const calculateTaxOldRegime = (salary: number) => {
    let tax = 0;
    // Simple mock old regime calculation (excluding deductions for brevity)
    if (salary <= 250000) return 0;
    if (salary <= 500000) tax = (salary - 250000) * 0.05;
    else if (salary <= 1000000) tax = 12500 + (salary - 500000) * 0.2;
    else tax = 112500 + (salary - 1000000) * 0.3;

    // Rebate u/s 87A
    if (salary <= 500000) return 0;
    
    // Cess 4%
    return tax + (tax * 0.04);
  };

  const calculateTaxNewRegime = (salary: number) => {
    // FY 2023-24 New Regime
    let tax = 0;
    if (salary <= 300000) return 0;
    if (salary <= 600000) tax = (salary - 300000) * 0.05;
    else if (salary <= 900000) tax = 15000 + (salary - 600000) * 0.1;
    else if (salary <= 1200000) tax = 45000 + (salary - 900000) * 0.15;
    else if (salary <= 1500000) tax = 90000 + (salary - 1200000) * 0.2;
    else tax = 150000 + (salary - 1500000) * 0.3;

    // Rebate u/s 87A (Income up to 7L is tax-free)
    if (salary <= 700000) return 0;

    // Cess 4%
    return tax + (tax * 0.04);
  };

  const currentIncome = parseFloat(income) || 0;
  const standardDeduction = currentIncome > 50000 ? 50000 : currentIncome;
  
  const taxableIncomeOld = currentIncome - standardDeduction;
  const taxableIncomeNew = currentIncome - standardDeduction; // Std deduction now in new regime too

  const taxOld = calculateTaxOldRegime(taxableIncomeOld);
  const taxNew = calculateTaxNewRegime(taxableIncomeNew);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E8E2D9] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 md:p-12 bg-white">
          <h2 className="text-2xl font-bold text-[#36503F] mb-8">Income Tax Calculator (FY 23-24)</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Annual Income
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupee className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="pl-10 block w-full py-3 border border-gray-300 rounded-lg focus:ring-[#36503F] focus:border-[#36503F] sm:text-sm bg-gray-50 outline-none transition-all"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Assuming Salaried Individual with Standard Deduction of ₹50,000. No other 80C/80D deductions applied for old regime comparison.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#F0F4EE] p-8 md:p-12 flex flex-col justify-center border-l border-[#E8E2D9]">
          <h3 className="text-sm font-bold text-[#36503F] tracking-widest uppercase mb-8">
            Tax Comparison
          </h3>
          
          <div className="space-y-6 flex-grow">
            <div className="flex justify-between items-center border-b border-[#D4E0D0] pb-4">
              <span className="text-gray-600 font-medium">Old Tax Regime</span>
              <span className="text-xl font-bold text-red-600">
                ₹ {Math.round(taxOld).toLocaleString("en-IN")}
              </span>
            </div>
            
            <div className="flex justify-between items-center border-b border-[#D4E0D0] pb-4">
              <span className="text-gray-600 font-medium">New Tax Regime</span>
              <span className="text-xl font-bold text-green-700">
                ₹ {Math.round(taxNew).toLocaleString("en-IN")}
              </span>
            </div>
            
            <div className="pt-4">
              <span className="block text-sm font-bold text-[#1F2E26] mb-1">Recommendation:</span>
              <span className="text-lg font-bold text-[#36503F]">
                {taxNew < taxOld 
                  ? "New Regime is better (without investments)." 
                  : taxOld < taxNew 
                    ? "Old Regime is better." 
                    : "Both regimes result in the same tax."}
              </span>
            </div>

            <div className="pt-6 mt-auto">
              <div className="bg-[#E4EDE6] rounded-lg p-3 border border-[#D4E0D0]">
                <p className="text-[11px] leading-relaxed text-[#36503F]/80 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <span className="font-bold">Disclaimer:</span> This calculator provides an estimate based on standard inputs. Please do not trust these figures blindly for official tax filings, as actual tax liabilities may vary based on individual deductions and exemptions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
