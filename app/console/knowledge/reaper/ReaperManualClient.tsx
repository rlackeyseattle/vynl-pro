"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Search, Copy, Check, ChevronRight, ExternalLink, Zap, Info,
    BookOpen, Target, Keyboard, Lightbulb, Link2,
} from "lucide-react";
import {
    TOC_SECTIONS, SHORTCUTS, TIPS, SHORTCUT_CATEGORIES,
    type ShortcutCategory,
} from "./data";

// ─── Pill badge ────────────────────────────────────────────────────────────
function LevelBadge({ level }: { level: "beginner" | "intermediate" | "pro" }) {
    const map = {
        beginner: { label: "Beginner", color: "#34d399" },
        intermediate: { label: "Intermediate", color: "#f59e0b" },
        pro: { label: "Pro", color: "#f472b6" },
    };
    const { label, color } = map[level];
    return (
        <span className="text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0"
            style={{ backgroundColor: color + "22", color, border: `1px solid ${color}44` }}>
            {label}
        </span>
    );
}

// ─── Kbd component ─────────────────────────────────────────────────────────
function Kbd({ children }: { children: React.ReactNode }) {
    return (
        <kbd className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold"
            style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--ct-accent)" }}>
            {children}
        </kbd>
    );
}

// ─── Section wrapper ───────────────────────────────────────────────────────
function Section({ id, emoji, title, children }: { id: string; emoji: string; title: string; children: React.ReactNode }) {
    return (
        <section id={id} className="mb-14 scroll-mt-8">
            <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{emoji}</span>
                <h2 className="text-xl font-black tracking-tight" style={{ color: "var(--ct-text)" }}>{title}</h2>
            </div>
            {children}
        </section>
    );
}

