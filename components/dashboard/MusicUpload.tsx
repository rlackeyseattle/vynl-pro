"use client";

import React, { useState } from "react";
import { Upload, Music, X, Check, Loader2, Music2, Disc } from "lucide-react";

export default function MusicUpload({ onComplete }: { onComplete?: () => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState("");
    const [bpm, setBpm] = useState("");
    const [key, setKey] = useState("");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("genre", genre);
        formData.append("bpm", bpm);
        formData.append("key", key);

        try {
            const res = await fetch("/api/songs/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Upload failed");
            }

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setFile(null);
                setTitle("");
                setGenre("");
                setBpm("");
                setKey("");
                if (onComplete) onComplete();
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-neutral-900/50 border border-white/5 rounded-[2.5rem] p-10">
            <h2 className="text-sm font-black tracking-[0.3em] uppercase mb-8 flex items-center gap-3">
                <Music2 size={14} className="text-vynl-teal" /> TRANSMIT AUDIO
            </h2>

            {success ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 rounded-full bg-vynl-teal text-black flex items-center justify-center shadow-[0_0_40px_rgba(0,242,242,0.4)]">
                        <Check size={40} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-vynl-teal">Signal Synchronized</p>
                </div>
            ) : (
                <form onSubmit={handleUpload} className="space-y-8">
                    {!file ? (
                        <div
                            onClick={() => document.getElementById('audio-upload')?.click()}
                            className="border-2 border-dashed border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 hover:border-vynl-teal/30 hover:bg-white/[0.02] transition-all cursor-pointer group"
                        >
                            <input
                                id="audio-upload"
                                type="file"
                                accept="audio/*"
                                className="hidden"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-neutral-500 group-hover:text-vynl-teal transition-colors">
                                <Upload size={32} />
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1">Select Audio Source</p>
                                <p className="text-[8px] text-neutral-600 uppercase tracking-widest">WAV, MP3, or FLAC</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-black/40 border border-white/5 rounded-3xl p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-vynl-teal/10 flex items-center justify-center text-vynl-teal">
                                    <Music size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">{file.name}</p>
                                    <p className="text-[8px] text-neutral-500 uppercase tracking-widest mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                title="Remove File"
                                onClick={() => setFile(null)}
                                className="p-3 rounded-xl hover:bg-white/5 text-neutral-500 hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-[8px] font-black uppercase tracking-widest text-neutral-600 px-2">Track Title</label>
                            <input
                                id="title"
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="THE MASTER COMPOSITION..."
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-vynl-teal transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="genre" className="text-[8px] font-black uppercase tracking-widest text-neutral-600 px-2">Genre Classification</label>
                            <input
                                id="genre"
                                type="text"
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                placeholder="SONIC STYLE..."
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-vynl-teal transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="bpm" className="text-[8px] font-black uppercase tracking-widest text-neutral-600 px-2">BPM Counter</label>
                            <input
                                id="bpm"
                                type="number"
                                value={bpm}
                                onChange={(e) => setBpm(e.target.value)}
                                placeholder="TEMPO..."
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-vynl-teal transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="key" className="text-[8px] font-black uppercase tracking-widest text-neutral-600 px-2">Key Signature</label>
                            <input
                                id="key"
                                type="text"
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                placeholder="HARMONIC ROOT..."
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-vynl-teal transition-all"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[8px] font-black uppercase tracking-widest">
                            ERROR: {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        title="Submit Transmission"
                        disabled={!file || !title || uploading}
                        className="w-full py-5 rounded-3xl bg-vynl-teal text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_15px_40px_rgba(0,242,242,0.2)]"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                TRANSMITTING SIGNAL...
                            </>
                        ) : (
                            "INITIALIZE UPLOAD"
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}
