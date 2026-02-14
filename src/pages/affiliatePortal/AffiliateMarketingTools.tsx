

import React, { useState } from 'react';
import { Copy, QrCode, Share2, BarChart3, FileText, Download, Link2, Check } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
  { title: "Main Referral QR", link: "https://flashspace.com/ref/AFF123" },
  { title: "Virtual Office QR", link: "https://flashspace.com/ref/AFF123-vo" },
  { title: "Team Space QR", link: "https://flashspace.com/ref/AFF123-ts" },
  { title: "Event Promo QR", link: "https://flashspace.com/ref/AFF123-event" },
];

const MarketingTools = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const referralLink = "https://flashspace.com/ref/AFF123";

  /* Refactored Handlers */
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (link: string, title: string, id: string) => {
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
      handleCopy(link, id);
    }
  };

  return (
    <div className="mx-auto w-full p-6 lg:p-10 pb-2 lg:pb-4 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
{/* Header Removed */}

      <Tabs defaultValue="referral" className="w-full">
        <TabsList className="bg-gray-100/50 p-1 mb-8">
          <TabsTrigger value="referral">Referral Links</TabsTrigger>
          <TabsTrigger value="assets">Marketing Assets</TabsTrigger>
          <TabsTrigger value="qr">QR Codes</TabsTrigger>
        </TabsList>

        {/* --- REFERRAL LINKS TAB --- */}
        <TabsContent value="referral" className="space-y-8 outline-none animate-slide-up">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-800 text-lg">Your Unique Referral Link</h3>
            <div className="flex flex-col xl:flex-row gap-4">
              <div className="flex-1 bg-gray-50/80 px-4 py-3.5 rounded-xl border border-gray-100 font-mono text-sm text-gray-600 flex items-center min-w-0">
                <span className="truncate">{referralLink}</span>
              </div>
              <div className="flex flex-wrap md:flex-nowrap gap-2">
                <Button 
                    variant="outline" 
                    className="flex-1 md:w-auto gap-2 border-gray-200 hover:bg-gray-50 text-gray-700"
                    onClick={() => handleCopy(referralLink, 'main')}
                >
                  {copiedId === 'main' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />} 
                  {copiedId === 'main' ? "Copied!" : "Copy"}
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 md:w-auto gap-2 border-gray-200 hover:bg-gray-50 text-gray-700">
                      <QrCode className="w-4 h-4" /> QR Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Your Unique QR Code</DialogTitle>
                      <DialogDescription>
                        Scan this code to refer new clients instantly.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center p-6 space-y-4">
                       <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 shadow-sm">
                         {/* Dynamic QR Code */}
                         <QRCodeSVG 
                            value={referralLink} 
                            size={192} 
                            level="H" 
                            className="w-48 h-48"
                         />
                       </div>
                       <div className="text-center space-y-1">
                           <p className="text-xs text-gray-400 font-mono break-all px-8">{referralLink}</p>
                           <Button variant="link" className="text-[#5bb09c] text-xs h-auto p-0" onClick={() => handleCopy(referralLink, 'qr-modal')}>Copy Link</Button>
                       </div>
                    </div>
                    <div className="flex justify-center">
                        <Button className="w-full bg-[#5bb09c] hover:bg-[#4a9b89]" onClick={() => toast.success("QR Code downloaded! (Simulation)")}>
                            <Download className="w-4 h-4 mr-2" /> Download PNG
                        </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button 
                    className="flex-[2] md:w-auto bg-[#5bb09c] hover:bg-[#4a9b89] text-white gap-2 shadow-sm"
                    onClick={() => handleShare(referralLink, 'Join FlashSpace', 'main-share')}
                >
                  <Share2 className="w-4 h-4" /> Share
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <h3 className="font-bold text-gray-800 text-lg">Link Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Campaign</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Link</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-center">Clicks</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-center">Conversions</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-center">Rate</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {PERFORMANCE_DATA.map((item, idx) => (
                    <tr key={idx} className="group hover:bg-[#fafafa] transition-colors duration-150">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 whitespace-nowrap">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-[#5bb09c] font-medium whitespace-nowrap hover:underline cursor-pointer">
                        <div className="flex items-center gap-1.5"><Link2 className="w-3.5 h-3.5" /> {item.link}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium whitespace-nowrap text-center">{item.clicks}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900 whitespace-nowrap text-center">{item.conv}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold border border-emerald-100">{item.rate}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                            <button 
                                onClick={() => handleCopy(`https://${item.link}`, `row-${idx}`)}
                                className="p-2 bg-[#5bb09c]/10 text-[#5bb09c] rounded-lg hover:bg-[#5bb09c]/20 transition-colors" 
                                title="Copy Link"
                            >
                                {copiedId === `row-${idx}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <button 
                                onClick={() => handleShare(`https://${item.link}`, item.name, `share-${idx}`)}
                                className="p-2 bg-[#5bb09c]/10 text-[#5bb09c] rounded-lg hover:bg-[#5bb09c]/20 transition-colors" 
                                title="Share Link"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-[#5bb09c] transition-colors hover:bg-gray-50 rounded-lg">
                                <BarChart3 className="w-4 h-4" />
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-[#5bb09c]/30 transition-all"
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
                <Button variant="outline" className="w-full mt-6 gap-2 border-gray-200 hover:border-[#5bb09c] hover:text-[#5bb09c] hover:bg-teal-50/30 transition-all py-6">
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
                className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center group hover:border-[#5bb09c]/30 transition-all"
              >
                
                {/* QR Code Container (Reduced padding) */}
                <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center mb-4 p-6">
                  <div className="w-full h-full bg-white rounded shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
                    <QRCodeSVG 
                        id={`qr-${idx}`}
                        value={qr.link} 
                        size={128} 
                        level="H" 
                        className="w-full h-full" 
                    />
                  </div>
                </div>

                {/* Info Section */}
                <div className="text-center mb-4">
                  <h4 className="font-bold text-gray-900 text-base leading-tight">{qr.title}</h4>
                </div>

                {/* Download Button (Reduced py) */}
                <Button 
                  variant="outline" 
                  className="w-full gap-2 border-gray-200 hover:border-[#5bb09c] hover:text-[#5bb09c] hover:bg-teal-50/30 transition-all py-2 h-auto text-xs"
                  onClick={() => {
                    const canvas = document.createElement("canvas");
                    const svg = document.querySelector(`#qr-${idx}`);
                    if (svg) {
                      const xml = new XMLSerializer().serializeToString(svg);
                      const svg64 = btoa(xml);
                      const b64Start = 'data:image/svg+xml;base64,';
                      const image64 = b64Start + svg64;
                      
                      const img = new Image();
                      img.onload = () => {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx?.drawImage(img, 0, 0);
                        const pngUrl = canvas.toDataURL('image/png');
                        const link = document.createElement('a');
                        link.href = pngUrl;
                        link.download = `${qr.title.replace(/\s+/g, '-').toLowerCase()}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        toast.success("QR Code downloaded!");
                      };
                      img.src = image64;
                    } else {
                        toast.error("Could not find QR Code element.");
                    }
                  }}
                >
                  <Download className="w-3 h-3" />
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