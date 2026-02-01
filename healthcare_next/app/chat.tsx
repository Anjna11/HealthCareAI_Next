'use client';

import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

type ConversationState = "idle" | "awaiting_doctor";

export default function Chat({ onChange }: { onChange: (val: string) => void }) {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [state, setState] = useState<ConversationState>("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // fit content
    }
  }, [text]);

  const handleSend = async () => {
    if (!text.trim()) return;

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

      setResponse(data.message + (data.reasoning ? "\n" + data.reasoning : ""));
    } catch (err) {
      alert("⚠️ Server not responding");
    }

    setText("");
    onChange("Demo");
  };

  // Press Enter to send, Shift+Enter for newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="flex flex-col gap-2 p-2 pl-50 bg-gray-50 rounded-lg shadow-md max-w-5xl mx-auto"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <h3 className="text-lg font-semibold text-[#11224E] tracking-wide">
        How can I help you?
      </h3>

      <div className="-my-1">
        <hr className="border-[#F87B1B]/30" />
      </div>

      {response && (
        <p
          className="text-gray-800 text-justify leading-relaxed whitespace-pre-wrap"
          style={{ textAlign: "justify", hyphens: "auto" }}
        >
          {response}
        </p>
      )}

      {/* ChatGPT-style input with arrow button */}
      <div className="flex items-end w-full border border-gray-200 rounded-2xl focus-within:ring-1 focus-within:ring-[#F87B1B]/80 p-2 bg-white">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            state === "awaiting_doctor"
              ? "Enter doctor number from the list..."
              : "Type something..."
          }
          className="flex-1 resize-none overflow-hidden px-4 py-2 text-gray-700 text-lg placeholder:text-gray-400 rounded-2xl focus:outline-none font-body"
        />

        <button
          onClick={handleSend}
          className="ml-2 bg-[#F87B1B] hover:bg-[#e67618] text-white p-2 rounded-full flex-shrink-0 transition-all duration-200 ease-in-out"
        >
          {/* Up arrow icon */}
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
