export type StyleName = 'Modern' | 'Analogue' | '2000s Digital' | '80s' | '70s' | 'Retro' | 'SSL' | 'UA';

export interface MasteringProfile {
    id: string;
    name: StyleName;
    description: string;
    params: {
        eq: [number, number, number]; // Low, Mid, High gain (dB)
        compression: {
            threshold: number;
            ratio: number;
        };
        saturation: number; // 0-1
        warmth: number; // 0-1 (Low-pass / shelf)
    };
    color: string;
}

export const MASTERING_STYLES: MasteringProfile[] = [
    {
        id: 'modern',
        name: 'Modern',
        description: 'Crystal clear, loud, and punchy. Perfect for streaming.',
        params: { eq: [2, 1, 3], compression: { threshold: -12, ratio: 4 }, saturation: 0.1, warmth: 0.1 },
        color: '#3b82f6' // Blue
    },
    {
        id: 'analogue',
        name: 'Analogue',
        description: 'Warm saturation with a smooth top end. Classic vibe.',
        params: { eq: [3, 2, -1], compression: { threshold: -10, ratio: 2 }, saturation: 0.6, warmth: 0.8 },
        color: '#f59e0b' // Amber
    },
    {
        id: 'ssl',
        name: 'SSL',
        description: 'The legendary bus compressor glue. Tight and cohesive.',
        params: { eq: [1, 2, 2], compression: { threshold: -15, ratio: 4 }, saturation: 0.3, warmth: 0.2 },
        color: '#d1d5db' // Silver
    },
    {
        id: '80s',
        name: '80s',
        description: 'Gated drums, shimmering highs, and rack limiting.',
        params: { eq: [-2, 0, 4], compression: { threshold: -8, ratio: 8 }, saturation: 0.2, warmth: 0.0 },
        color: '#ec4899' // Neon Pink
    },
    {
        id: 'tape',
        name: 'Retro',
        description: 'Lo-fi tape artifacts, wow/flutter, and rolled off highs.',
        params: { eq: [4, 1, -4], compression: { threshold: -6, ratio: 3 }, saturation: 0.9, warmth: 1.0 },
        color: '#78350f' // Brown
    }
];
