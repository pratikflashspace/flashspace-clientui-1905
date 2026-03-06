
import React, { useState } from 'react';
import { Copy, QrCode, Share2, BarChart3, FileText, Download, Link2, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { affiliatePortalService } from "@/services/affiliatePortal.service";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// --- Static Data for Future Backend Integration ---
const PERFORMANCE_DATA = [
  { name: "Main Referral Link", link: "flashspace.com/ref/AFF123", clicks: 245, conv: 34, rate: "14%" },
  { name: "Virtual Office Campaign", link: "flashspace.com/ref/AFF123-vo", clicks: 89, conv: 18, rate: "20%" },
  { name: "Team Space Promo", link: "flashspace.com/ref/AFF123-ts", clicks: 56, conv: 8, rate: "14%" },
];

const ASSETS_DATA = [
  { title: "FlashSpace Brand Kit", size: "12 MB", downloads: "45", type: "ZIP" },
  { title: "Social Media Templates", size: "N/A", downloads: "128", type: "Canva" },
  { title: "Email Templates", size: "2.4 MB", downloads: "67", type: "HTML" },
  { title: "Presentation Deck", size: "8.5 MB", downloads: "34", type: "PPT" },
  { title: "Product Brochure", size: "4.2 MB", downloads: "89", type: "PDF" },
];

const QR_CODES_DATA = [
  { title: "Main Referral QR", image: "/qr-placeholder.png" },
  { title: "Virtual Office QR", image: "/qr-placeholder.png" },
  { title: "Team Space QR", image: "/qr-placeholder.png" },
  { title: "Event Promo QR", image: "/qr-placeholder.png" },
];

const MarketingTools = () => {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [coupon, setCoupon] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const { user } = useAuth();

  const referralLink = coupon ? `${window.location.origin}/ref/${coupon.code}` : "https://flashspace.com/ref/AFF123";

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [couponRes, statsRes] = await Promise.allSettled([
          affiliatePortalService.getMyCoupon(),
          affiliatePortalService.getDashboardStats()
        ]);

        if (couponRes.status === 'fulfilled' && couponRes.value?.data) {
          setCoupon(couponRes.value.data);
        }
        if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
          setStats(statsRes.value.data);
        }
      } catch (error) {
        console.error("Failed to fetch marketing data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  /* Refactored Handlers */
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (link: string, title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: 'Check out this link from FlashSpace!',
          url: link,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error("Failed to share.");
        }
      }
    } else {
      handleCopy(link);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2d5a4c]" />
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-[#1a1a1a] tracking-tight">
          Marketing <span className="italic font-bold text-[#2d5a4c]">Tools</span>
        </h1>
        <p className="text-[#6b7280] mt-2 text-lg font-medium">Referral links, assets, and promotional materials</p>
      </div>

      <Tabs defaultValue="referral" className="w-full">
        <TabsList className="bg-transparent h-auto p-0 gap-8 mb-10 border-b border-gray-100 w-full justify-start rounded-none">
          <TabsTrigger
            value="referral"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2d5a4c] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-4 text-base font-bold text-gray-400 data-[state=active]:text-[#1a1a1a] transition-all"
          >
            Referral Links
          </TabsTrigger>
          <TabsTrigger
            value="assets"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2d5a4c] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-4 text-base font-bold text-gray-400 data-[state=active]:text-[#1a1a1a] transition-all"
          >
            Marketing Assets
          </TabsTrigger>
          <TabsTrigger
            value="qr"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2d5a4c] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-4 text-base font-bold text-gray-400 data-[state=active]:text-[#1a1a1a] transition-all"
          >
            QR Codes
          </TabsTrigger>
        </TabsList>

        {/* --- REFERRAL LINKS TAB --- */}
        <TabsContent value="referral" className="space-y-10 outline-none animate-slide-up">
          <div className="bg-white p-8 rounded-[2rem] border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 space-y-8">
            <h3 className="font-bold text-[#1a1a1a] text-xl">Your Unique Referral Link</h3>
            <div className="flex flex-col xl:flex-row gap-5 items-center">
              <div className="flex-1 bg-[#f9fafb] px-6 py-4 rounded-2xl font-medium text-base text-[#1a1a1a] flex items-center min-w-0 w-full h-16">
                <span className="truncate">{referralLink}</span>
              </div>
              <div className="flex gap-3 w-full xl:w-auto h-16">
                <Button
                  variant="outline"
                  className="flex-1 xl:w-auto gap-2 border-gray-200 hover:bg-gray-50 text-gray-700 h-full px-6 rounded-2xl font-bold transition-all text-base"
                  onClick={() => handleCopy(referralLink)}
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-gray-500" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 xl:w-auto gap-2 border-gray-200 hover:bg-gray-50 text-gray-700 h-full px-6 rounded-2xl font-bold transition-all text-base">
                      <QrCode className="w-5 h-5 text-gray-500" /> QR Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md rounded-[2rem]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-[#1a1a1a]">Your Unique QR Code</DialogTitle>
                      <DialogDescription className="text-gray-500 font-medium">
                        Scan this code to refer new clients instantly.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center p-8 space-y-6">
                      <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-gray-100 shadow-sm">
                        <QrCode className="w-56 h-56 text-gray-900" strokeWidth={1} />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-xs text-gray-400 font-mono break-all px-8">{referralLink}</p>
                        <Button variant="link" className="text-[#2d5a4c] font-bold text-sm h-auto p-0" onClick={() => handleCopy(referralLink)}>Copy Link</Button>
                      </div>
                    </div>
                    <div className="flex justify-center p-2">
                      <Button className="w-full bg-[#2d5a4c] hover:bg-[#1a3a3a] h-14 rounded-2xl font-bold text-base" onClick={() => toast.success("QR Code downloaded! (Simulation)")}>
                        <Download className="w-5 h-5 mr-3" /> Download PNG
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  className="flex-[1.5] xl:w-auto bg-[#2d5a4c] hover:bg-[#1a3a3a] text-white gap-2 shadow-lg hover:shadow-[#2d5a4c]/30 h-full px-8 rounded-2xl font-bold transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleShare(referralLink, 'Join FlashSpace')}
                  disabled={!coupon}
                >
                  <Share2 className="w-5 h-5" /> Share
                </Button>
              </div>
            </div>
            {!coupon && !isLoading && (
              <p className="text-amber-600 text-sm font-semibold flex items-center gap-2 mt-4 bg-amber-50 p-4 rounded-xl border border-amber-100">
                <BarChart3 className="w-4 h-4" /> Please generate your coupon code in the dashboard to activate your referral link.
              </p>
            )}
          </div>

          <div className="bg-white rounded-[2rem] border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <h3 className="font-bold text-[#1a1a1a] text-xl">Link Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="text-[#9ca3af] text-sm font-bold">
                    <th className="px-8 py-6">Campaign</th>
                    <th className="px-8 py-6">Link</th>
                    <th className="px-8 py-6 text-center">Clicks</th>
                    <th className="px-8 py-6 text-center">Conversions</th>
                    <th className="px-8 py-6 text-center">Rate</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats ? (
                    <tr className="group hover:bg-[#f9fafb] transition-colors">
                      <td className="px-8 py-6 font-bold text-[#1a1a1a] text-base">Main Referral Link</td>
                      <td className="px-8 py-6 text-base text-gray-600">
                        <div className="flex items-center gap-2"><Link2 className="w-4 h-4 text-gray-400" /> {coupon?.code || "Pending"}</div>
                      </td>
                      <td className="px-8 py-6 text-center text-[#6b7280] text-base font-medium">{stats.totalLeads || 0}</td>
                      <td className="px-8 py-6 text-center font-bold text-[#1a1a1a] text-base">{stats.convertedClients || 0}</td>
                      <td className="px-8 py-6 text-center">
                        <span className="bg-[#f0fdf4] text-[#166534] px-4 py-1.5 rounded-full text-xs font-bold">
                          {stats.totalLeads > 0 ? Math.round((stats.convertedClients / stats.totalLeads) * 100) : 0}%
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleCopy(referralLink)}
                            className="p-3 bg-gray-100 text-[#6b7280] rounded-xl hover:bg-gray-200 transition-colors"
                            title="Copy Link"
                            disabled={!coupon}
                          >
                            <Copy className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleShare(referralLink, 'Main Referral Link')}
                            className="p-3 bg-gray-100 text-[#6b7280] rounded-xl hover:bg-gray-200 transition-colors"
                            title="Share Link"
                            disabled={!coupon}
                          >
                            <Share2 className="w-5 h-5" />
                          </button>
                          <button className="p-3 bg-gray-100 text-[#6b7280] rounded-xl hover:bg-gray-200 transition-colors">
                            <BarChart3 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    PERFORMANCE_DATA.map((item, idx) => (
                      <tr key={idx} className="group hover:bg-[#f9fafb] transition-colors opacity-50">
                        <td className="px-8 py-6 font-bold text-[#1a1a1a] text-base">{item.name}</td>
                        <td className="px-8 py-6 text-base text-gray-600">
                          <div className="flex items-center gap-2"><Link2 className="w-4 h-4 text-gray-400" /> {item.link}</div>
                        </td>
                        <td className="px-8 py-6 text-center text-[#6b7280] text-base font-medium">{item.clicks}</td>
                        <td className="px-8 py-6 text-center font-bold text-[#1a1a1a] text-base">{item.conv}</td>
                        <td className="px-8 py-6 text-center">
                          <span className="bg-[#f0fdf4] text-[#166534] px-4 py-1.5 rounded-full text-xs font-bold">{item.rate}</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button className="p-3 bg-gray-100 text-[#6b7280] rounded-xl cursor-not-allowed"><Copy className="w-5 h-5" /></button>
                            <button className="p-3 bg-gray-100 text-[#6b7280] rounded-xl cursor-not-allowed"><Share2 className="w-5 h-5" /></button>
                            <button className="p-3 bg-gray-100 text-[#6b7280] rounded-xl cursor-not-allowed"><BarChart3 className="w-5 h-5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* --- MARKETING ASSETS TAB --- */}
        <TabsContent value="assets" className="outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {ASSETS_DATA.map((asset, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-[2rem] border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 flex flex-col justify-between group hover:shadow-lg transition-all"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:text-[#5bb09c] transition-colors">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-md uppercase tracking-wider">
                      {asset.type}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg leading-tight">{asset.title}</h4>
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

        {/* --- QR CODES TAB (REFINED SIZE) --- */}
        <TabsContent value="qr" className="outline-none">
          {/* Increased grid columns from 3 to 4 for smaller cards on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in-up">
            {QR_CODES_DATA.map((qr, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-[2rem] border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 flex flex-col items-center group hover:shadow-lg transition-all"
              >

                {/* QR Code Container (Reduced padding) */}
                <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center mb-4 p-6">
                  <div className="w-full h-full bg-white rounded shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
                    <QrCode className="w-3/4 h-3/4 text-gray-800" />
                  </div>
                </div>

                {/* Info Section */}
                <div className="text-center mb-4">
                  <h4 className="font-bold text-gray-900 text-base leading-tight">{qr.title}</h4>
                </div>

                {/* Download Button (Reduced py) */}
                <Button
                  variant="outline"
                  className="w-full gap-2 border-gray-200 hover:border-[#2d5a4c] hover:text-[#2d5a4c] hover:bg-emerald-50/30 transition-all h-12 rounded-xl font-bold text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download PNG
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
