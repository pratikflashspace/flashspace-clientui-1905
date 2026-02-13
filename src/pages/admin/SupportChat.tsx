
import React, { useState } from 'react';
import {
    Search,
    Send,
    MoreHorizontal,
    User,
    Headphones,
    MessageSquare,
    Clock,
    CheckCircle,
    AlertCircle,
    Bot
} from 'lucide-react';

export default function SupportChat() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeChatId, setActiveChatId] = useState(1);

    // Mock Data
    const chats = [
        {
            id: 1,
            name: 'Tech Innovations',
            message: 'Need help with my booking',
            time: '2 min ago',
            status: 'waiting',
            unread: 3,
            initials: 'TI',
            color: 'bg-emerald-100 text-emerald-600'
        },
        {
            id: 2,
            name: 'StartupXYZ',
            message: 'Invoice query resolved',
            time: '15 min ago',
            status: 'active',
            unread: 0,
            initials: 'XYZ',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            id: 3,
            name: 'Global Consulting',
            message: 'Thanks for the help!',
            time: '1 hr ago',
            status: 'resolved',
            unread: 0,
            initials: 'GC',
            color: 'bg-purple-100 text-purple-600'
        },
        {
            id: 4,
            name: 'Design Studio',
            message: 'Mail forwarding issue',
            time: '2 hrs ago',
            status: 'waiting',
            unread: 1,
            initials: 'DS',
            color: 'bg-orange-100 text-orange-600'
        }
    ];

    const currentChat = chats.find(c => c.id === activeChatId) || chats[0];

    return (
        <div className="min-h-screen bg-transparent space-y-8 font-sans animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Support <span className="text-teal-500 italic">Chats</span>
                </h1>
                <p className="text-gray-500 mt-2 text-lg font-light">
                    Manage live chats and take over from AI when needed
                </p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                    <h3 className="text-3xl font-extrabold tracking-tight text-gray-900">12</h3>
                    <p className="text-gray-500 font-medium mt-1 text-sm">Active Chats</p>
                </div>
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                    <h3 className="text-3xl font-extrabold tracking-tight text-orange-500">5</h3>
                    <p className="text-gray-500 font-medium mt-1 text-sm">Waiting</p>
                </div>
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                    <h3 className="text-3xl font-extrabold tracking-tight text-green-500">89%</h3>
                    <p className="text-gray-500 font-medium mt-1 text-sm">AI Resolution</p>
                </div>
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                    <h3 className="text-3xl font-extrabold tracking-tight text-gray-900">2.3 min</h3>
                    <p className="text-gray-500 font-medium mt-1 text-sm">Avg Response</p>
                </div>
            </div>

            {/* Chat Interface */}
            <div className="flex flex-col lg:flex-row gap-6 h-[700px]">
                {/* Chat List */}
                <div className="w-full lg:w-1/3 bg-white rounded-[24px] border border-gray-100 flex flex-col shadow-sm">
                    <div className="p-6 border-b border-gray-100">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search chats..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setActiveChatId(chat.id)}
                                className={`p-4 rounded-xl cursor-pointer transition-all ${activeChatId === chat.id
                                    ? 'bg-teal-50 border border-teal-100 shadow-sm'
                                    : 'hover:bg-gray-50 border border-transparent'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${chat.color}`}>
                                            {chat.initials}
                                        </div>
                                        <div>
                                            <h4 className={`text-sm font-bold ${activeChatId === chat.id ? 'text-teal-900' : 'text-gray-900'}`}>{chat.name}</h4>
                                            <p className={`text-xs truncate max-w-[140px] mt-0.5 ${activeChatId === chat.id ? 'text-teal-600' : 'text-gray-500'}`}>{chat.message}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-medium ml-2 shrink-0">{chat.time}</span>
                                </div>
                                <div className="flex justify-between items-center mt-3 pl-[52px]">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border ${chat.status === 'waiting' ? 'bg-red-50 text-red-600 border-red-100' :
                                            chat.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' :
                                                'bg-gray-50 text-gray-500 border-gray-100'
                                        }`}>
                                        {chat.status}
                                    </span>
                                    {chat.unread > 0 && (
                                        <span className="w-5 h-5 bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm shadow-teal-200">
                                            {chat.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="w-full lg:w-2/3 bg-white rounded-[24px] border border-gray-100 flex flex-col shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${currentChat.color}`}>
                                {currentChat.initials}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{currentChat.name}</h2>
                                <p className="text-xs text-gray-500 mt-0.5">Client ID: CL-00{currentChat.id}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm">
                                Take Over
                            </button>
                            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm">
                                View Client
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/50">
                        {/* Time divider */}
                        <div className="flex justify-center">
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-400">
                                Today, 10:00 AM
                            </span>
                        </div>

                        {/* AI Message */}
                        <div className="flex justify-end">
                            <div className="max-w-[80%]">
                                <div className="bg-purple-50 p-4 rounded-2xl rounded-tr-none border border-purple-100 shadow-sm relative group">
                                    <div className="absolute -right-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <p className="text-xs font-bold text-purple-600 mb-1">AI Bot</p>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Hello! I can help you with mail forwarding. Could you please share your booking ID?
                                    </p>
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1 block text-right pr-2">10:00 AM</span>
                            </div>
                        </div>

                        {/* User Message */}
                        <div className="flex justify-start">
                            <div className="max-w-[80%]">
                                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                        <User className="w-3 h-3 text-gray-400" />
                                        <p className="text-xs font-bold text-gray-400">{currentChat.name}</p>
                                    </div>
                                    <p className="text-gray-800 text-sm leading-relaxed">
                                        My booking ID is BO-2024-001
                                    </p>
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1 block pl-2">10:02 AM</span>
                            </div>
                        </div>

                        {/* Support Agent Message */}
                        <div className="flex justify-end">
                            <div className="max-w-[80%]">
                                <div className="bg-teal-600 p-4 rounded-2xl rounded-tr-none shadow-md shadow-teal-100 relative group">
                                    <div className="absolute -right-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-8 h-8 bg-teal-50 rounded-full flex items-center justify-center text-teal-600">
                                            <Headphones className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <p className="text-xs font-bold text-teal-100 mb-1">You</p>
                                    <p className="text-white text-sm leading-relaxed">
                                        I'm taking over this chat. Let me check your booking details...
                                    </p>
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1 block text-right pr-2">10:03 AM</span>
                            </div>
                        </div>

                        {/* Support Agent Message 2 */}
                        <div className="flex justify-end">
                            <div className="max-w-[80%]">
                                <div className="bg-teal-600 p-4 rounded-2xl rounded-tr-none shadow-md shadow-teal-100 relative">
                                    <p className="text-xs font-bold text-teal-100 mb-1">You</p>
                                    <p className="text-white text-sm leading-relaxed">
                                        I found your booking. I see you have a pending mail item. Would you like me to arrange forwarding?
                                    </p>
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1 block text-right pr-2">10:04 AM</span>
                            </div>
                        </div>

                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-white border-t border-gray-100">
                        <div className="flex items-center gap-4 bg-gray-50 p-2 pr-2 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-teal-100 focus-within:border-teal-200 transition-all">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="flex-1 bg-transparent border-none focus:outline-none px-4 text-sm text-gray-700 placeholder:text-gray-400"
                            />
                            <button className="p-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-md shadow-teal-200 flex items-center justify-center">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
