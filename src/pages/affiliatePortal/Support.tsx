

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
    <div className=" mx-auto min-h-screen p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight italic text-[#5bb09c]">Support</h1>
        <p className="text-gray-500 mt-2 font-medium">Get help with AI-powered chat or raise a ticket</p>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="bg-gray-100/50 p-1 mb-8">
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="w-4 h-4" /> AI Chat
          </TabsTrigger>
          <TabsTrigger value="chat_tickets" className="gap-2">
            <Ticket className="w-4 h-4" /> My Tickets
          </TabsTrigger>
          <TabsTrigger value="faq" className="gap-2">
            <HelpCircle className="w-4 h-4" /> FAQ
          </TabsTrigger>
        </TabsList>

        {/* --- AI CHAT TAB (Includes Sidebar) --- */}
        <TabsContent value="chat" className="outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Chat Interface - Passing state and setter as props */}
            <div className="lg:col-span-8">
              <SupportChat 
                messages={chatMessages} 
                setMessages={setChatMessages} 
              />
            </div>

            {/* Sidebar: Only visible in Chat Tab */}
            <div className="lg:col-span-4 space-y-6 animate-in slide-in-from-right-4 duration-500">
              {/* Contact Us Card */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="font-bold text-gray-800">Contact Us</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:text-[#5bb09c] group-hover:bg-teal-50 transition-all">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Phone Support</p>
                      <p className="text-[10px] text-gray-500 font-medium">+91 80 1234 5678</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:text-[#5bb09c] group-hover:bg-teal-50 transition-all">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Email Support</p>
                      <p className="text-[10px] text-gray-500 font-medium">partners@flashspace.in</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Business Hours</p>
                      <p className="text-[10px] text-gray-500 font-medium">Mon-Sat, 9AM - 7PM IST</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links Card */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="font-bold text-gray-800">Quick Links</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Partner Guide', icon: Book },
                    { label: 'Commission Policy', icon: ShieldCheck },
                    { label: 'Video Tutorials', icon: PlayCircle }
                  ].map((link, i) => (
                    <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <link.icon className="w-4 h-4 text-gray-400 group-hover:text-[#5bb09c]" />
                        <span className="text-xs font-bold text-gray-700">{link.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#5bb09c]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* --- MY TICKETS TAB --- */}
        <TabsContent value="chat_tickets" className="outline-none animate-in fade-in duration-300">
          <div className="max-w-5xl mx-auto">
            <SupportTickets />
          </div>
        </TabsContent>

        {/* --- FAQ TAB --- */}
        <TabsContent value="faq" className="outline-none animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { q: "How is my commission calculated?", a: "Your commission is calculated as 10% of the first month's booking value for new clients you refer." },
              { q: "When are payouts processed?", a: "Payouts are processed on the 1st and 15th of every month for all confirmed bookings." },
              { q: "How do I track my referrals?", a: "You can track all your referrals in the Booking Management section with real-time status updates." },
              { q: "Can I get custom marketing materials?", a: "Yes! Visit the Marketing Tools section to request custom branded materials." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3 group hover:border-[#5bb09c]/30 transition-all">
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