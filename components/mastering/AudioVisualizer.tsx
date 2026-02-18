"use client";

import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
    audioUrl: string | null;
    isPlaying: boolean;
    accentColor?: string;
    height?: number;
}

export default function AudioVisualizer({ audioUrl, isPlaying, accentColor = '#3b82f6', height = 150 }: AudioVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const animationRef = useRef<number | null>(null);

    // Initialize Audio Context
    useEffect(() => {
        if (!audioUrl || !audioRef.current) return;

        // Cleanup previous context if exists
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }

        // @ts-ignore - Handle WebKit prefix and constructor arguments
        const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
        const audioCtx = new AudioContextClass();

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;

        const source = audioCtx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;
        sourceRef.current = source;

        return () => {
            if (audioContextRef.current?.state !== 'closed') {
                audioContextRef.current?.close();
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [audioUrl]);

    // Handle Playback
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                if (audioContextRef.current?.state === 'suspended') {
                    audioContextRef.current.resume();
                }
                audioRef.current.play().catch(e => console.log("Autoplay prevented", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    // Draw Loop
    useEffect(() => {
        if (!canvasRef.current || !analyserRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            if (!analyserRef.current) return;

            animationRef.current = requestAnimationFrame(draw);
            analyserRef.current.getByteFrequencyData(dataArray);

            const width = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, width, h);

            // Create Gradient
            const gradient = ctx.createLinearGradient(0, h, 0, 0);
            gradient.addColorStop(0, accentColor);
            gradient.addColorStop(1, `${accentColor}00`);

            ctx.fillStyle = gradient;

            const barWidth = (width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * h;

                ctx.fillStyle = accentColor;
                ctx.globalAlpha = 0.6;
                ctx.fillRect(x, h - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };

        draw();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [accentColor]);

    return (
        <div className="relative w-full rounded-lg overflow-hidden bg-black/20 border border-[var(--theme-border)]">
            <canvas
                ref={canvasRef}
                width={800}
                height={height}
                className="w-full h-full block"
            />
            {audioUrl && (
                <audio
                    ref={audioRef}
                    src={audioUrl}
                    crossOrigin="anonymous"
                    loop
                    className="hidden"
                />
            )}

            {/* Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                opacity: 0.3
            }} />
        </div>
    );
}
