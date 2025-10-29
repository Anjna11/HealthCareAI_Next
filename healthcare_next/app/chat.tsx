'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea"

export default function Chat({ onChange }: { onChange: (val: string) => void }) {
    
    const [text, setText] = useState("");

    const handleSend = async () => {
      if (!text.trim()) return;
    
      try {
        const res = await fetch('http://127.0.0.1:8000/message', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
    
        const data = await res.json();
    
        if (data.error) {
          alert("❌ " + data.error);
          return;
        }
    
        if (data.message) {
          alert("ℹ️ " + data.message);
          return;
        }
    
        alert("✅ Success");
    
      } catch (err) {
        alert("⚠️ Server not responding");
      }
    
      setText("");
      onChange("Demo");
    };
    
    
    return (
<div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg shadow-md max-w-md mx-auto">
  <p className="text-lg font-heading text-gray-800"
  style={{ fontFamily: "'Poppins', sans-serif"}}>
    How can I help you?
  </p>

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