// ─── Callout box ──────────────────────────────────────────────────────────
function ProTip({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex gap-3 p-4 rounded-xl my-4"
            style={{ backgroundColor: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.18)" }}>
            <Zap size={14} className="flex-shrink-0 mt-0.5" style={{ color: "var(--ct-accent)" }} />
            <p className="text-sm leading-relaxed" style={{ color: "var(--ct-text-muted)" }}>{children}</p>
        </div>
    );
}

function Note({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex gap-3 p-4 rounded-xl my-4"
            style={{ backgroundColor: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.18)" }}>
            <Info size={14} className="flex-shrink-0 mt-0.5 text-amber-400" />
            <p className="text-sm leading-relaxed" style={{ color: "var(--ct-text-muted)" }}>{children}</p>
        </div>
    );
}

// ─── Main component ────────────────────────────────────────────────────────
export default function ReaperManualClient() {
    const [activeSection, setActiveSection] = useState("getting-started");
    const [shortcutSearch, setShortcutSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<ShortcutCategory | "All">("All");
    const [os, setOs] = useState<"windows" | "mac">("windows");
    const [copied, setCopied] = useState<string | null>(null);
    const [readSections, setReadSections] = useState<Set<string>>(new Set());
    const mainRef = useRef<HTMLDivElement>(null);

    // Restore progress from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem("reaper-manual-read");
            if (saved) setReadSections(new Set(JSON.parse(saved)));
        } catch { }
    }, []);

    // Track active section via IntersectionObserver
    useEffect(() => {
        const obs = new IntersectionObserver((entries) => {
            for (const e of entries) {
                if (e.isIntersecting) setActiveSection(e.target.id);
            }
        }, { rootMargin: "-20% 0px -70% 0px" });
        TOC_SECTIONS.forEach(s => {
            const el = document.getElementById(s.id);
            if (el) obs.observe(el);
        });
        return () => obs.disconnect();
    }, []);

    const markRead = (id: string) => {
        const next = new Set([...readSections, id]);
        setReadSections(next);
        try { localStorage.setItem("reaper-manual-read", JSON.stringify([...next])); } catch { }
    };

    const copyKey = (text: string, id: string) => {
        navigator.clipboard.writeText(text).catch(() => { });
        setCopied(id);
        setTimeout(() => setCopied(null), 1200);
    };

    const filteredShortcuts = SHORTCUTS.filter(s => {
        const matchesCat = activeCategory === "All" || s.category === activeCategory;
        const q = shortcutSearch.toLowerCase();
        const matchesSearch = !q || s.action.toLowerCase().includes(q) ||
            s.windows.toLowerCase().includes(q) || s.mac.toLowerCase().includes(q);
        return matchesCat && matchesSearch;
    });

    const progress = Math.round((readSections.size / TOC_SECTIONS.length) * 100);

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: "var(--ct-bg)" }}>
            {/* ── Left TOC ─── */}
            <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 sticky top-0 h-screen overflow-y-auto py-8 px-4"
                style={{ borderRight: "1px solid var(--ct-border)", backgroundColor: "var(--ct-bg-2)" }}>
                <div className="flex items-center gap-2 mb-6 px-2">
                    <BookOpen size={14} style={{ color: "var(--ct-accent)" }} />
                    <p className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--ct-text-muted)" }}>
                        Reaper Manual
                    </p>
                </div>

                {/* Progress */}
                <div className="mb-6 px-2">
                    <div className="flex justify-between mb-1">
                        <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--ct-text-muted)" }}>Progress</p>
                        <p className="text-[9px] font-bold" style={{ color: "var(--ct-accent)" }}>{progress}%</p>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                        <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${progress}%`, background: "linear-gradient(to right, var(--ct-accent), var(--ct-accent-2))" }} />
                    </div>
                </div>

                <nav className="space-y-0.5">
                    {TOC_SECTIONS.map(s => (
                        <button key={s.id} onClick={() => {
                            document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
                            markRead(s.id);
                        }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all text-[11px] font-semibold group ${activeSection === s.id ? "text-white" : "text-neutral-500 hover:text-neutral-200"}`}
                            style={activeSection === s.id ? { backgroundColor: "rgba(255,255,255,0.06)" } : {}}>
                            <span className="text-sm">{s.emoji}</span>
                            <span className="flex-1">{s.label}</span>
                            {readSections.has(s.id) && <Check size={10} style={{ color: "var(--ct-accent)" }} />}
                            {activeSection === s.id && <ChevronRight size={10} style={{ color: "var(--ct-accent)" }} />}
                        </button>
                    ))}
                </nav>

                {/* OS toggle */}
                <div className="mt-auto pt-6 px-2">
                    <p className="text-[9px] uppercase tracking-wider mb-2" style={{ color: "var(--ct-text-muted)" }}>Shortcuts for</p>
                    <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid var(--ct-border)" }}>
                        {(["windows", "mac"] as const).map(p => (
                            <button key={p} onClick={() => setOs(p)}
                                className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all"
                                style={os === p
                                    ? { backgroundColor: "var(--ct-accent)", color: "#000" }
                                    : { color: "var(--ct-text-muted)" }}>
                                {p === "windows" ? "Win" : "Mac"}
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* ── Main Content ─── */}
            <main ref={mainRef} className="flex-1 min-w-0 px-6 md:px-10 py-10 overflow-y-auto">
                {/* Page header */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-4xl">🎛️</span>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--ct-text)" }}>
                                Reaper DAW Manual
                            </h1>
                            <p className="text-sm" style={{ color: "var(--ct-text-muted)" }}>
                                Interactive guide · 200+ Shortcuts · Pro Tips & Workflow Secrets
                            </p>
                        </div>
                    </div>
                    {/* Mobile OS toggle */}
                    <div className="flex items-center gap-3 mt-4 lg:hidden">
                        <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>Shortcuts for:</p>
                        <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid var(--ct-border)" }}>
                            {(["windows", "mac"] as const).map(p => (
                                <button key={p} onClick={() => setOs(p)}
                                    className="px-4 py-1 text-[10px] font-bold uppercase tracking-wide transition-all"
                                    style={os === p ? { backgroundColor: "var(--ct-accent)", color: "#000" } : { color: "var(--ct-text-muted)" }}>
                                    {p === "windows" ? "Windows" : "Mac"}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── GETTING STARTED ─── */}
                <Section id="getting-started" emoji="🚀" title="Getting Started">
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--ct-text-muted)" }}>
                        Reaper (Rapid Environment for Audio Production, Engineering, and Recording) is a fully featured DAW by Cockos, available for a discounted license of ~$60 for personal use. It supports audio, MIDI, video, and virtually unlimited tracks.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 mb-4">
                        {[
                            { label: "Download Reaper", desc: "Free 60-day trial at reaper.fm", href: "https://www.reaper.fm/download.php" },
                            { label: "SWS Extension", desc: "Essential free plugin pack", href: "https://www.sws-extension.org/" },
                            { label: "ReaPack", desc: "Package manager for scripts", href: "https://reapack.com/" },
                            { label: "Official User Guide", desc: "PDF manual for v7+", href: "https://www.reaper.fm/userguide.php" },
                        ].map(l => (
                            <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                                className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.01] group"
                                style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid var(--ct-border)" }}>
                                <ExternalLink size={13} style={{ color: "var(--ct-accent)" }} className="flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-bold" style={{ color: "var(--ct-text)" }}>{l.label}</p>
                                    <p className="text-[10px]" style={{ color: "var(--ct-text-muted)" }}>{l.desc}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                    <ProTip>Install the SWS Extension immediately after Reaper — it adds hundreds of extra actions and dramatically expands what&apos;s possible.</ProTip>
                </Section>

                {/* ── INTERFACE ─── */}
                <Section id="interface" emoji="🖥️" title="Interface Overview">
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--ct-text-muted)" }}>
                        Reaper&apos;s UI is fully customizable. Every panel can be docked, floated, or resized.
                    </p>
                    <div className="space-y-3 mb-4">
                        {[
                            { name: "Track Control Panel (TCP)", desc: "Left panel. Shows track name, volume, pan, mute/solo, arm, FX button, and routing for each track." },
                            { name: "Arrange View (Timeline)", desc: "Center workspace. Drag, cut, and arrange media items (audio clips, MIDI items) here." },
                            { name: "Mixer (MCP)", desc: "Open with Ctrl+M. Traditional faders, sends, and bus routing. Mirrors the TCP." },
                            { name: "Transport Bar", desc: "Top toolbar. Play, stop, record, BPM, time signature, and position display." },
                            { name: "Dockers", desc: "Panels (Media Explorer, FX Browser, MIDI Editor) that snap to any edge of the main window." },
                        ].map(row => (
                            <div key={row.name} className="p-4 rounded-xl"
                                style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid var(--ct-border)" }}>
                                <p className="text-sm font-bold mb-1" style={{ color: "var(--ct-text)" }}>{row.name}</p>
                                <p className="text-xs leading-relaxed" style={{ color: "var(--ct-text-muted)" }}>{row.desc}</p>
                            </div>
                        ))}
                    </div>
                    <ProTip>In Reaper, <strong>there is no difference between track types</strong> — every track can host audio, MIDI, instruments, or video. This makes routing incredibly flexible.</ProTip>
                </Section>

                {/* ── RECORDING ─── */}
                <Section id="recording" emoji="🎙️" title="Recording">
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--ct-text-muted)" }}>
                        Set your audio interface in Preferences → Audio → Device. Then:
                    </p>
                    <ol className="space-y-2 mb-4">
                        {[
                            "Create a new track (Ctrl+T)",
                            "Click the red arm button on the track or press F7 — a blinking red dot means armed",
                            "Select the correct input channel on the track (left-click the input label in TCP)",
                            "Enable input monitoring (speaker icon) to hear yourself",
                            "Hit Ctrl+R to record. Press Space to stop.",
                        ].map((step, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--ct-text-muted)" }}>
                                <span className="font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                    style={{ backgroundColor: "var(--ct-accent)", color: "#000" }}>{i + 1}</span>
                                {step}
                            </li>
                        ))}
                    </ol>
                    <Note>Reaper quietly buffers ~30 seconds of MIDI input even when not recording. Recover last played notes via File → MIDI → Import Last MIDI Buffer.</Note>
                    <ProTip>Use the count-in (Shift+`) to get a bar of click before recording starts. Adjust count-in length in Project Settings → Metronome.</ProTip>
                </Section>

                {/* ── EDITING ─── */}
                <Section id="editing" emoji="✂️" title="Editing">
                    <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--ct-text-muted)" }}>
                        Reaper calls audio clips &quot;items.&quot; The primary editing tools live in the toolbar and are toggled by number keys.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 mb-4">
                        {[
                            { tool: "Normal/Pointer (F5)", desc: "Select and move items. Ctrl+drag to copy." },
                            { tool: "Split (S)", desc: "S key splits the item under the cursor or at the play cursor." },
                            { tool: "Ripple Edit (Alt+P)", desc: "Automatically slides all downstream items when you delete or move." },
                            { tool: "Crossfade", desc: "Overlap two items to create an auto-crossfade. Drag the edge to shape it." },
                            { tool: "Glue (G)", desc: "Merges selected items into a single item. Great after comping takes." },
                            { tool: "Slip Edit", desc: "Ctrl+drag item edge to slide audio content inside the item boundary." },
                        ].map(row => (
                            <div key={row.tool} className="p-3 rounded-xl"
                                style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid var(--ct-border)" }}>
                                <p className="text-xs font-bold mb-1" style={{ color: "var(--ct-accent)" }}>{row.tool}</p>
                                <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>{row.desc}</p>
                            </div>
                        ))}
                    </div>
                    <ProTip>Take comping: record multiple passes in loop with Ctrl+R. Each pass stacks as a new take lane. Open the take lane, select the best bits, and glue (G) them together.</ProTip>
                </Section>

                {/* ── MIXING ─── */}
                <Section id="mixing" emoji="🎚️" title="Mixing & FX">
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--ct-text-muted)" }}>
                        Open the mixer with Ctrl+M. Every track has a built-in FX chain, sends, and routing matrix.
                    </p>
                    <div className="space-y-3 mb-4">
                        {[
                            { h: "Adding Plugins", b: "Click the FX button on any track (TCP or mixer). Search by name or browse by format (VST3, VST, AU). Reaper ships with the Rea* suite: ReaEQ, ReaComp, ReaVerb, ReaDelay, ReaGate — all excellent." },
                            { h: "FX Chain Order", b: "Insert order matters. Typical chain: Gate → EQ → Compression → Saturation → Reverb/Delay send. You can drag plugins up/down to reorder." },
                            { h: "Save FX Chains", b: "In the FX window, click the FX Chain menu → Save FX Chain. Load it on any track across any project instantly." },
                            { h: "Parallel Processing", b: "Duplicate tracks or use multi-channel routing to blend a dry signal with a heavily processed one — classic parallel compression technique." },
                        ].map(row => (
                            <div key={row.h} className="p-4 rounded-xl"
                                style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid var(--ct-border)" }}>
                                <p className="text-sm font-bold mb-1.5" style={{ color: "var(--ct-text)" }}>{row.h}</p>
                                <p className="text-xs leading-relaxed" style={{ color: "var(--ct-text-muted)" }}>{row.b}</p>
                            </div>
                        ))}
                    </div>
                    <ProTip>Freeze CPU-heavy tracks: right-click track header → Freeze Tracks → Freeze to Stereo. Reaper renders the FX temporarily. Unfreeze anytime to re-edit.</ProTip>
                </Section>

                {/* ── MIDI ─── */}
                <Section id="midi" emoji="🎹" title="MIDI">
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--ct-text-muted)" }}>
                        Any track can hold MIDI items. Double-click a MIDI item to open the Piano Roll editor.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 mb-4">
                        {[
                            { h: "Piano Roll", b: "Draw mode (D) adds notes. Selection mode (Esc) selects/moves. Velocity lane is at the bottom. Ctrl+A selects all notes." },
                            { h: "Quantize", b: "Select notes and press Q. Choose grid size in the dropdown. Use 'Swing' for a groovy feel." },
                            { h: "MIDI CC", b: "Switch the bottom lane to view velocity, CC1, CC7, pitch bend, or any CC lane for automation drawing." },
                            { h: "Virtual Instruments", b: "Add a VSTi (synth/sampler) to the track FX chain. All MIDI from the track will be routed to the instrument." },
                            { h: "Step Sequencer", b: "Go to View → Step Sequencer for a grid-based drum programmer. Works with any drum VST." },
                            { h: "MIDI Learn", b: "Right-click any plugin knob → MIDI Learn. Map hardware knobs to plugin parameters for live control." },
                        ].map(row => (
                            <div key={row.h} className="p-3 rounded-xl"
                                style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid var(--ct-border)" }}>
                                <p className="text-xs font-bold mb-1" style={{ color: "var(--ct-accent)" }}>{row.h}</p>
                                <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>{row.b}</p>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* ── ROUTING ─── */}
                <Section id="routing" emoji="🔀" title="Routing & Buses">
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--ct-text-muted)" }}>
                        Reaper&apos;s routing is unmatched in flexibility. Every track can send to and receive from any other track via sends/receives without any dedicated &quot;bus track&quot; type.
                    </p>
                    <div className="space-y-3 mb-4">
                        {[
                            { h: "Folder Tracks (Buses)", b: "Drag tracks under a parent track in the TCP to create a folder. The parent now acts as a bus. Apply compression or EQ to the group. Click the small arrow icon on the parent to collapse." },
                            { h: "Sends & Receives", b: "Click the Route button on any track. Add a send to another track (e.g., reverb aux or drum bus). Set level and panning independently per send." },
                            { h: "Side-Chaining", b: "Add a send from the kick track to a bass track compressor (use auxiliary channels 3/4). In the compressor, set the side-chain input to channel 3/4. The kick ducks the bass." },
                            { h: "Master/Parent Send", b: "Control whether a track feeds the master bus via the checkbox in its routing dialog. Disable for tracks you want to route manually (e.g., headphone mixes)." },
                        ].map(row => (
                            <div key={row.h} className="p-4 rounded-xl"
                                style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid var(--ct-border)" }}>
                                <p className="text-sm font-bold mb-1.5" style={{ color: "var(--ct-text)" }}>{row.h}</p>
                                <p className="text-xs leading-relaxed" style={{ color: "var(--ct-text-muted)" }}>{row.b}</p>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* ── CUSTOMIZATION ─── */}
                <Section id="customization" emoji="⚙️" title="Customization">
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--ct-text-muted)" }}>
                        Reaper is almost entirely customizable — themes, toolbars, mouse behaviors, menus, and actions.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 mb-4">
                        {[
                            { h: "Action List (?)", b: "Every command is in here. Search, bind to a key, or chain multiple actions into a custom macro. Your #1 productivity tool." },
                            { h: "Custom Actions", b: "Group multiple actions into a single hotkey sequence. Example: 'Stop + unarm all tracks + rewind' on one key." },
                            { h: "Screensets", b: "Save window layouts as numbered screensets (Ctrl+F1–F9). Swap between recording layout, mixing layout, and mastering layout instantly." },
                            { h: "Mouse Modifiers", b: "Preferences → Editing Behavior → Mouse Modifiers. Redefine Ctrl+drag, Alt+drag on items, tracks, and the timeline." },
                            { h: "Themes", b: "Download community themes from forum.cockos.com. Drop the theme file into Resources/ColorThemes and select it in Preferences." },
                            { h: "ReaScript / JSFX", b: "Write Lua or EEL2 scripts to automate tasks. JSFX lets you build custom audio processors running inside ReaInsert." },
                        ].map(row => (
                            <div key={row.h} className="p-3 rounded-xl"
                                style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid var(--ct-border)" }}>
                                <p className="text-xs font-bold mb-1" style={{ color: "var(--ct-accent)" }}>{row.h}</p>
                                <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>{row.b}</p>
                            </div>
                        ))}
                    </div>
                    <ProTip>Track Templates let you save a track with all its FX, routing, and input settings. Right-click a track → Save Track as Template. Load it instantly in any future project.</ProTip>
                </Section>

                {/* ── HOTKEYS ─── */}
                <Section id="hotkeys" emoji="⌨️" title="Hotkey Cheat Sheet">
                    <div className="flex flex-col sm:flex-row gap-3 mb-5">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ct-text-muted)" }} />
                            <input
                                type="text"
                                placeholder="Search shortcuts..."
                                value={shortcutSearch}
                                onChange={e => setShortcutSearch(e.target.value)}
                                className="w-full pl-8 pr-4 py-2.5 rounded-xl text-sm bg-transparent focus:outline-none"
                                style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid var(--ct-border)", color: "var(--ct-text)" }}
                            />
                        </div>
                        {/* OS toggle (desktop duplicate inline) */}
                        <div className="flex rounded-xl overflow-hidden flex-shrink-0" style={{ border: "1px solid var(--ct-border)" }}>
                            {(["windows", "mac"] as const).map(p => (
                                <button key={p} onClick={() => setOs(p)}
                                    className="px-4 py-2 text-[10px] font-bold uppercase tracking-wide transition-all"
                                    style={os === p ? { backgroundColor: "var(--ct-accent)", color: "#000" } : { color: "var(--ct-text-muted)" }}>
                                    {p === "windows" ? "Windows" : "Mac"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category filter */}
                    <div className="flex flex-wrap gap-2 mb-5">
                        {(["All", ...SHORTCUT_CATEGORIES] as const).map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat as ShortcutCategory | "All")}
                                className="text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all"
                                style={activeCategory === cat
                                    ? { backgroundColor: "var(--ct-accent)", color: "#000" }
                                    : { backgroundColor: "rgba(255,255,255,0.04)", color: "var(--ct-text-muted)", border: "1px solid var(--ct-border)" }}>
                                {cat}
                            </button>
                        ))}
                    </div>

                    <p className="text-[9px] mb-3" style={{ color: "var(--ct-text-muted)" }}>
                        {filteredShortcuts.length} shortcuts · Click a shortcut to copy
                    </p>

                    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--ct-border)" }}>
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ backgroundColor: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--ct-border)" }}>
                                    <th className="text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--ct-text-muted)" }}>Action</th>
                                    <th className="text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--ct-text-muted)" }}>Shortcut</th>
                                    <th className="text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest hidden sm:table-cell" style={{ color: "var(--ct-text-muted)" }}>Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredShortcuts.map((s, i) => {
                                    const key = os === "windows" ? s.windows : s.mac;
                                    const uid = `${s.action}-${i}`;
                                    return (
                                        <tr key={uid}
                                            onClick={() => copyKey(key, uid)}
                                            className="cursor-pointer transition-all group"
                                            style={{
                                                borderBottom: i < filteredShortcuts.length - 1 ? "1px solid var(--ct-border)" : undefined,
                                                backgroundColor: "transparent",
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.025)")}
                                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                                            <td className="px-4 py-2.5 text-xs" style={{ color: "var(--ct-text)" }}>{s.action}</td>
                                            <td className="px-4 py-2.5">
                                                <div className="flex items-center gap-2">
                                                    <Kbd>{key}</Kbd>
                                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {copied === uid
                                                            ? <Check size={10} style={{ color: "var(--ct-accent)" }} />
                                                            : <Copy size={10} style={{ color: "var(--ct-text-muted)" }} />}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2.5 hidden sm:table-cell">
                                                <span className="text-[9px] px-2 py-0.5 rounded-full font-medium"
                                                    style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "var(--ct-text-muted)", border: "1px solid var(--ct-border)" }}>
                                                    {s.category}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredShortcuts.length === 0 && (
                            <p className="px-4 py-8 text-center text-sm" style={{ color: "var(--ct-text-muted)" }}>
                                No shortcuts found for &quot;{shortcutSearch}&quot;
                            </p>
                        )}
                    </div>
                </Section>

                {/* ── TIPS ─── */}
                <Section id="tips" emoji="💡" title="Tips & Tricks">
                    <div className="space-y-3">
                        {TIPS.map((tip, i) => (
                            <div key={i} className="p-5 rounded-2xl transition-all hover:scale-[1.005]"
                                style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid var(--ct-border)" }}>
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <p className="text-sm font-bold" style={{ color: "var(--ct-text)" }}>{tip.title}</p>
                                    <LevelBadge level={tip.level} />
                                </div>
                                <p className="text-xs leading-relaxed" style={{ color: "var(--ct-text-muted)" }}>{tip.body}</p>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* ── RESOURCES ─── */}
                <Section id="resources" emoji="📚" title="Resources & Links">
                    <div className="grid sm:grid-cols-2 gap-3">
                        {[
                            { name: "Reaper.fm Official", desc: "Downloads, changelog, forums", href: "https://www.reaper.fm" },
                            { name: "Cockos Forum", desc: "Official community & support", href: "https://forum.cockos.com" },
                            { name: "ReaTips.com", desc: "Ever-growing tips library", href: "https://www.reapertips.com" },
                            { name: "Reaper Blog", desc: "Tutorials and production guides", href: "https://reaper.blog" },
                            { name: "SWS Extension", desc: "Essential free extension pack", href: "https://www.sws-extension.org" },
                            { name: "ReaPack", desc: "Script & plugin package manager", href: "https://reapack.com" },
                            { name: "Kenny Gioia Tutorials", desc: "The definitive Reaper YouTube series", href: "https://www.youtube.com/@KennyGioia" },
                            { name: "Reaper Accessibility Wiki", desc: "Complete shortcut reference", href: "https://www.reaperaccessibility.com" },
                        ].map(l => (
                            <a key={l.name} href={l.href} target="_blank" rel="noreferrer"
                                className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.01] group"
                                style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid var(--ct-border)" }}>
                                <Link2 size={13} className="flex-shrink-0" style={{ color: "var(--ct-accent)" }} />
                                <div>
                                    <p className="text-xs font-bold" style={{ color: "var(--ct-text)" }}>{l.name}</p>
                                    <p className="text-[10px]" style={{ color: "var(--ct-text-muted)" }}>{l.desc}</p>
                                </div>
                                <ExternalLink size={10} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--ct-text-muted)" }} />
                            </a>
                        ))}
                    </div>
                    <div className="mt-6 p-5 rounded-2xl text-center"
                        style={{ backgroundColor: "rgba(6,182,212,0.04)", border: "1px solid rgba(6,182,212,0.15)" }}>
                        <p className="text-sm font-bold mb-1" style={{ color: "var(--ct-text)" }}>🎛️ You&apos;re equipped. Go make something great.</p>
                        <p className="text-xs" style={{ color: "var(--ct-text-muted)" }}>
                            Reaper rewards exploration. The Action List holds the key to making it entirely yours.
                        </p>
                    </div>
                </Section>
            </main>
        </div>
    );
}
