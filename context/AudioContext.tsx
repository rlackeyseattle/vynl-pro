"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface Track {
    title: string;
    artist: string;
    file: string;
    cover?: string;
}

interface AudioContextType {
    currentTrack: Track | null;
    isPlaying: boolean;
    progress: number;
    playTrack: (track: Track) => void;
    togglePlay: () => void;
    nextTrack: () => void;
    prevTrack: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.addEventListener('timeupdate', () => {
                if (audioRef.current) {
                    const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
                    setProgress(pct);
                }
            });
            audioRef.current.addEventListener('ended', () => {
                setIsPlaying(false);
                setProgress(0);
            });
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
        };
    }, []);

    useEffect(() => {
        if (audioRef.current && currentTrack) {
            if (audioRef.current.src !== currentTrack.file) {
                audioRef.current.src = currentTrack.file;
            }
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Playback error:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrack]);

    const playTrack = (track: Track) => {
        setCurrentTrack(track);
        setIsPlaying(true);
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    // Placeholder for playlist logic
    const nextTrack = () => { };
    const prevTrack = () => { };

    return (
        <AudioContext.Provider value={{
            currentTrack,
            isPlaying,
            progress,
            playTrack,
            togglePlay,
            nextTrack,
            prevTrack
        }}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
}
