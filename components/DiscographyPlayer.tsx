"use client";

import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

interface Track {
    title: string;
    file: string;
}

interface Album {
    id: string;
    title: string;
    year: string;
    cover: string;
    tracks: Track[];
}

interface DiscographyPlayerProps {
    albums: Album[];
    artistName?: string;
}

export default function DiscographyPlayer({ albums, artistName = "Rob Lackey" }: DiscographyPlayerProps) {
    const [currentAlbumIdx, setCurrentAlbumIdx] = useState(0);
    const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

    const currentAlbum = albums[currentAlbumIdx];

    const handleTrackClick = (track: Track) => {
        if (currentTrack?.file === track.file) {
            togglePlay();
        } else {
            playTrack({
                title: track.title,
                artist: artistName,
                file: track.file,
                cover: currentAlbum.cover
            });
        }
    };

    return (
        <div className="ms-player">
            <div className="player-header">
                <div className="flex gap-4">
                    <img
                        src={currentAlbum.cover}
                        alt={currentAlbum.title}
                        className="w-16 h-16 border border-white/20"
                    />
                    <div>
                        <h4 className="text-sm font-bold m-0">{currentAlbum.title} ({currentAlbum.year})</h4>
                        <p className="text-xs text-orange-400 m-0">Select a track to play</p>
                    </div>
                </div>
            </div>

            <div className="track-list">
                {currentAlbum.tracks.map((track, i) => {
                    const isCurrent = currentTrack?.file === track.file;
                    return (
                        <div
                            key={i}
                            className={`track-item flex items-center justify-between ${isCurrent ? 'active' : ''}`}
                            onClick={() => handleTrackClick(track)}
                        >
                            <span>{i + 1}. {track.title}</span>
                            {isCurrent && (
                                isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-4 mt-4 border-t border-white/10 pt-4 overflow-x-auto">
                {albums.map((album, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            setCurrentAlbumIdx(i);
                        }}
                        className={`flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity ${i === currentAlbumIdx ? 'opacity-100 ring-2 ring-orange-500' : ''}`}
                        title={album.title}
                    >
                        <img src={album.cover} alt={album.title} className="w-10 h-10" />
                    </button>
                ))}
            </div>
        </div>
    );
}
