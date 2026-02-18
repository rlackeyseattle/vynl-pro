import React from 'react';
import MasteringConsole from '../../components/mastering/MasteringConsole';
import { EPK_THEME } from '../../types/theme';

export const metadata = {
    title: 'The Press // AI Mastering | VYNL.PRO',
    description: 'Professional AI Audio Mastering Engine.',
};

export default function MasteringPage() {
    // Hardcoded "Studio" Theme for this tool
    const studioTheme = {
        '--theme-bg': '#050505',
        '--theme-container-bg': '#0f0f0f',
        '--theme-primary': '#ffffff',
        '--theme-text': '#e0e0e0',
        '--theme-secondary': '#808080',
        '--theme-accent': '#ef4444', // Recoding Red
        '--theme-border': '#262626',
        '--theme-font-heading': '"Outfit", sans-serif',
        '--theme-font-body': '"Outfit", sans-serif',
        '--theme-radius': '4px',
    } as React.CSSProperties;

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8"
            style={{
                ...studioTheme,
                backgroundColor: 'var(--theme-bg)',
                color: 'var(--theme-text)',
                fontFamily: 'var(--theme-font-body)'
            }}
        >
            <div className="w-full max-w-6xl">
                <header className="mb-8 flex items-center justify-between">
                    <a href="/" className="text-xl font-bold tracking-tighter hover:text-[var(--theme-accent)] transition-colors">
                        VYNL.PRO
                    </a>
                    <nav className="text-sm font-medium text-[var(--theme-secondary)]">
                        <span className="text-[var(--theme-accent)]">THE PRESS</span>
                    </nav>
                </header>

                <MasteringConsole />

                <footer className="mt-12 text-center text-xs text-[var(--theme-secondary)]">
                    <p className="uppercase tracking-widest">© 2026 VYNL.PRO // AUDIO INTELLIGENCE DIVISION</p>
                </footer>
            </div>

            <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
                <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-500 text-[10px] font-mono tracking-widest uppercase backdrop-blur-md">
                    VISUAL SIMULATION MODE • DSP INACTIVE
                </div>
            </div>
        </div>
    );
}
```
