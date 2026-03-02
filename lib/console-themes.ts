export interface ConsoleTheme {
    id: string;
    name: string;
    brand: string;
    year?: string;
    description: string;
    preview: string[]; // 3 color stops for the swatch
    vars: {
        "--ct-bg": string;           // main background
        "--ct-bg-2": string;         // sidebar / panel bg
        "--ct-border": string;       // border color
        "--ct-accent": string;       // primary accent (active states, CTAs)
        "--ct-accent-2": string;     // secondary accent
        "--ct-text": string;         // primary text
        "--ct-text-muted": string;   // muted text
        "--ct-glow": string;         // glow / shadow color
    };
}

export const CONSOLE_THEMES: ConsoleTheme[] = [
    // ── DEFAULT ──────────────────────────────────────────────────────────────
    {
        id: "vynl-dark",
        name: "VYNL Dark",
        brand: "Default",
        description: "The original. Clean obsidian.",
        preview: ["#07070e", "#0a0a1a", "#00f2f2"],
        vars: {
            "--ct-bg": "#07070e",
            "--ct-bg-2": "#0a0a12",
            "--ct-border": "rgba(255,255,255,0.05)",
            "--ct-accent": "#00f2f2",
            "--ct-accent-2": "#7c3aed",
            "--ct-text": "#ffffff",
            "--ct-text-muted": "#6b7280",
            "--ct-glow": "rgba(0,242,242,0.15)",
        },
    },

    // ── FENDER ────────────────────────────────────────────────────────────────
    {
        id: "fender-sunburst",
        name: "Three-Tone Sunburst",
        brand: "Fender",
        year: "1954",
        description: "The original Strat finish. Amber to cherry to mahogany.",
        preview: ["#1a0800", "#8b2500", "#d4691a"],
        vars: {
            "--ct-bg": "#100700",
            "--ct-bg-2": "#1a0a02",
            "--ct-border": "rgba(212,105,26,0.12)",
            "--ct-accent": "#e8833a",
            "--ct-accent-2": "#c94f1a",
            "--ct-text": "#f5dcc0",
            "--ct-text-muted": "#8a6040",
            "--ct-glow": "rgba(232,131,58,0.2)",
        },
    },
    {
        id: "fender-lake-placid-blue",
        name: "Lake Placid Blue",
        brand: "Fender",
        year: "1965",
        description: "Cool-water Strat. Ice over midnight.",
        preview: ["#04101a", "#0a2a3d", "#4a9cc4"],
        vars: {
            "--ct-bg": "#040c14",
            "--ct-bg-2": "#061420",
            "--ct-border": "rgba(74,156,196,0.12)",
            "--ct-accent": "#5ab0d8",
            "--ct-accent-2": "#2a7aaa",
            "--ct-text": "#c8e8f5",
            "--ct-text-muted": "#4a7090",
            "--ct-glow": "rgba(90,176,216,0.2)",
        },
    },
    {
        id: "fender-fiesta-red",
        name: "Fiesta Red",
        brand: "Fender",
        year: "1960",
        description: "Hot Telecaster energy. Coral meets crimson.",
        preview: ["#1a0204", "#5c0a10", "#e04050"],
        vars: {
            "--ct-bg": "#0f0204",
            "--ct-bg-2": "#180408",
            "--ct-border": "rgba(224,64,80,0.12)",
            "--ct-accent": "#e84858",
            "--ct-accent-2": "#b82030",
            "--ct-text": "#f5c8cc",
            "--ct-text-muted": "#8a4050",
            "--ct-glow": "rgba(232,72,88,0.2)",
        },
    },
    {
        id: "fender-sonic-blue",
        name: "Sonic Blue",
        brand: "Fender",
        year: "1962",
        description: "Pastel Jazzmaster cool. Powder sky meets mist.",
        preview: ["#050f12", "#0a2228", "#5ab8cc"],
        vars: {
            "--ct-bg": "#050d10",
            "--ct-bg-2": "#081418",
            "--ct-border": "rgba(90,184,204,0.10)",
            "--ct-accent": "#6eccd8",
            "--ct-accent-2": "#3a9aaa",
            "--ct-text": "#c0eaf0",
            "--ct-text-muted": "#3a7a88",
            "--ct-glow": "rgba(110,204,216,0.18)",
        },
    },
    {
        id: "fender-olympic-white",
        name: "Olympic White",
        brand: "Fender",
        year: "1963",
        description: "Stripped-back elegance. Ivory tone, paper grain.",
        preview: ["#101008", "#22221a", "#e8e8d0"],
        vars: {
            "--ct-bg": "#0c0c08",
            "--ct-bg-2": "#141410",
            "--ct-border": "rgba(232,232,208,0.08)",
            "--ct-accent": "#d4d4b0",
            "--ct-accent-2": "#a0a080",
            "--ct-text": "#eeeede",
            "--ct-text-muted": "#606050",
            "--ct-glow": "rgba(212,212,176,0.15)",
        },
    },

    // ── GIBSON ────────────────────────────────────────────────────────────────
    {
        id: "gibson-cherry",
        name: "Cherry",
        brand: "Gibson",
        year: "1961",
        description: "SG Cherry. Dark mahogany to pure crimson.",
        preview: ["#0f0204", "#3d0510", "#c01030"],
        vars: {
            "--ct-bg": "#0a0104",
            "--ct-bg-2": "#110206",
            "--ct-border": "rgba(192,16,48,0.12)",
            "--ct-accent": "#d01840",
            "--ct-accent-2": "#8a0020",
            "--ct-text": "#f0c0c8",
            "--ct-text-muted": "#804050",
            "--ct-glow": "rgba(208,24,64,0.2)",
        },
    },
    {
        id: "gibson-goldtop",
        name: "Goldtop",
        brand: "Gibson",
        year: "1952",
        description: "Les Paul Gold. Prestige in every pixel.",
        preview: ["#0f0a00", "#3a2800", "#c8981a"],
        vars: {
            "--ct-bg": "#0a0800",
            "--ct-bg-2": "#140e00",
            "--ct-border": "rgba(200,152,26,0.12)",
            "--ct-accent": "#d4a820",
            "--ct-accent-2": "#9a7005",
            "--ct-text": "#f5e8b0",
            "--ct-text-muted": "#7a6020",
            "--ct-glow": "rgba(212,168,32,0.2)",
        },
    },
    {
        id: "gibson-pelham-blue",
        name: "Pelham Blue",
        brand: "Gibson",
        year: "1964",
        description: "ES-335 Pelham Blue. Deep as a late-night set.",
        preview: ["#020a10", "#053060", "#1a60c8"],
        vars: {
            "--ct-bg": "#020810",
            "--ct-bg-2": "#040e1a",
            "--ct-border": "rgba(26,96,200,0.12)",
            "--ct-accent": "#2878e0",
            "--ct-accent-2": "#1050a0",
            "--ct-text": "#b0c8f0",
            "--ct-text-muted": "#304880",
            "--ct-glow": "rgba(40,120,224,0.2)",
        },
    },
    {
        id: "gibson-honeyburst",
        name: "Honeyburst",
        brand: "Gibson",
        year: "1959",
        description: "Les Paul Standard burst. Warm amber to caramel.",
        preview: ["#0f0800", "#503000", "#c87830"],
        vars: {
            "--ct-bg": "#0a0600",
            "--ct-bg-2": "#100900",
            "--ct-border": "rgba(200,120,48,0.12)",
            "--ct-accent": "#d48840",
            "--ct-accent-2": "#905010",
            "--ct-text": "#f0dcb0",
            "--ct-text-muted": "#785030",
            "--ct-glow": "rgba(212,136,64,0.2)",
        },
    },

    // ── BOUTIQUE / OTHER ──────────────────────────────────────────────────────
    {
        id: "prs-dragon",
        name: "Dragon Burst",
        brand: "PRS",
        year: "1992",
        description: "PRS Dragon. Violet flames licking emerald.",
        preview: ["#08020f", "#2a086a", "#7c38d8"],
        vars: {
            "--ct-bg": "#06010c",
            "--ct-bg-2": "#0c0218",
            "--ct-border": "rgba(124,56,216,0.12)",
            "--ct-accent": "#9050e8",
            "--ct-accent-2": "#30a860",
            "--ct-text": "#e0c8f8",
            "--ct-text-muted": "#6040a0",
            "--ct-glow": "rgba(144,80,232,0.25)",
        },
    },
    {
        id: "rickenbacker-fireglo",
        name: "Fireglo",
        brand: "Rickenbacker",
        year: "1958",
        description: "Ric 330 Fireglo. Sunrise cherry to amber.",
        preview: ["#100400", "#5c1000", "#e05018"],
        vars: {
            "--ct-bg": "#0a0200",
            "--ct-bg-2": "#120500",
            "--ct-border": "rgba(224,80,24,0.12)",
            "--ct-accent": "#e86820",
            "--ct-accent-2": "#b03800",
            "--ct-text": "#f5c8a0",
            "--ct-text-muted": "#804020",
            "--ct-glow": "rgba(232,104,32,0.2)",
        },
    },
    {
        id: "midnight-studio",
        name: "Midnight Studio",
        brand: "VYNL",
        description: "Ink black with cool violet. Pro studio feel.",
        preview: ["#060612", "#0e0e28", "#6040c8"],
        vars: {
            "--ct-bg": "#060612",
            "--ct-bg-2": "#0c0c20",
            "--ct-border": "rgba(96,64,200,0.1)",
            "--ct-accent": "#7856e8",
            "--ct-accent-2": "#40c8a0",
            "--ct-text": "#e0d8f8",
            "--ct-text-muted": "#504878",
            "--ct-glow": "rgba(120,86,232,0.2)",
        },
    },
];

export const DEFAULT_THEME_ID = "vynl-dark";

export function getTheme(id: string): ConsoleTheme {
    return CONSOLE_THEMES.find(t => t.id === id) ?? CONSOLE_THEMES[0];
}

export function applyTheme(vars: ConsoleTheme["vars"]) {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(vars)) {
        root.style.setProperty(key, value);
    }
}
