"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, Sparkles, ChevronDown, Music2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const STARTERS = [
    "Build me a 45-min setlist that opens strong and ends with a banger",
    "What are the biggest red flags in a venue contract?",
    "Explain the Nashville Number System",
    "What should I charge for a 3-hour wedding gig?",
    "How do I copyright my songs properly?",
    "What's a good chord progression for a melancholic indie song?",
];

export default function ARIAChat() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasNew, setHasNew] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (open) {
            setHasNew(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const send = async (text?: string) => {
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
            setMessages([...history, { role: "assistant", content: data.content || "Something went wrong — try again." }]);
            if (!open) setHasNew(true);
        } catch {
            setMessages([...history, { role: "assistant", content: "Connection issue. Give it another shot." }]);
        }
        setLoading(false);
    };

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
    };

    return (
        <>
            {/* Floating button */}
            <motion.button
                onClick={() => setOpen(o => !o)}
                className="fixed bottom-20 right-5 z-50 w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl transition-all hover:scale-110"
                style={{
                    background: "linear-gradient(135deg, #00f2f2, #a78bfa)",
                    boxShadow: "0 0 24px rgba(0,242,242,0.35)",
                }}
                whileTap={{ scale: 0.95 }}
                title="Ask ARIA"
            >
                {open ? <ChevronDown size={18} className="text-black" /> : <Sparkles size={18} className="text-black" />}
                {hasNew && !open && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-black" />
                )}
            </motion.button>

            {/* Chat panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.97 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed bottom-36 right-5 z-50 flex flex-col rounded-2xl overflow-hidden"
                        style={{
                            width: "clamp(320px, 90vw, 420px)",
                            height: "clamp(400px, 60vh, 580px)",
                            backgroundColor: "rgba(8,8,12,0.97)",
                            border: "1px solid rgba(0,242,242,0.2)",
                            boxShadow: "0 0 60px rgba(0,242,242,0.1), 0 20px 60px rgba(0,0,0,0.5)",
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0"
                            style={{ borderColor: "rgba(0,242,242,0.12)", background: "rgba(0,242,242,0.03)" }}>
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: "linear-gradient(135deg, #00f2f2, #a78bfa)", boxShadow: "0 0 12px rgba(0,242,242,0.3)" }}>
                                <Music2 size={14} className="text-black" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black" style={{ color: "#00f2f2" }}>ARIA</p>
                                <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                                    Music attorney · Theory nerd · Booking pro
                                </p>
                            </div>
                            <button onClick={() => setOpen(false)}
                                className="w-6 h-6 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                                style={{ color: "rgba(255,255,255,0.3)" }}>
                                <X size={13} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: "thin" }}>
                            {messages.length === 0 ? (
                                <div className="space-y-3">
                                    <p className="text-xs text-center py-2" style={{ color: "rgba(255,255,255,0.25)" }}>
                                        Hey — what&apos;s on your mind?
                                    </p>
                                    {STARTERS.map(s => (
                                        <button key={s} onClick={() => send(s)}
                                            className="w-full text-left px-3 py-2.5 rounded-xl text-[11px] leading-snug border transition-all hover:border-cyan-500/30 hover:bg-cyan-500/5"
                                            style={{ borderColor: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {messages.map((m, i) => (
                                        <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                            <div className={`max-w-[85%] px-3 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap`}
                                                style={m.role === "user"
                                                    ? { backgroundColor: "rgba(0,242,242,0.12)", color: "#fff", border: "1px solid rgba(0,242,242,0.2)", borderBottomRightRadius: "4px" }
                                                    : { backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderBottomLeftRadius: "4px" }
                                                }>
                                                {m.content}
                                            </div>
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="flex justify-start">
                                            <div className="px-3 py-2.5 rounded-2xl border flex items-center gap-2"
                                                style={{ backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.08)" }}>
                                                <Loader2 size={12} className="animate-spin" style={{ color: "#00f2f2" }} />
                                                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>ARIA is thinking...</span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div className="px-3 pb-3 pt-2 flex-shrink-0 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                            <div className="flex gap-2 items-end">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKey}
                                    placeholder="Ask about setlists, contracts, theory..."
                                    rows={1}
                                    className="flex-1 resize-none rounded-xl px-3 py-2.5 text-xs outline-none"
                                    style={{
                                        backgroundColor: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(0,242,242,0.15)",
                                        color: "#fff",
                                        maxHeight: "80px",
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = "rgba(0,242,242,0.4)"}
                                    onBlur={e => e.currentTarget.style.borderColor = "rgba(0,242,242,0.15)"}
                                />
                                <button onClick={() => send()} disabled={!input.trim() || loading}
                                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:opacity-90 disabled:opacity-30"
                                    style={{ background: "linear-gradient(135deg, #00f2f2, #a78bfa)" }}>
                                    <Send size={13} className="text-black" />
                                </button>
                            </div>
                            <p className="text-[8px] text-center mt-1.5" style={{ color: "rgba(255,255,255,0.15)" }}>
                                ARIA · Powered by xAI · Not legal advice
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
