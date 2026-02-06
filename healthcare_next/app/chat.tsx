'use client';

import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { HeartPulse, User } from 'lucide-react'; 

type ConversationState = "idle" | "awaiting_doctor";
type Message = { role: 'user' | 'assistant'; content: string };

export default function Chat({ onChange }: { onChange: (val: string) => void }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, setState] = useState<ConversationState>("idle");
  const [hasStarted, setHasStarted] = useState(false); // Track if chat has started
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // For auto-scroll

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // fit content
    }
  }, [text]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;

    // Start the chat on first send (after user writes and sends)
    if (!hasStarted) setHasStarted(true);

    // Add user message
    const userMessage: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("http://127.0.0.1:8000/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (data.message && data.message.includes("Please choose a doctor")) {
        setState("awaiting_doctor");
      } else if (state === "awaiting_doctor") {
        setState("idle");
      }

      // Add assistant response
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message + (data.reasoning ? "\n" + data.reasoning : "")
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      // Add error message
      const errorMessage: Message = { role: 'assistant', content: "⚠️ Server not responding" };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setText("");
    onChange("Demo");
  };

  // Handle input change - no longer starts chat here
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  // Press Enter to send, Shift+Enter for newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col p-2.5 h-full">
      {/* Header - Show only when chat has started */}
      {hasStarted && (
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-3">
            <HeartPulse className="w-6 h-6 text-[#F87B1B]/80" />
            <div>
              <h3
                className="text-base font-extrabold tracking-tight"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                HealthCareAI Chat
              </h3>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">Assistant</div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && !hasStarted ? (
          
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <HeartPulse className="w-10 h-10 text-[#F87B1B]" /> 
            <h2
              className="text-2xl font-extrabold text-foreground"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              DHANOMI
            </h2>
            <p
              className="text-lg text-muted-foreground"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              HealthCare.AI Chat
            </p>
            <p className="text-sm text-muted-foreground max-w-md">
              Your AI assistant for healthcare management. Ask me to add patients, book appointments, or get insights!
            </p>
          </div>
        ) : (
          
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-md text-sm shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-card text-foreground  pl-3'
                      : 'bg-card text-card-foreground pl-3'
                  }`}
                >

                <div className="flex items-start gap-2">
                  {/* <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${
                    msg.role === 'user' ? 'bg-[#F87B1B] text-white' : 'bg-[#F87B1B] text-white'
                  }`}>
                    {msg.role === 'user' ? <User className="w-3 h-3" /> : <HeartPulse className="w-4.6 h-3" />}
                  </div> */}
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
               </div>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Auto-scroll anchor */}
        </div>
      )}
    </div>

      <div className="flex w-full border rounded-xl focus-within:ring-1 focus-within:ring-ring p-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInputChange} 
          onKeyDown={handleKeyDown}
          placeholder={
            state === "awaiting_doctor"
              ? "Enter doctor number from the list..."
              : "Ask DHANOMI..."
          }
          className="flex-1 resize-none px-1 py-1 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none"
          style={{ fontFamily: "'Inter', sans-serif" }}
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="ml-2 text-white p-1.5 rounded transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}