

import React, { useState } from 'react';
import { MessageSquare, Ticket, HelpCircle, Phone, Mail, Clock, Book, ShieldCheck, PlayCircle, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SupportChat from '@/components/affiliatePortal/SupportChat';
import SupportTickets from '@/components/affiliatePortal/SupportTickets';

// Define the Message type here so it's accessible
export interface Message {
  role: 'bot' | 'user';
  text: string;
  time: string;
}

const Support = () => {
  // Lifted Chat State: This persists when tabs are switched
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: "Hello! I'm your FlashSpace AI assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  return (
    <div className="mx-auto min-h-screen p-4 md:p-6 lg:p-10 space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a1a1a] tracking-tight">Support</h1>
        <p className="text-[#6b7280] mt-2 text-base md:text-lg font-medium leading-relaxed">Get help with AI-powered chat or raise a ticket</p>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="bg-transparent p-1 pt-2 pb-4 mb-4 flex justify-start gap-2 md:gap-4 overflow-x-auto no-scrollbar scroll-smooth w-full max-w-full items-center min-h-[60px]">
          <TabsTrigger value="chat" className="shrink-0 whitespace-nowrap gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-white shadow-sm ring-1 ring-black/5 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:ring-[#2d5a4c] transition-all text-[#6b7280] data-[state=active]:text-[#1a1a1a] font-bold text-sm md:text-base mb-1">
            <MessageSquare className="w-4 h-4" /> AI Chat
          </TabsTrigger>
          <TabsTrigger value="chat_tickets" className="shrink-0 whitespace-nowrap gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-transparent rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-black/5 transition-all text-[#6b7280] data-[state=active]:text-[#1a1a1a] font-bold text-sm md:text-base mb-1">
            <Ticket className="w-4 h-4" /> My Tickets
          </TabsTrigger>
          <TabsTrigger value="faq" className="shrink-0 whitespace-nowrap gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-transparent rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-black/5 transition-all text-[#6b7280] data-[state=active]:text-[#1a1a1a] font-bold text-sm md:text-base mb-1">
            <HelpCircle className="w-4 h-4" /> FAQ
          </TabsTrigger>
        </TabsList>

        {/* --- AI CHAT TAB (Includes Sidebar) --- */}
        <TabsContent value="chat" className="outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Chat Interface - Passing state and setter as props */}
            <div className="lg:col-span-8 animate-slide-up order-1">
              <SupportChat
                messages={chatMessages}
                setMessages={setChatMessages}
              />
            </div>

            {/* Sidebar: Only visible in Chat Tab */}
            <div className="lg:col-span-4 space-y-6 md:space-y-8 animate-slide-up order-2">
              {/* Contact Us Card */}
              <div className="bg-[#f8f8f8] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 space-y-6">
                <h3 className="text-xl font-black text-[#1a1a1a]">Contact Us</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-[#f9fafb] rounded-[1.5rem] ring-1 ring-black/5 group cursor-pointer hover:bg-white hover:shadow-md transition-all">
                    <div className="p-3 bg-white shadow-sm rounded-2xl text-[#2d5a4c]">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#1a1a1a]">Phone Support</p>
                      <p className="text-xs text-[#6b7280] font-bold">+91 80 1234 5678</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-[#f9fafb] rounded-[1.5rem] ring-1 ring-black/5 group cursor-pointer hover:bg-white hover:shadow-md transition-all overflow-hidden">
                    <div className="p-3 bg-white shadow-sm rounded-2xl text-[#2d5a4c] shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-[#1a1a1a]">Email Support</p>
                      <p className="text-xs text-[#6b7280] font-bold break-all">partners@flashspace.in</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-[#f9fafb] rounded-[1.5rem] ring-1 ring-black/5 group cursor-pointer hover:bg-white hover:shadow-md transition-all">
                    <div className="p-3 bg-white shadow-sm rounded-2xl text-[#2d5a4c]">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#1a1a1a]">Business Hours</p>
                      <p className="text-xs text-[#6b7280] font-bold">Mon-Sat, 9AM - 7PM IST</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links Card */}
              <div className="bg-[#f8f8f8] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 space-y-6">
                <h3 className="text-xl font-black text-[#1a1a1a]">Quick Links</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Partner Guide', icon: Book },
                    { label: 'Commission Policy', icon: ShieldCheck },
                    { label: 'Video Tutorials', icon: PlayCircle }
                  ].map((link, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[#f9fafb] rounded-[1.5rem] ring-1 ring-black/5 hover:bg-white hover:shadow-md transition-all group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white shadow-sm rounded-xl text-[#6b7280] group-hover:text-[#2d5a4c]">
                          <link.icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-black text-[#1a1a1a]">{link.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#6b7280] group-hover:translate-x-1 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* --- MY TICKETS TAB --- */}
        <TabsContent value="chat_tickets" className="outline-none animate-slide-up">
          <div className="max-w-5xl mx-auto">
            <SupportTickets />
          </div>
        </TabsContent>

        {/* --- FAQ TAB --- */}
        <TabsContent value="faq" className="outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {[
              { q: "How is my commission calculated?", a: "Your commission is calculated as 10% of the first month's booking value for new clients you refer." },
              { q: "When are payouts processed?", a: "Payouts are processed on the 1st and 15th of every month for all confirmed bookings." },
              { q: "How do I track my referrals?", a: "You can track all your referrals in the Booking Management section with real-time status updates." },
              { q: "Can I get custom marketing materials?", a: "Yes! Visit the Marketing Tools section to request custom branded materials." }
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3 group hover:border-[#5bb09c]/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#5bb09c] group-hover:bg-teal-50 transition-colors">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-gray-900 leading-tight">{item.q}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Support;