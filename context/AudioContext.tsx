"use client";

import React, { createContext, useContext, useState } from "react";

interface AudioContextType {
    currentTrack: any | null;
    isPlaying: boolean;
    playTrack: (track: any) => void;
    togglePlay: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [currentTrack, setCurrentTrack] = useState<any | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const playTrack = (track: any) => {
        setCurrentTrack(track);
        setIsPlaying(true);
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    return (
        <AudioContext.Provider value={{ currentTrack, isPlaying, playTrack, togglePlay }}>
            {children}
        </AudioContext.Provider>
    );
}

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) throw new Error("useAudio must be used within AudioProvider");
    return context;
};
