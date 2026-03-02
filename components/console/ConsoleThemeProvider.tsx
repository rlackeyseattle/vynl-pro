"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CONSOLE_THEMES, ConsoleTheme, DEFAULT_THEME_ID, applyTheme, getTheme } from "@/lib/console-themes";

const STORAGE_KEY = "vynl-console-theme";

interface ThemeContextValue {
    theme: ConsoleTheme;
    setThemeId: (id: string) => void;
    allThemes: ConsoleTheme[];
}

const ThemeCtx = createContext<ThemeContextValue>({
    theme: CONSOLE_THEMES[0],
    setThemeId: () => { },
    allThemes: CONSOLE_THEMES,
});

export function useConsoleTheme() {
    return useContext(ThemeCtx);
}

export function ConsoleThemeProvider({ children }: { children: React.ReactNode }) {
    const [themeId, setThemeIdState] = useState(DEFAULT_THEME_ID);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME_ID;
        setThemeIdState(saved);
        applyTheme(getTheme(saved).vars);
    }, []);

    const setThemeId = (id: string) => {
        setThemeIdState(id);
        localStorage.setItem(STORAGE_KEY, id);
        applyTheme(getTheme(id).vars);
    };

    return (
        <ThemeCtx.Provider value={{ theme: getTheme(themeId), setThemeId, allThemes: CONSOLE_THEMES }}>
            {children}
        </ThemeCtx.Provider>
    );
}
