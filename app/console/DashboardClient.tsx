"use client";

import { useEffect, useState } from "react";

// ── Konami Code Easter Egg ────────────────────────────────────────────────────
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

// ── Click-the-logo Easter Eggs ────────────────────────────────────────────────
const SECRET_MESSAGES = [
    "🎸 it goes to 11",
    "🥁 the drummer showed up on time",
    "🎤 check 1... check 1, 2...",
    "🎛️ gain before beauty",
    "🚐 we live in a van down by the river",
    "📼 always record rehearsals",
    "🎸 no brown M&Ms",
    "🎵 it's not about the destination, it's about the 14-hour drive",
    "🔊 if it's too loud you're too old",
    "🎚️ the bass is the foundation",
    "🎹 every band needs keys. fight me.",
    "💡 don't look at the spot",
    "🛻 someone help me load the 4x12",
    "📻 tune to KBGA 89.9",
    "🤘 \\ m / ___( \\ m /",
];

export default function DashboardClient() {
    const [konamiIndex, setKonamiIndex] = useState(0);
    const [toast, setToast] = useState<string | null>(null);
    const [secretMode, setSecretMode] = useState(false);

    // Konami code listener
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === KONAMI[konamiIndex]) {
                const next = konamiIndex + 1;
                if (next === KONAMI.length) {
                    setSecretMode(true);
                    setToast("🎸 CHEAT CODE ACTIVATED. You found the easter egg. Extra reverb unlocked.");
                    setTimeout(() => setToast(null), 4000);
                    setKonamiIndex(0);
                } else {
                    setKonamiIndex(next);
                }
            } else {
                setKonamiIndex(0);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [konamiIndex]);

    // Random toast on shift+click anywhere
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!e.shiftKey) return;
            const msg = SECRET_MESSAGES[Math.floor(Math.random() * SECRET_MESSAGES.length)];
            setToast(msg);
            setTimeout(() => setToast(null), 3000);
        };
        window.addEventListener("click", handler);
        return () => window.removeEventListener("click", handler);
    }, []);

    return (
        <>
            {/* Secret mode — scanline overlay */}
            {secretMode && (
                <div
                    className="fixed inset-0 pointer-events-none z-[999] opacity-[0.03]"
                    style={{
                        backgroundImage: "repeating-linear-gradient(0deg, rgba(0,255,0,0.5) 0px, transparent 1px, transparent 3px)",
                        animation: "scan 8s linear infinite",
                    }}
                    aria-hidden
                />
            )}

            {/* Toast notification */}
            {toast && (
                <div
                    className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-full text-sm font-semibold shadow-2xl transition-all"
                    style={{
                        backgroundColor: "var(--ct-bg-2)",
                        border: "1px solid var(--ct-border)",
                        color: "var(--ct-text)",
                        boxShadow: "0 8px 32px var(--ct-glow)",
                        animation: "slideUp 0.3s ease",
                    }}>
                    {toast}
                </div>
            )}

            <style>{`
                @keyframes scan {
                    0% { background-position: 0 0; }
                    100% { background-position: 0 100vh; }
                }
                @keyframes slideUp {
                    from { transform: translateX(-50%) translateY(12px); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0px); opacity: 1; }
                }
            `}</style>
        </>
    );
}
