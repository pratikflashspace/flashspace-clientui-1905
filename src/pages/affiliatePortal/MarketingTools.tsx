import React from 'react';
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommissionCalculator from "@/components/affiliatePortal/CommissionCalculator";
import RevenueForecast from "@/components/affiliatePortal/RevenueForecast";

const ASSETS_DATA = [
  { title: "FlashSpace Brand Kit", size: "12 MB", downloads: "45", type: "ZIP" },
  { title: "Social Media Templates", size: "N/A", downloads: "128", type: "Canva" },
  { title: "Email Templates", size: "2.4 MB", downloads: "67", type: "HTML" },
  { title: "Presentation Deck", size: "8.5 MB", downloads: "34", type: "PPT" },
  { title: "Product Brochure", size: "4.2 MB", downloads: "89", type: "PDF" },
];

const MarketingTools = () => {
  return (
 <div className="mx-auto min-h-screen p-4 md:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500"> 
      <div className="mb-10">
        <h1 style={{ fontFamily: "'Inter', sans-serif" }} className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Marketing <span className="text-[#36503F] italic">Tools</span>
        </h1>
        <p className="text-[#6b7280] mt-2 text-lg font-medium">Access calculators, forecasts, and promotional assets</p>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="bg-transparent h-auto p-0 gap-8 mb-10 border-b border-gray-100 w-full justify-start rounded-none overflow-x-auto overflow-y-hidden flex-nowrap scrollbar-none">
          <TabsTrigger
            value="calculator"
            className="whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-[#2d5a4c] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-4 text-sm font-bold text-gray-400 data-[state=active]:text-[#1a1a1a] transition-all"
          >
            Commission Calculator
          </TabsTrigger>
          <TabsTrigger
            value="forecast"
            className="whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-[#2d5a4c] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-4 text-sm font-bold text-gray-400 data-[state=active]:text-[#1a1a1a] transition-all"
          >
            Revenue Forecast
          </TabsTrigger>
          <TabsTrigger
            value="assets"
            className="whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-[#2d5a4c] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-4 text-sm font-bold text-gray-400 data-[state=active]:text-[#1a1a1a] transition-all"
          >
            Marketing Assets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="outline-none animate-slide-up">
          <CommissionCalculator />
        </TabsContent>

        <TabsContent value="forecast" className="outline-none animate-slide-up" style={{ animationDelay: '50ms' }}>
          <RevenueForecast />
        </TabsContent>

        <TabsContent value="assets" className="outline-none animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ASSETS_DATA.map((asset, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 flex flex-col justify-between group hover:shadow-lg transition-all"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:text-[#5bb09c] transition-colors">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-md uppercase tracking-wider">
                      {asset.type}
                    </span>
                  </div>
                  <div>
                    <h4 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold text-[#1A1A1A] leading-tight">{asset.title}</h4>
                    <p className="text-gray-400 text-xs mt-1 font-medium">
                      {asset.size !== "N/A" && `${asset.size} • `}{asset.downloads} downloads
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-6 gap-2 border-gray-200 hover:border-[#2d5a4c] hover:text-[#2d5a4c] hover:bg-emerald-50/30 transition-all py-6 rounded-2xl font-bold">
                  <Download className="w-4 h-4" /> Download
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketingTools;
