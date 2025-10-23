'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Chat() {
    
    const [text, setText] = useState("");

    const handleSend = async () => {
        if(!text) return;
        await fetch('http://127.0.0.1:8000/message', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });
        setText("");
    }
    
    return (
        <div>
            <p>Messages</p>
            <Input
            value = {text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type something..."
            />
            <Button onClick={handleSend}>Send</Button>
        </div>
    );
}