// Color theory utilities for generating harmonious palettes from 3 user-picked colors

export interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
}

export interface GenreTemplate {
    id: string;
    name: string;
    mode: "dark" | "light";
    colors: ThemeColors;
    font: string;
    borderRadius: string;
    description: string;
}

// Genre-specific starter templates
export const GENRE_TEMPLATES: GenreTemplate[] = [
    {
        id: "rock",
        name: "Rock",
        mode: "dark",
        colors: { primary: "#e63946", secondary: "#1d3557", accent: "#f1faee" },
        font: "font-sans",
        borderRadius: "rounded-lg",
        description: "Bold, high-contrast, electric energy",
    },
    {
        id: "jazz",
        name: "Jazz",
        mode: "dark",
        colors: { primary: "#d4a574", secondary: "#2d1b0e", accent: "#f5e6d3" },
        font: "font-serif",
        borderRadius: "rounded-2xl",
        description: "Warm, smoky, sophisticated",
    },
    {
        id: "hiphop",
        name: "Hip-Hop",
        mode: "dark",
        colors: { primary: "#ffd700", secondary: "#1a1a2e", accent: "#e94560" },
        font: "font-mono",
        borderRadius: "rounded-xl",
        description: "Bold gold, deep contrast, urban edge",
    },
    {
        id: "electronic",
        name: "Electronic",
        mode: "dark",
        colors: { primary: "#00f2f2", secondary: "#0a0a1a", accent: "#ff00ff" },
        font: "font-mono",
        borderRadius: "rounded-3xl",
        description: "Neon glow, futuristic, cyber",
    },
    {
        id: "country",
        name: "Country",
        mode: "light",
        colors: { primary: "#8b6914", secondary: "#f5f0e8", accent: "#c0392b" },
        font: "font-serif",
        borderRadius: "rounded-xl",
        description: "Warm earth tones, rustic charm",
    },
    {
        id: "classical",
        name: "Classical",
        mode: "light",
        colors: { primary: "#2c3e50", secondary: "#fdfbf7", accent: "#c0a062" },
        font: "font-serif",
        borderRadius: "rounded-lg",
        description: "Elegant, refined, timeless",
    },
    {
        id: "songwriter",
        name: "Singer-Songwriter",
        mode: "light",
        colors: { primary: "#5b7065", secondary: "#f7f3ee", accent: "#d4956a" },
        font: "font-sans",
        borderRadius: "rounded-2xl",
        description: "Organic, intimate, earthy",
    },
    {
        id: "pop",
        name: "Pop",
        mode: "light",
        colors: { primary: "#6366f1", secondary: "#fefefe", accent: "#f472b6" },
        font: "font-sans",
        borderRadius: "rounded-3xl",
        description: "Bright, playful, vibrant",
    },
];

// Convert hex to HSL components
function hexToHSL(hex: string): { h: number; s: number; l: number } {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Convert HSL to hex
function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// Generate derived colors from 3 base colors using color theory
export function generatePalette(colors: ThemeColors, mode: "dark" | "light") {
    const primary = hexToHSL(colors.primary);
    const secondary = hexToHSL(colors.secondary);
    const accent = hexToHSL(colors.accent);

    return {
        // Base
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,

        // Derived
        primaryMuted: hslToHex(primary.h, Math.max(primary.s - 20, 10), mode === "dark" ? 15 : 90),
        primaryGlow: hslToHex(primary.h, primary.s, mode === "dark" ? 60 : 45),
        secondaryMuted: hslToHex(secondary.h, Math.max(secondary.s - 15, 5), mode === "dark" ? 10 : 95),
        accentHover: hslToHex(accent.h, accent.s, mode === "dark" ? accent.l + 10 : accent.l - 10),

        // Surfaces
        background: mode === "dark" ? hslToHex(secondary.h, Math.min(secondary.s, 15), 5) : hslToHex(secondary.h, Math.min(secondary.s, 10), 98),
        surface: mode === "dark" ? hslToHex(secondary.h, Math.min(secondary.s, 12), 8) : hslToHex(secondary.h, Math.min(secondary.s, 8), 100),
        surfaceHover: mode === "dark" ? hslToHex(secondary.h, Math.min(secondary.s, 10), 12) : hslToHex(secondary.h, Math.min(secondary.s, 8), 96),

        // Text
        text: mode === "dark" ? "#f0f0f0" : "#1a1a1a",
        textMuted: mode === "dark" ? "#888888" : "#666666",
        textSubtle: mode === "dark" ? "#555555" : "#999999",

        // Borders
        border: mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
        borderHover: mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
    };
}

// Default profile sections
export interface ProfileSection {
    id: string;
    type: "hero" | "bio" | "music" | "video" | "events" | "fanboard" | "contact" | "store" | "social";
    label: string;
    enabled: boolean;
}

export const DEFAULT_SECTIONS: ProfileSection[] = [
    { id: "hero", type: "hero", label: "Hero Banner", enabled: true },
    { id: "bio", type: "bio", label: "About", enabled: true },
    { id: "music", type: "music", label: "Music Player", enabled: true },
    { id: "video", type: "video", label: "Video", enabled: true },
    { id: "events", type: "events", label: "Shows & Events", enabled: true },
    { id: "fanboard", type: "fanboard", label: "Fan Board", enabled: true },
    { id: "contact", type: "contact", label: "Contact & Booking", enabled: true },
    { id: "store", type: "store", label: "Storefront", enabled: false },
    { id: "social", type: "social", label: "Social Links", enabled: true },
];

// Full theme config stored in profile.themeConfig (JSON)
export interface ThemeConfig {
    templateId: string;
    mode: "dark" | "light";
    colors: ThemeColors;
    font: string;
    borderRadius: string;
    sections: ProfileSection[];
}

export function getDefaultThemeConfig(): ThemeConfig {
    const template = GENRE_TEMPLATES[0]; // Rock as default
    return {
        templateId: template.id,
        mode: template.mode,
        colors: { ...template.colors },
        font: template.font,
        borderRadius: template.borderRadius,
        sections: [...DEFAULT_SECTIONS],
    };
}
