export interface ThemeColors {
    background: string;
    containerBg: string; // Used for cards or sections in some layouts
    primary: string;
    text: string;
    accent: string;
    border: string;
    secondaryText: string;
}

export interface ThemeFonts {
    heading: string;
    body: string;
}

export interface ThemeLayout {
    density: 'compact' | 'comfortable' | 'spacious';
    borderRadius: string;
    maxWidth: string; // e.g., '1200px', '100%'
}

export interface ThemeHero {
    style: 'full-screen' | 'split' | 'contained' | 'minimal';
    overlayOpacity: number; // 0 to 1
    blur: number; // px
    showScrollIndicator: boolean;
}

export interface ThemeConfig {
    id: string;
    name: string;
    colors: ThemeColors;
    fonts: ThemeFonts;
    layout: ThemeLayout;
    hero: ThemeHero;
}

export const DEFAULT_THEME: ThemeConfig = {
    id: 'modern-dark',
    name: 'Modern Dark',
    colors: {
        background: '#121212',
        containerBg: '#1e1e1e',
        primary: '#bb86fc',
        text: '#e0e0e0',
        secondaryText: '#a0a0a0',
        accent: '#03dac6',
        border: '#333333'
    },
    fonts: {
        heading: 'Inter, sans-serif',
        body: 'Inter, sans-serif'
    },
    layout: {
        density: 'comfortable',
        borderRadius: '8px',
        maxWidth: '1000px'
    },
    hero: {
        style: 'contained',
        overlayOpacity: 0,
        blur: 0,
        showScrollIndicator: false
    }
};

export const EPK_THEME: ThemeConfig = {
    id: 'modern-epk',
    name: 'Modern EPK',
    colors: {
        background: '#050505',
        containerBg: '#0a0a0a',
        primary: '#ffffff',
        text: '#f5f5f5',
        secondaryText: '#888888',
        accent: '#3b82f6', // Professional Blue
        border: '#222222'
    },
    fonts: {
        heading: '"Outfit", sans-serif', // Modern, geometric
        body: '"Outfit", sans-serif'
    },
    layout: {
        density: 'spacious',
        borderRadius: '0px', // Sharp, professional edges
        maxWidth: '1400px'
    },
    hero: {
        style: 'full-screen',
        overlayOpacity: 0.4,
        blur: 0,
        showScrollIndicator: true
    }
};

export const PRESET_THEMES = [DEFAULT_THEME, EPK_THEME];
