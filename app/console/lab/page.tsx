"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
    Zap, Send, Loader2, Sparkles, ChevronDown, Music2,
    ListMusic, Guitar, FileText, ArrowRight, Copy, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message { role: "user" | "assistant"; content: string; }

const QUICK_TOOLS = [
    { icon: ListMusic, label: "Setlist Generator", prompt: "Build me a 45-minute setlist. Ask me about my genre, energy preferences, and how many originals vs covers I want." },
    { icon: Guitar, label: "Chord Theory", prompt: "I have a music theory question. What would you like to know?" },
    { icon: Zap, label: "Contract Red Flags", prompt: "I need to review a venue contract. What are the biggest red flags I should watch for in a gig contract?" },
    { icon: FileText, label: "Press Release", prompt: "Help me write a press release for a new show or release. Tell me what you're announcing and I'll draft it." },
];

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };
    return (
        <button onClick={copy}
            className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: "rgba(0,242,242,0.1)", color: "#00f2f2" }}>
            {copied ? <Check size={10} /> : <Copy size={10} />}
        </button>
    );
}

export default function LabPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

    const send = useCallback(async (text?: string) => {
        const content = text ?? input.trim();
        if (!content || loading) return;
        setInput("");
        const userMsg: Message = { role: "user", content };
        const history = [...messages, userMsg];
        setMessages(history);
        setLoading(true);
        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: history }),
            });
            const data = await res.json();
            setMessages([...history, { role: "assistant", content: data.content || "Try again." }]);
        } catch {
            setMessages([...history, { role: "assistant", content: "Connection issue. Try again." }]);
        }
        setLoading(false);
    }, [messages, input, loading]);

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--ct-bg)" }}>
            {/* Header */}
            <div className="border-b px-8 py-5 flex-shrink-0" style={{ borderColor: "var(--ct-border)" }}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #00f2f2, #a78bfa)", boxShadow: "0 0 16px rgba(0,242,242,0.3)" }}>
                        <Sparkles size={16} className="text-black" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black" style={{ color: "var(--ct-text)" }}>The Lab</h1>
                        <p className="text-[11px]" style={{ color: "var(--ct-text-muted)" }}>
                            ARIA — your AI music attorney, theory professor & booking agent
                        </p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[11px]" style={{ color: "var(--ct-text-muted)" }}>ARIA online</span>
                    </div>
                </div>

                {/* Quick tools */}
                <div className="flex gap-2 mt-4 flex-wrap">
                    {QUICK_TOOLS.map(t => {
                        const Icon = t.icon;
                        return (
                            <button key={t.label} onClick={() => send(t.prompt)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all hover:border-cyan-500/30 hover:bg-cyan-500/5"
                                style={{ borderColor: "rgba(0,242,242,0.12)", color: "rgba(255,255,255,0.55)", backgroundColor: "rgba(0,242,242,0.03)" }}>
                                <Icon size={12} style={{ color: "#00f2f2" }} /> {t.label} <ArrowRight size={10} />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4" style={{ scrollbarWidth: "thin" }}>
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                        <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, rgba(0,242,242,0.1), rgba(167,139,250,0.1))", border: "1px solid rgba(0,242,242,0.15)" }}>
                            <Music2 size={28} style={{ color: "#00f2f2" }} />
                        </div>
                        <p className="text-base font-bold mb-2" style={{ color: "var(--ct-text)" }}>Ask ARIA anything</p>
                        <p className="text-sm max-w-md" style={{ color: "var(--ct-text-muted)" }}>
                            Setlists, contracts, music theory, booking rates, publishing deals, band dynamics —
                            ARIA has opinions on all of it.
                        </p>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                        {m.role === "assistant" && (
                            <div className="w-7 h-7 rounded-xl flex-shrink-0 mr-2 mt-0.5 flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg, #00f2f2, #a78bfa)" }}>
                                <Sparkles size={12} className="text-black" />
                            </div>
                        )}
                        <div className={`relative group max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap`}
                            style={m.role === "user"
                                ? { backgroundColor: "rgba(0,242,242,0.1)", color: "#f0f0f0", border: "1px solid rgba(0,242,242,0.15)", borderBottomRightRadius: "4px" }
                                : { backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.88)", border: "1px solid rgba(255,255,255,0.07)", borderBottomLeftRadius: "4px" }
                            }>
                            {m.content}
                            {m.role === "assistant" && <CopyButton text={m.content} />}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start items-center gap-2">
                        <div className="w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, #00f2f2, #a78bfa)" }}>
                            <Sparkles size={12} className="text-black" />
                        </div>
                        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border"
                            style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.07)" }}>
                            <Loader2 size={13} className="animate-spin" style={{ color: "#00f2f2" }} />
                            <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>ARIA is thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="border-t px-6 py-4 flex-shrink-0" style={{ borderColor: "var(--ct-border)", backgroundColor: "rgba(0,0,0,0.3)" }}>
                <div className="flex gap-3 items-end max-w-4xl mx-auto">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder="Ask about setlists, contracts, theory, rates, band drama..."
                        rows={2}
                        className="flex-1 resize-none rounded-xl px-4 py-3 text-sm outline-none"
                        style={{
                            backgroundColor: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(0,242,242,0.15)",
                            color: "#fff",
                            maxHeight: "120px",
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = "rgba(0,242,242,0.4)"}
                        onBlur={e => e.currentTarget.style.borderColor = "rgba(0,242,242,0.15)"}
                    />
                    <button onClick={() => send()} disabled={!input.trim() || loading}
                        className="h-10 px-5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-30"
                        style={{ background: "linear-gradient(135deg, #00f2f2, #a78bfa)", color: "#000" }}>
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        Send
                    </button>
                </div>
                <p className="text-center text-[9px] mt-2" style={{ color: "rgba(255,255,255,0.12)" }}>
                    ARIA · Powered by xAI Grok · Not legal advice · ↵ Enter to send
                </p>
            </div>
        </div>
    );
}
