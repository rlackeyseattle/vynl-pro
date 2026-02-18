export interface ThemeColors {
    background: string;
    containerBg: string;
    primary: string;
    text: string;
    accent: string;
    border: string;
}

export interface ThemeFonts {
    heading: string;
    body: string;
}

export interface ThemeLayout {
    density: 'compact' | 'comfortable' | 'spacious';
    borderRadius: string;
}

export interface ThemeConfig {
    id: string;
    name: string;
    colors: ThemeColors;
    fonts: ThemeFonts;
    layout: ThemeLayout;
}

export const DEFAULT_THEME: ThemeConfig = {
    id: 'modern-dark',
    name: 'Modern Dark',
    colors: {
        background: '#121212',
        containerBg: '#1e1e1e',
        primary: '#bb86fc',
        text: '#e0e0e0',
        accent: '#03dac6',
        border: '#333333'
    },
    fonts: {
        heading: 'Inter, sans-serif',
        body: 'Inter, sans-serif'
    },
    layout: {
        density: 'comfortable',
        borderRadius: '8px'
    }
};

export const RETRO_THEME: ThemeConfig = {
    id: 'retro-myspace',
    name: 'Retro Social',
    colors: {
        background: '#e5e5e5',
        containerBg: '#ffffff',
        primary: '#6699cc',
        text: '#000000',
        accent: '#ff6600',
        border: '#6699cc'
    },
    fonts: {
        heading: 'Arial, Helvetica, sans-serif',
        body: 'Arial, Helvetica, sans-serif'
    },
    layout: {
        density: 'compact',
        borderRadius: '0px'
    }
};
