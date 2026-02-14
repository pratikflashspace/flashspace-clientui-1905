import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Message } from "@/pages/affiliatePortal/AffiliateSupport"; // Import the type from parent

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
        <div className="flex flex-col h-[600px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm text-[#5bb09c]">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">
                            FlashSpace AI Assistant
                        </h4>
                        <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />{" "}
                            Online
                        </p>
                    </div>
                </div>
                <span className="text-[10px] font-bold bg-[#5bb09c]/10 text-[#5bb09c] px-2 py-1 rounded-md uppercase tracking-wider">
                    AI Powered
                </span>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth"
            >
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                        <div
                            className={`p-2 rounded-lg border shrink-0 ${msg.role === "user" ? "bg-[#5bb09c] text-white" : "bg-gray-50 text-gray-700"}`}
                        >
                            {msg.role === "user" ? (
                                <User className="w-4 h-4" />
                            ) : (
                                <Bot className="w-4 h-4" />
                            )}
                        </div>
                        <div
                            className={`max-w-[80%] space-y-1 ${msg.role === "user" ? "text-right" : ""}`}
                        >
                            <div
                                className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    msg.role === "user"
                                        ? "bg-[#5bb09c] text-white rounded-tr-none"
                                        : "bg-gray-50 text-gray-700 rounded-tl-none border border-gray-100"
                                }`}
                            >
                                {msg.text}
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium px-1">
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
                className="p-4 bg-gray-50/30 border-t border-gray-100"
            >
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="bg-white border-gray-200 focus-visible:ring-[#5bb09c]"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        className="bg-[#5bb09c] hover:bg-[#4a9b89] px-6 text-white"
                        disabled={isLoading || !input.trim()}
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default SupportChat;
