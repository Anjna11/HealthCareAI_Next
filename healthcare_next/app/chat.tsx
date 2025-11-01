'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Chat({ onChange }: { onChange: (val: string) => void }) {
  const [text, setText] = useState("");
  const [reponse, setReponse] = useState("")

  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (data.error) {
        setReponse(data.message + "\n" + data.reasoning)
        // alert("❌ " + data.error + "\n\n🧠 Reasoning: " + (data.reasoning || "No reasoning provided."));
        return;
      }

      if (data.message) {
        setReponse(data.message + "\n" + data.reasoning)
        // Show both message and reasoning if available
        // alert(
        //   "💬 " + data.message +
        //   (data.reasoning ? "\n\n🧠 Reasoning: " + data.reasoning : "")
        // );
        return;
      }

      alert("✅ Success\n\n🧠 Reasoning: " + (data.reasoning || "No reasoning provided."));
    } catch (err) {
      alert("⚠️ Server not responding");
    }

    setText("");
    onChange("Demo");
  };

  return (
    <div className="flex flex-col gap-5 p-5 bg-gray-50 rounded-lg shadow-md max-w-md mx-auto"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}>

      <h3 className="text-lg font-semibold text-[#11224E] tracking-wide">
        How can I help you?
      </h3>

    <div className="-my-1">
      <hr className="border-[#F87B1B]/30" />
    </div>

    {reponse && (
    <p
      className="text-gray-800 text-justify leading-relaxed"
      style={{ textAlign: 'justify', hyphens: 'auto' }}>
      {reponse}
    </p>
    )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
        focus:ring-2 font-body text-gray-700 text-lg resize-none h-32 placeholder:text-sm placeholder:text-gray-400"
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
