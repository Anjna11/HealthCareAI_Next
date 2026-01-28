'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";

type ConversationState = "idle" | "awaiting_doctor";

export default function Chat({ onChange }: { onChange: (val: string) => void }) {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [state, setState] = useState<ConversationState>("idle"); // conversation state

  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      // Check if backend returned doctor selection prompt
      if (data.message && data.message.includes("Please choose a doctor")) {
        setState("awaiting_doctor"); // waiting for doctor selection
      } else if (state === "awaiting_doctor") {
        // After selecting doctor, reset state
        setState("idle");
      }

      // Update response
      setResponse(data.message + (data.reasoning ? "\n" + data.reasoning : ""));

    } catch (err) {
      alert("⚠️ Server not responding");
    }

    setText("");
    onChange("Demo");
  };

  return (
    <div
      className="flex flex-col gap-5 p-5 bg-gray-50 rounded-lg shadow-md max-w-md mx-auto"
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

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          state === "awaiting_doctor"
            ? "Enter doctor number from the list..."
            : "Type something..."
        }
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 font-body text-gray-700 text-lg resize-none h-32 placeholder:text-sm placeholder:text-gray-400"
      />

      <Button
        onClick={handleSend}
        className="w-full py-2 rounded-md bg-green-500 text-white font-body font-medium primary-button"
      >
        Send
      </Button>
    </div>
  );
}
