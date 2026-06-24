import React, { useState } from "react";
import { IndianRupee } from "lucide-react";

export default function SalaryCalculator() {
  const [ctc, setCtc] = useState<string>("1200000");

  const calculateSalary = () => {
    const totalCTC = parseFloat(ctc) || 0;
    const monthlyCTC = totalCTC / 12;

    // Typical simplified Indian salary structure
    const basic = totalCTC * 0.40;
    const hra = basic * 0.50;
    const specialAllowance = totalCTC - (basic + hra);

    // Deductions
    const epf = Math.min(basic * 0.12, 15000 * 0.12 * 12); // Assuming 12% of basic or max 1800/month
    const professionalTax = 2500; // Approx PT yearly

    const totalDeductions = epf + professionalTax;
    const netSalaryYearly = totalCTC - totalDeductions;

    return {
      monthlyCTC,
      basic: basic / 12,
      hra: hra / 12,
      specialAllowance: specialAllowance / 12,
      epf: epf / 12,
      pt: professionalTax / 12,
      netSalaryMonthly: netSalaryYearly / 12
    };
  };

  const results = calculateSalary();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E8E2D9] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 md:p-12 bg-white">
          <h2 className="text-2xl font-bold text-[#36503F] mb-8">Salary Calculator (CTC to In-Hand)</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual CTC
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupee className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={ctc}
                  onChange={(e) => setCtc(e.target.value)}
                  className="pl-10 block w-full py-3 border border-gray-300 rounded-lg focus:ring-[#36503F] focus:border-[#36503F] sm:text-sm bg-gray-50 outline-none transition-all"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Note: This is a simplified calculation. Actual in-hand depends on individual income tax declarations.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#F0F4EE] p-8 md:p-12 flex flex-col justify-center border-l border-[#E8E2D9]">
          <h3 className="text-sm font-bold text-[#36503F] tracking-widest uppercase mb-8">
            Monthly Breakdown
          </h3>
          
          <div className="space-y-4 flex-grow">
            <div className="flex justify-between items-center pb-2">
              <span className="text-gray-600 text-sm">Basic Salary</span>
              <span className="font-semibold text-[#1F2E26]">₹ {Math.round(results.basic).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-gray-600 text-sm">HRA</span>
              <span className="font-semibold text-[#1F2E26]">₹ {Math.round(results.hra).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#D4E0D0] pb-4">
              <span className="text-gray-600 text-sm">Special Allowance</span>
              <span className="font-semibold text-[#1F2E26]">₹ {Math.round(results.specialAllowance).toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between items-center pt-2 text-red-600">
              <span className="text-sm">EPF Deduction</span>
              <span className="font-semibold">- ₹ {Math.round(results.epf).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#D4E0D0] pb-4 text-red-600">
              <span className="text-sm">Professional Tax</span>
              <span className="font-semibold">- ₹ {Math.round(results.pt).toLocaleString("en-IN")}</span>
            </div>
            
            <div className="pt-4">
              <span className="block text-sm font-bold text-gray-500 mb-1">Estimated In-Hand (Monthly)</span>
              <span className="text-4xl md:text-5xl font-bold text-[#36503F]">
                ₹ {Math.round(results.netSalaryMonthly).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
