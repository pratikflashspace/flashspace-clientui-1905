import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Message } from "@/pages/affiliatePortal/Support"; // Import the type from parent

interface SupportChatProps {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const SupportChat = ({ messages, setMessages }: SupportChatProps) => {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages update or loading state changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: "user",
            text: input.trim(),
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        // Add user message to parent state
        setMessages((prev) => [...prev, userMessage]);
        const currentInput = input;
        setInput("");
        setIsLoading(true);

        try {
            // Local API Call simulation
            const response = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: currentInput }),
            });

            if (!response.ok) throw new Error("API Offline");

            const data = await response.json();

            const botResponse: Message = {
                role: "bot",
                text:
                    data.reply ||
                    "I've received your message and am looking into it.",
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };
            setMessages((prev) => [...prev, botResponse]);
        } catch (error) {
            // Fallback Apology Message
            const errorResponse: Message = {
                role: "bot",
                text: "I apologize, but I'm having trouble connecting right now. Please try again or raise a support ticket in the 'My Tickets' tab.",
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };

            setMessages((prev) => [...prev, errorResponse]);
            toast.error("Offline mode active.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[650px] bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 overflow-hidden">
            {/* Chat Header */}
            <div className=" bg-[#f8f8f8] p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f9fafb] rounded-2xl flex items-center justify-center text-[#2d5a4c] ring-1 ring-black/5">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-black text-[#1a1a1a]">
                            FlashSpace AI Assistant
                        </h4>
                        <p className="text-xs text-[#16a34a] font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-[#16a34a] rounded-full animate-pulse" />{" "}
                            Online
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-4 py-1.5 bg-[#2d5a4c] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                    <Sparkles className="w-3 h-3 fill-white" />
                    AI Powered
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth"
            >
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                        <div
                           className={`p-2 rounded-lg border shrink-0 ${msg.role === "user" ? "bg-[#5bb09c] text-white border-[#5bb09c]" : "bg-gray-50 text-gray-700 border-gray-200"}`}
                        >
                            {msg.role === "user" ? (
                                <User className="w-5 h-5" />
                            ) : (
                                <Bot className="w-5 h-5" />
                            )}
                        </div>
                        <div
                            className={`max-w-[80%] space-y-1.5 ${msg.role === "user" ? "text-right" : ""}`}
                        >
                            {/* Role badge */}
                            <div className={`flex items-center gap-1.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                                    ${msg.role === "user"
                                        ? 'bg-[#5bb09c]/15 text-[#3d8a78]'
                                        : 'bg-purple-100 text-purple-700'
                                    }`}>
                                    <span className={`w-1 h-1 rounded-full shrink-0 ${msg.role === "user" ? 'bg-[#5bb09c]' : 'bg-purple-400 animate-pulse'}`} />
                                    {msg.role === "user" ? "Affiliate" : "AI Support"}
                                </span>
                            </div>
                            <div
                                className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === "user"
                                        ? "bg-[#5bb09c] text-white rounded-tr-none"
                                        : "bg-gray-50 text-gray-700 rounded-tl-none border border-gray-100"
                                    }`}
                            >
                                {msg.text}
                            </div>
                            <p className="text-[10px] text-[#9ca3af] font-bold px-2 uppercase tracking-tight">
                                {msg.time}
                            </p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg border bg-gray-50 text-[#5bb09c]">
                            <Bot className="w-4 h-4 animate-bounce" />
                        </div>
                        <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-none border border-gray-100">
                            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form
                onSubmit={handleSendMessage}
                className="p-6 bg-[#f8f8f8] border-t border-gray-100"
            >
                <div className="flex gap-3">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="h-14 bg-[#f9fafb] border-0 rounded-2xl focus-visible:ring-1 focus-visible:ring-[#2d5a4c] font-medium"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        className="h-14 w-14 bg-[#2d5a4c] hover:bg-[#1a3a3a] rounded-2xl text-white shadow-lg hover:shadow-[#2d5a4c]/20 transition-all flex items-center justify-center p-0"
                        disabled={isLoading || !input.trim()}
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <Send className="w-6 h-6" />
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default SupportChat;
