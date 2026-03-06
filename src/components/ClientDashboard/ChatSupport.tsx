import React from 'react';
import { Bot, User, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChatSupport() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="mb-6 pl-1">
                    <h1 className="text-2xl md:text-3xl font-bold  text-gray-900">
                        Chat <span className="text-[#35503F] italic">Support</span>
                    </h1>
                    <p className="text-gray-500 mt-2">Get instant help from our AI assistant or connect with your space partner</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Chat Area */}
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden min-h-[600px] max-h-[calc(100vh-200px)]">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">FlashSpace AI</h3>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#FDE68A] text-yellow-800">
                                            ✨ AI Powered
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" className="text-sm font-medium border-gray-200 text-gray-700 hover:bg-[#FAF6D3] hover:border-black hover:text-gray-900">
                                Connect to Partner
                            </Button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-50/30">
                            {/* System/AI Message */}
                            <div className="flex gap-3 max-w-[80%]">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Bot className="w-4 h-4 text-gray-600" />
                                </div>
                                <div>
                                    <div className="bg-gray-100 text-gray-800 p-3.5 rounded-2xl rounded-tl-none text-sm shadow-sm border border-gray-100/50">
                                        Hello! I'm your FlashSpace AI assistant. How can I help you today?
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1.5 ml-1 block font-medium">10:00 AM</span>
                                </div>
                            </div>

                            {/* User Message */}
                            <div className="flex gap-3 max-w-[80%] ml-auto justify-end">
                                <div>
                                    <div className="bg-[#35503F] text-[#FEF8C3] p-3.5 rounded-2xl rounded-tr-none text-sm shadow-sm">
                                        I want to know about my mail delivery status
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1.5 mr-1 block text-right font-medium">10:02 AM</span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-[#35503F] flex items-center justify-center flex-shrink-0 mt-1">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                            </div>

                            {/* System/AI Message 2 */}
                            <div className="flex gap-3 max-w-[80%]">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Bot className="w-4 h-4 text-gray-600" />
                                </div>
                                <div>
                                    <div className="bg-gray-100 text-gray-800 p-3.5 rounded-2xl rounded-tl-none text-sm shadow-sm border border-gray-100/50 leading-relaxed">
                                        I can help you with that! You have 2 pending mail items at your Mumbai BKC office.
                                        Would you like me to arrange a forwarding for them?
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1.5 ml-1 block font-medium">10:02 AM</span>
                                </div>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-gray-100 bg-white">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#35503F]/20 focus:border-[#35503F] transition-all"
                                />
                                <button className="absolute right-2 p-2 bg-[#35503F] text-[#FEF8C3] rounded-lg hover:bg-[#35503F]/90 transition-colors shadow-sm">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-full lg:w-80 space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100">
                            <h3 className="font-semibold text-gray-900 mb-4 text-[15px]">Quick Actions</h3>
                            <div className="space-y-2.5">
                                {['Check mail status', 'Payment inquiry', 'Book meeting room', 'Talk to partner'].map((action) => (
                                    <button
                                        key={action}
                                        className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-[#FAF6D3] hover:border-black hover:text-gray-900 transition-all shadow-sm"
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Contact Partner */}
                        <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100">
                            <h3 className="font-semibold text-gray-900 mb-2 text-[15px]">Contact Partner</h3>
                            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                                Need to speak with your space partner directly?
                            </p>
                            <Button variant="outline" className="w-full bg-white flex items-center justify-center gap-2 text-gray-700 font-medium py-5 border-gray-200 hover:bg-[#FAF6D3] hover:border-black hover:text-gray-900 shadow-sm rounded-xl transition-all">
                                <MessageSquare className="w-4 h-4" />
                                Start Chat
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
