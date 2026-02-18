"use client";

import React, { useCallback, useState } from 'react';
import { Upload, Music, FileAudio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropZoneProps {
    onFileAccepted: (file: File) => void;
    label: string;
    subLabel?: string;
    accept?: string;
    icon?: React.ReactNode;
}

export default function DropZone({
    onFileAccepted,
    label,
    subLabel = "WAV, AIFF, MP3 (Max 100MB)",
    accept = "audio/*",
    icon
}: DropZoneProps) {
    const [isDragActive, setIsDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragActive(true);
        } else if (e.type === "dragleave") {
            setIsDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type.startsWith('audio/')) {
                setFile(droppedFile);
                onFileAccepted(droppedFile);
            } else {
                alert("Please upload an audio file.");
            }
        }
    }, [onFileAccepted]);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            onFileAccepted(selectedFile);
        }
    };

    return (
        <motion.div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 cursor-pointer overflow-hidden
                ${isDragActive
                    ? 'border-[var(--theme-accent)] bg-[var(--theme-accent)]/10'
                    : file
                        ? 'border-[var(--theme-primary)] bg-[var(--theme-container-bg)]'
                        : 'border-[var(--theme-border)] hover:border-[var(--theme-primary)] bg-[var(--theme-container-bg)]/50'
                }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById(`file-upload-${label}`)?.click()}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
        >
            <input
                id={`file-upload-${label}`}
                type="file"
                className="hidden"
                accept={accept}
                onChange={handleFileInput}
            />

            <AnimatePresence mode="wait">
                {file ? (
                    <motion.div
                        key="file-loaded"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className="w-12 h-12 rounded-full bg-[var(--theme-primary)]/20 flex items-center justify-center text-[var(--theme-primary)]">
                            <Music size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-[var(--theme-text)] truncate max-w-[200px]">{file.name}</p>
                            <p className="text-xs text-[var(--theme-secondary)]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-3"
                    >
                        <div className={`text-[var(--theme-secondary)] ${isDragActive ? 'text-[var(--theme-accent)]' : ''}`}>
                            {icon || <Upload size={32} />}
                        </div>
                        <div>
                            <p className="font-bold text-[var(--theme-text)]">{label}</p>
                            <p className="text-xs text-[var(--theme-secondary)] mt-1">{subLabel}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {isDragActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--theme-bg)]/80 backdrop-blur-sm z-10">
                    <p className="text-[var(--theme-accent)] font-bold uppercase tracking-widest">Drop to Upload</p>
                </div>
            )}
        </motion.div>
    );
}
