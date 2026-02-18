"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Download, Activity, Zap, CheckCircle, Disc, Music, RefreshCw, Power, Loader2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DropZone from './DropZone';
import AudioVisualizer from './AudioVisualizer';
import ArcMeter from './ArcMeter';
import { MASTERING_STYLES, MasteringProfile } from '../../types/mastering';

type ProcessingStep = 'idle' | 'analyzing' | 'matching' | 'limiting' | 'exporting' | 'complete';

const STEPS = [
    { id: 'analyzing', label: 'Analysis' },
    { id: 'matching', label: 'EQ Match' },
    { id: 'limiting', label: 'Dynamics' },
    { id: 'exporting', label: 'Render' }
];

export default function MasteringConsole() {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [referenceFile, setReferenceFile] = useState<File | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [processState, setProcessState] = useState<ProcessingStep>('idle');
    const [selectedStyle, setSelectedStyle] = useState<MasteringProfile>(MASTERING_STYLES[0]);
    const [previewMode, setPreviewMode] = useState<'original' | 'mastered'>('original');

    // Audio Engine Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const filterLowRef = useRef<BiquadFilterNode | null>(null);
    const filterMidRef = useRef<BiquadFilterNode | null>(null);
    const filterHighRef = useRef<BiquadFilterNode | null>(null);
    const compressorRef = useRef<DynamicsCompressorNode | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Metering
    const [vuLevel, setVuLevel] = useState(0);
    const rafRef = useRef<number | null>(null);

    // Initialize Audio Graph
    useEffect(() => {
        if (!audioUrl || !audioRef.current) return;

        // Cleanup
        if (audioContextRef.current) audioContextRef.current.close();

        const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext) as any;
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        const source = ctx.createMediaElementSource(audioRef.current);
        sourceNodeRef.current = source;

        // Nodes
        const gain = ctx.createGain();
        const low = ctx.createBiquadFilter(); low.type = 'lowshelf'; low.frequency.value = 200;
        const mid = ctx.createBiquadFilter(); mid.type = 'peaking'; mid.frequency.value = 1000; mid.Q.value = 0.8;
        const high = ctx.createBiquadFilter(); high.type = 'highshelf'; high.frequency.value = 3000;
        const comp = ctx.createDynamicsCompressor();
        const analyser = ctx.createAnalyser(); analyser.fftSize = 256;

        // Chain
        source.connect(low);
        low.connect(mid);
        mid.connect(high);
        high.connect(comp);
        comp.connect(gain);
        gain.connect(analyser);
        analyser.connect(ctx.destination);

        // Store refs
        gainNodeRef.current = gain;
        filterLowRef.current = low;
        filterMidRef.current = mid;
        filterHighRef.current = high;
        compressorRef.current = comp;
        analyserRef.current = analyser;

        return () => { ctx.close(); cancelAnimationFrame(rafRef.current!); };
    }, [audioUrl]);

    // Apply Style Params
    useEffect(() => {
        if (!filterLowRef.current || !filterHighRef.current || !compressorRef.current) return;

        // Reset if original
        if (previewMode === 'original') {
            filterLowRef.current.gain.value = 0;
            filterMidRef.current!.gain.value = 0;
            filterHighRef.current.gain.value = 0;
            compressorRef.current.threshold.value = 0;
            return;
        }

        // Apply Profile
        const params = selectedStyle.params;
        const now = audioContextRef.current?.currentTime || 0;

        filterLowRef.current.gain.linearRampToValueAtTime(params.eq[0] * 2, now + 0.1);
        filterMidRef.current!.gain.linearRampToValueAtTime(params.eq[1] * 2, now + 0.1);
        filterHighRef.current.gain.linearRampToValueAtTime(params.eq[2] * 2, now + 0.1);

        compressorRef.current.threshold.setValueAtTime(params.compression.threshold, now);
        compressorRef.current.ratio.setValueAtTime(params.compression.ratio, now);

        // Makeup gain
        gainNodeRef.current!.gain.linearRampToValueAtTime(1 + (Math.abs(params.compression.threshold) / 20), now + 0.1);

    }, [selectedStyle, previewMode]);

    // Meter Loop
    useEffect(() => {
        const updateMeter = () => {
            if (analyserRef.current && isPlaying) {
                const data = new Uint8Array(analyserRef.current.frequencyBinCount);
                analyserRef.current.getByteTimeDomainData(data);

                let sum = 0;
                for (let i = 0; i < data.length; i++) {
                    const v = (data[i] - 128) / 128;
                    sum += v * v;
                }
                const rms = Math.sqrt(sum / data.length);
                setVuLevel(rms * 4);
            } else {
                setVuLevel(0);
            }
            rafRef.current = requestAnimationFrame(updateMeter);
        };
        updateMeter();
        return () => cancelAnimationFrame(rafRef.current!);
    }, [isPlaying]);


    // Handlers
    const handleFileLoad = (file: File) => {
        const url = URL.createObjectURL(file);
        setAudioUrl(url);
        setOriginalFile(file);
        setProcessState('idle');
        setPreviewMode('original');
    };

    const handleProcess = () => {
        if (!audioUrl) return;
        setIsPlaying(true);
        setProcessState('analyzing');

        // Simulation
        setTimeout(() => setProcessState('matching'), 2000);
        setTimeout(() => setProcessState('limiting'), 4000);
        setTimeout(() => setProcessState('exporting'), 6000);
        setTimeout(() => {
            setProcessState('complete');
            setPreviewMode('mastered');
            setIsPlaying(true);
        }, 8000);
    };

    const handleDownload = () => {
        if (!audioUrl) return;
        const a = document.createElement('a');
        a.href = audioUrl;
        a.download = `MASTERED_${selectedStyle.name}_${originalFile?.name || 'track'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="max-w-6xl mx-auto rounded-[32px] overflow-hidden shadow-2xl relative bg-[#050505] text-white font-sans border border-white/5">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Main Container */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">

                {/* --- LEFT PANEL: CONTROLS --- */}
                <div className="lg:col-span-4 bg-[#0a0a0a]/80 backdrop-blur-md border-r border-white/5 p-8 flex flex-col gap-8">

                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <h1 className="text-xl font-bold tracking-tight">THE PRESS</h1>
                        </div>
                        <p className="text-xs text-neutral-500">AI Mastering Module V3.0</p>
                    </div>

                    {/* Style Selector */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-neutral-600 uppercase tracking-widest pl-1">Sonic Profile</label>
                        <div className="grid grid-cols-1 gap-2">
                            {MASTERING_STYLES.map(style => (
                                <button
                                    key={style.id}
                                    onClick={() => setSelectedStyle(style)}
                                    className={`group px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${selectedStyle.id === style.id
                                            ? 'bg-white/5 border-white/20 text-white shadow-lg'
                                            : 'bg-transparent border-transparent text-neutral-500 hover:bg-white/5 hover:text-neutral-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-2 h-2 rounded-full transition-colors ${selectedStyle.id === style.id ? 'opacity-100' : 'opacity-20 group-hover:opacity-50'}`}
                                            style={{ backgroundColor: style.color }}
                                        />
                                        {style.name}
                                    </div>
                                    {selectedStyle.id === style.id && <CheckCircle size={14} className="text-white/50" />}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-neutral-500 px-2 leading-relaxed h-8">
                            {selectedStyle.description}
                        </p>
                    </div>

                    {/* Sources */}
                    <div className="space-y-4 mt-auto">
                        <DropZone onFileAccepted={handleFileLoad} label="Target Audio" icon={<Music size={18} />} />
                        {!originalFile && <DropZone onFileAccepted={setReferenceFile} label="Reference (Optional)" icon={<Activity size={18} />} />}
                    </div>
                </div>


                {/* --- RIGHT PANEL: VISUALIZATION --- */}
                <div className="lg:col-span-8 p-10 flex flex-col relative overflow-hidden">
                    {/* Top Bar: Transport & Status */}
                    <div className="flex items-center justify-between mb-10 z-20">
                        {/* Playback Controls */}
                        <div className="flex items-center gap-4 bg-[#111] p-1.5 rounded-full border border-white/10">
                            <button
                                onClick={() => { if (audioRef.current) isPlaying ? audioRef.current.pause() : audioRef.current.play(); }}
                                disabled={!audioUrl}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-white text-black' : 'bg-[#222] text-white hover:bg-[#333]'
                                    }`}
                            >
                                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                            </button>

                            {/* Preview Toggle */}
                            <div className="flex items-center px-2">
                                <button
                                    onClick={() => setPreviewMode('original')}
                                    className={`px-3 py-1.5 text-[10px] font-bold rounded-full transition-colors ${previewMode === 'original' ? 'text-white' : 'text-neutral-600 hover:text-neutral-400'}`}
                                >
                                    ORIGINAL
                                </button>
                                <div className="w-px h-3 bg-white/10 mx-1" />
                                <button
                                    onClick={() => setPreviewMode('mastered')}
                                    disabled={processState !== 'complete'}
                                    className={`px-3 py-1.5 text-[10px] font-bold rounded-full transition-colors ${previewMode === 'mastered' ? 'text-primary' : 'text-neutral-600'}`}
                                    style={{ color: previewMode === 'mastered' ? selectedStyle.color : '' }}
                                >
                                    MASTER
                                </button>
                            </div>
                        </div>

                        {/* Process Status */}
                        <div className="flex items-center gap-6">
                            {STEPS.map((step, i) => {
                                // @ts-ignore
                                const isCurrent = processState === step.id;
                                // @ts-ignore
                                const isPast = STEPS.findIndex(s => s.id === processState) > i || processState === 'complete';

                                return (
                                    <div key={step.id} className="flex flex-col items-center gap-1">
                                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isCurrent ? 'scale-150 shadow-[0_0_10px_currentColor]' : 'scale-100'} ${isPast || isCurrent ? 'bg-white' : 'bg-white/10'}`}
                                            style={{ backgroundColor: (isCurrent || isPast) ? (isCurrent ? '#fff' : selectedStyle.color) : '' }}
                                        />
                                        <span className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${isCurrent ? 'text-white' : 'text-neutral-700'}`}>{step.label}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Central Visualization Area */}
                    <div className="flex-1 flex items-center justify-center relative">
                        {/* Audio Element */}
                        <audio
                            ref={audioRef}
                            src={audioUrl || ''}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onEnded={() => setIsPlaying(false)}
                            crossOrigin="anonymous"
                        />

                        {/* Circular Status Ring / Tape Replacement */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <AnimatePresence mode="wait">
                                {isPlaying && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="w-[400px] h-[400px] rounded-full border border-white/5 flex items-center justify-center relative"
                                    >
                                        <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_10s_linear_infinite]" />
                                        <div className="absolute inset-4 rounded-full border border-white/5 animate-[spin_15s_linear_infinite_reverse]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Main Visualizer */}
                        <div className="w-full max-w-2xl h-48 relative z-10">
                            <AudioVisualizer
                                audioUrl={audioUrl}
                                isPlaying={isPlaying}
                                accentColor={processState === 'complete' ? selectedStyle.color : '#fff'}
                                height={192}
                            />
                        </div>

                        {/* Arc Meters */}
                        <div className="absolute bottom-10 left-10 flex gap-4">
                            <ArcMeter level={vuLevel} label="L" color={selectedStyle.color} size={60} />
                            <ArcMeter level={vuLevel * 0.95} label="R" color={selectedStyle.color} size={60} />
                        </div>
                    </div>


                    {/* Action Footer */}
                    <div className="mt-auto flex justify-end z-20">
                        {processState === 'idle' ? (
                            <button
                                onClick={handleProcess}
                                disabled={!originalFile}
                                className={`px-8 py-4 bg-white text-black font-bold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                START MASTERING
                            </button>
                        ) : processState === 'complete' ? (
                            <div className="flex gap-4">
                                <button
                                    onClick={handleProcess}
                                    className="w-12 h-12 rounded-full bg-[#222] text-white flex items-center justify-center hover:bg-[#333] transition-colors"
                                    title="Regenerate"
                                >
                                    <RefreshCw size={20} />
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="px-8 py-3 bg-white text-black font-bold rounded-full shadow-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                                >
                                    <Download size={18} /> DOWNLOAD MASTER
                                </button>
                            </div>
                        ) : (
                            <div className="px-8 py-4 bg-[#111] border border-white/10 text-white font-mono text-xs rounded-full flex items-center gap-3">
                                <Loader2 size={16} className="animate-spin text-neutral-400" />
                                PROCESSING...
                            </div>
                        )}
                    </div>

                </div>
            </div>

        </div>
    );
}
