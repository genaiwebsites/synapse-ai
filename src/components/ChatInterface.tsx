"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/context/AuthContext";
import { Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface() {
  const { accessToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || !accessToken) return;
    
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ query: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      if (reader) {
        let aiMessage = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          aiMessage += chunk;
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = aiMessage;
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].content = "Sorry, an error occurred while connecting to the GenAI brain.";
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[500px] border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] rounded-2xl bg-[rgba(12,12,18,0.85)] backdrop-blur-xl">
      <CardHeader className="border-b border-white/10 pb-4">
        <CardTitle className="text-white font-space font-medium text-lg flex items-center gap-2 tracking-tight">
          <Bot className="w-5 h-5 text-[#00F0FF]" />
          Synapse AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.length === 0 && (
            <div className="text-center text-zinc-500 mt-10 font-sans">
              Ask me about your quality reports, recent emails, or manufacturing data.
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && <div className="w-8 h-8 rounded-full bg-[#00F0FF]/10 flex items-center justify-center flex-shrink-0 text-[#00F0FF] border border-[#00F0FF]/20"><Bot className="w-4 h-4" /></div>}
              <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm ${msg.role === "user" ? "bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 rounded-br-none shadow-[0_0_15px_rgba(0,240,255,0.15)]" : "bg-white/5 text-zinc-300 border border-white/5 rounded-bl-none"}`}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert max-w-none break-words">
                    <ReactMarkdown>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.content === "" && (
             <div className="flex gap-3 justify-start">
               <div className="w-8 h-8 rounded-full bg-[#00F0FF]/10 flex items-center justify-center flex-shrink-0 text-[#00F0FF] border border-[#00F0FF]/20"><Bot className="w-4 h-4" /></div>
               <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-zinc-500 rounded-bl-none text-sm animate-pulse">
                 Thinking...
               </div>
             </div>
          )}
        </div>
        <div className="flex gap-2 pt-2 border-t border-white/5 mt-auto">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about your data..."
            className="flex-1 rounded-xl bg-black/40 border-white/10 text-white focus-visible:ring-[#00F0FF] placeholder:text-zinc-600 shadow-inner"
            disabled={isLoading || !accessToken}
          />
          <Button onClick={sendMessage} disabled={isLoading || !accessToken || !input.trim()} className="rounded-xl bg-[#00F0FF]/10 text-[#00F0FF] hover:bg-[#00F0FF]/20 border border-[#00F0FF]/30 w-12 p-0 flex items-center justify-center transition-all shadow-[0_0_10px_rgba(0,240,255,0.1)] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
