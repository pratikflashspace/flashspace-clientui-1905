import React, { useState, useMemo, useEffect } from 'react';
import { IndianRupee, TrendingUp, Calendar, BarChart3, Calculator, Loader2 } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ComposedChart, Bar, Line } from 'recharts';
import axiosInstance from '@/lib/axios';

const TIMEFRAMES = [
  { label: '1M', months: 1 },
  { label: '3M', months: 3 },
  { label: '6M', months: 6 },
  { label: '1Y', months: 12 },
  { label: '3Y', months: 36 },
  { label: '5Y', months: 60 },
  { label: '10Y', months: 120 },
];

export default function RevenueForecast() {
  const [dealsPerMonth, setDealsPerMonth] = useState<number>(5);
  const [avgCommissionPerDeal, setAvgCommissionPerDeal] = useState<number | ''>(7500);
  const [momGrowth, setMomGrowth] = useState<number>(0);
  
  const [timeframe, setTimeframe] = useState<string>('1Y');
  
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch historical data to personalize defaults
  useEffect(() => {
    axiosInstance
      .get<{ success: boolean; data: { monthlyEarnings: Array<{ month: string; earnings: number; clients: number }>; totalEarnings: number; convertedClients: number } }>(
        "/api/affiliate/dashboard/stats"
      )
      .then((res) => {
        if (res.data.success) {
          const stats = res.data.data;

          if (stats.convertedClients > 0) {
            // Calculate actual average commission per deal
            const avgComm = Math.round(stats.totalEarnings / stats.convertedClients);
            setAvgCommissionPerDeal(avgComm > 0 ? avgComm : 7500);
            
            // Set deals per month (assume active for ~6 months on avg)
            const estDeals = Math.max(1, Math.round(stats.convertedClients / 6));
            setDealsPerMonth(estDeals > 50 ? 50 : estDeals);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard stats", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const activeTimeframeMonths = TIMEFRAMES.find(t => t.label === timeframe)?.months || 12;

  // Generate projection data based on selected timeframe
  const data = useMemo(() => {
    let cumulative = 0;
    const result = [];
    const currentDate = new Date();
    // Start projection from current month
    currentDate.setMonth(currentDate.getMonth());

    for (let i = 0; i < activeTimeframeMonths; i++) {
      const deals = dealsPerMonth * Math.pow(1 + momGrowth / 100, i);
      let commission = deals * (Number(avgCommissionPerDeal) || 0);
      
      const minCommission = 500 * deals;
      if (commission < minCommission) {
        commission = minCommission;
      }

      cumulative += commission;

      const projectionDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const monthStr = projectionDate.toLocaleString('default', { month: 'short' });
      const yearStr = projectionDate.getFullYear();
      
      // For longer timeframes, maybe just show year, but tooltip can show full
      const label = `${monthStr} ${yearStr.toString().slice(2)}`;

      result.push({
        month: label,
        monthIndex: i + 1,
        deals: Math.round(deals),
        commission: Math.round(commission),
        cumulative: Math.round(cumulative),
        isProjected: true
      });
    }
    return result;
  }, [dealsPerMonth, avgCommissionPerDeal, activeTimeframeMonths, momGrowth]);

  // Calculate totals
  const selectedRangeTotal = data.reduce((sum, d) => sum + d.commission, 0);
  const monthlyAverage = selectedRangeTotal / (data.length || 1);
  const totalCumulative = data.length > 0 ? data[data.length - 1].cumulative : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatYAxis = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
    return `₹${val}`;
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 p-6 md:p-8 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#35503F]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>
      
      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Inputs */}
        <div className="xl:col-span-4 space-y-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[#35503F]" />
              Revenue <span className="text-[#35503F] italic">Forecast</span>
            </h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">Project your earnings based on your deal volume.</p>
          </div>

          <div className="space-y-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
            {/* Deals Per Month */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-sm font-bold text-gray-700">Expected Deals per Month</label>
                <span className="text-lg font-black text-[#35503F]">{dealsPerMonth}</span>
              </div>
              <input 
                type="range" min="1" max="100" step="1" 
                value={dealsPerMonth}
                onChange={(e) => setDealsPerMonth(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#35503F]"
              />
            </div>

            {/* Average Commission per Deal */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700">Avg. Commission per Deal (₹)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <IndianRupee className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  min="0"
                  value={avgCommissionPerDeal}
                  onChange={(e) => setAvgCommissionPerDeal(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#35503F]/5 focus:border-[#35503F] font-bold text-gray-900 transition-all outline-none"
                  placeholder="0"
                />
              </div>
            </div>

            {/* MoM Growth */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-end">
                <label className="text-sm font-bold text-gray-700">MoM Deal Growth Rate</label>
                <span className="text-lg font-black text-emerald-600">+{momGrowth}%</span>
              </div>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Estimated monthly growth in your deal volume.
              </p>
              <input 
                type="range" min="0" max="20" step="1" 
                value={momGrowth}
                onChange={(e) => setMomGrowth(Number(e.target.value))}
                className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Chart & Summaries */}
        <div className="xl:col-span-8 flex flex-col space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#f8f8f8] p-5 rounded-2xl border border-gray-100 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">{timeframe} Total Deals</span>
              </div>
              <span className="text-2xl font-black text-gray-900">{Math.round(data.reduce((sum, d) => sum + d.deals, 0))}</span>
            </div>
            
            <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10 text-emerald-500">
                <BarChart3 className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-emerald-700 mb-2">
                  <Calculator className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">{timeframe} Commission</span>
                </div>
                <span className="text-2xl font-black text-emerald-900">{formatCurrency(totalCumulative)}</span>
              </div>
            </div>

            <div className="bg-[#f8f8f8] p-5 rounded-2xl border border-gray-100 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Monthly Avg (in {timeframe})</span>
              </div>
              <span className="text-2xl font-black text-gray-900">{formatCurrency(monthlyAverage)}</span>
            </div>
          </div>

          {/* Chart Container */}
          <div className="flex-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col min-h-[400px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-lg font-bold text-gray-900">Commission Growth</h3>
              
              {/* Timeframe Tabs */}
              <div className="flex items-center gap-1 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                {TIMEFRAMES.map((tf) => (
                  <button
                    key={tf.label}
                    onClick={() => setTimeframe(tf.label)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      timeframe === tf.label 
                        ? 'bg-white text-[#35503F] shadow-sm ring-1 ring-black/5' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full relative min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5bb09c" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#5bb09c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }}
                    dy={10}
                    minTickGap={timeframe === '1Y' || timeframe === '6M' ? 10 : 30}
                  />
                  <YAxis 
                    yAxisId="left"
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }}
                    tickFormatter={formatYAxis}
                    dx={-10}
                    width={50}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                    formatter={(value: number, name: string) => [
                      formatCurrency(value), 
                      name === 'commission' ? 'Monthly Comm.' : 'Cumulative'
                    ]}
                    labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                  />
                  {/* For short timeframes (<1Y), we can show bars, else hide them or make them thin */}
                  {activeTimeframeMonths <= 12 && (
                    <Bar yAxisId="left" dataKey="commission" fill="#35503F" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  )}
                  {/* The cumulative area chart looks cool, but the user's screenshot is just an area chart of the current value. 
                      Let's plot the Monthly Commission as the Area, and remove Cumulative so it looks exactly like the stock chart! */}
                  <Area 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="commission" 
                    stroke="#5bb09c" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorCommission)" 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
