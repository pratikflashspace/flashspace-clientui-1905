import React, { useState } from "react";
import { IndianRupee, Briefcase } from "lucide-react";

export default function EPFCalculator() {
  const [basicSalary, setBasicSalary] = useState<string>("50000");
  const [age, setAge] = useState<string>("25");
  const [contribution, setContribution] = useState<number>(12); // Employee contribution %
  const [interestRate, setInterestRate] = useState<number>(8.25); // Current EPF interest rate

  const calculateEPF = () => {
    const salary = parseFloat(basicSalary) || 0;
    const currentAge = parseInt(age) || 25;
    const yearsToRetire = Math.max(0, 58 - currentAge); // Retirement at 58
    
    // Monthly contributions
    const empContribution = salary * (contribution / 100);
    const employerContributionEPF = salary * 0.0367; // 3.67% to EPF
    const employerContributionEPS = salary * 0.0833; // 8.33% to EPS (Capped at 1250/month usually, simplifying here)
    
    const totalMonthlyEPF = empContribution + employerContributionEPF;
    const yearlyContribution = totalMonthlyEPF * 12;

    // Compound interest calculation
    let totalCorpus = 0;
    let totalInvested = 0;
    
    for (let i = 0; i < yearsToRetire; i++) {
      totalInvested += yearlyContribution;
      totalCorpus = (totalCorpus + yearlyContribution) * (1 + (interestRate / 100));
    }

    return {
      totalInvested,
      estimatedCorpus: totalCorpus,
      interestEarned: totalCorpus - totalInvested,
      monthlyContribution: empContribution,
      employerMonthly: employerContributionEPF + employerContributionEPS
    };
  };

  const results = calculateEPF();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E8E2D9] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 md:p-12 bg-white">
          <h2 className="text-2xl font-bold text-[#36503F] mb-8">EPF Calculator</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Basic Monthly Salary + DA
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupee className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(e.target.value)}
                  className="pl-10 block w-full py-3 border border-gray-300 rounded-lg focus:ring-[#36503F] focus:border-[#36503F] sm:text-sm bg-gray-50 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="block w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-[#36503F] focus:border-[#36503F] sm:text-sm bg-gray-50 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contribution (%)
                </label>
                <input
                  type="number"
                  value={contribution}
                  onChange={(e) => setContribution(parseFloat(e.target.value))}
                  className="block w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-[#36503F] focus:border-[#36503F] sm:text-sm bg-gray-50 outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-[#36503F] focus:border-[#36503F] sm:text-sm bg-gray-50 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#F0F4EE] p-8 md:p-12 flex flex-col justify-center border-l border-[#E8E2D9]">
          <h3 className="text-sm font-bold text-[#36503F] tracking-widest uppercase mb-8">
            Estimated Returns at Age 58
          </h3>
          
          <div className="space-y-6 flex-grow">
            <div className="flex justify-between items-center border-b border-[#D4E0D0] pb-4">
              <span className="text-gray-600 font-medium">Your Monthly Contribution</span>
              <span className="text-lg font-semibold text-[#1F2E26]">
                ₹ {Math.round(results.monthlyContribution).toLocaleString("en-IN")}
              </span>
            </div>
            
            <div className="flex justify-between items-center border-b border-[#D4E0D0] pb-4">
              <span className="text-gray-600 font-medium">Total Invested</span>
              <span className="text-lg font-semibold text-[#1F2E26]">
                ₹ {Math.round(results.totalInvested).toLocaleString("en-IN")}
              </span>
            </div>
            
            <div className="pt-4">
              <span className="block text-sm font-bold text-gray-500 mb-1">Estimated EPF Corpus</span>
              <span className="text-4xl md:text-5xl font-bold text-[#36503F]">
                ₹ {Math.round(results.estimatedCorpus).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
