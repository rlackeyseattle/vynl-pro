"use client";

import React from 'react';
import '../styles/myspace.css';
import DiscographyPlayer from '../../components/DiscographyPlayer';
import discographyData from '../../lib/discography_data.json';
import { signOut } from "next-auth/react";
import { LogOut, User as UserIcon } from 'lucide-react';

interface ProfileProps {
    profile: {
        handle: string;
        bio: string | null;
        musicianType: string | null;
        avatarUrl: string | null;
        interests: string | null;
        gear: string | null;
        user: {
            name: string | null;
        }
    };
    sessionUser: {
        name?: string | null;
        email?: string | null;
    } | null;
}

export default function ProfileClient({ profile, sessionUser }: ProfileProps) {
    const interests = profile.interests ? JSON.parse(profile.interests) : {};
    const gear = profile.gear ? JSON.parse(profile.gear) : [];

    return (
        <div className="bg-[#e5e5e5] min-h-screen py-10">
            <div className="myspace-container">
                <header className="myspace-header justify-between">
                    <span>VYNL.PRO // Artist Profile</span>
                    {sessionUser && (
                        <div className="flex items-center gap-4 text-xs font-normal">
                            <span className="flex items-center gap-1"><UserIcon size={14} /> {sessionUser.name}</span>
                            <button
                                onClick={() => signOut()}
                                className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-colors"
                            >
                                <LogOut size={14} /> Logout
                            </button>
                        </div>
                    )}
                </header>

                <div className="profile-layout">
                    {/* LEFT COLUMN */}
                    <div className="left-col">
                        <h1 className="text-xl font-bold mb-4">{profile.user.name || profile.handle}</h1>

                        <div className="ms-box">
                            <div className="ms-box-content">
                                <img
                                    src={profile.avatarUrl || "/graphics/profile/main.jpg"}
                                    alt={profile.handle}
                                    className="w-full border border-gray-300"
                                />
                            </div>
                        </div>

                        <div className="contact-box">
                            <h3>Contacting {profile.user.name || profile.handle}</h3>
                            <div className="grid grid-cols-2 gap-2 text-[11px] mt-2">
                                <span className="text-blue-800 font-bold cursor-pointer hover:underline">Send Message</span>
                                <span className="text-blue-800 font-bold cursor-pointer hover:underline">Add to Friends</span>
                                <span className="text-blue-800 font-bold cursor-pointer hover:underline">Forward to Friend</span>
                                <span className="text-blue-800 font-bold cursor-pointer hover:underline">Add to Favorites</span>
                            </div>
                        </div>

                        <div className="ms-box">
                            <div className="ms-box-title">{profile.user.name || profile.handle}'s Interests</div>
                            <div className="ms-box-content text-xs space-y-2">
                                {interests.general && <p><strong>General:</strong> {interests.general}</p>}
                                {interests.music && <p><strong>Music:</strong> {interests.music}</p>}
                                {interests.tech && <p><strong>Tech:</strong> {interests.tech}</p>}
                                {!interests.general && !interests.music && !interests.tech && (
                                    <p className="italic text-gray-500">No interests listed yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="right-col">
                        <div className="ms-box bg-[#fff]">
                            <div className="ms-box-title">{profile.user.name || profile.handle}'s Discography</div>
                            <div className="ms-box-content">
                                <DiscographyPlayer albums={discographyData.albums} />
                            </div>
                        </div>

                        <div className="ms-box">
                            <div className="ms-box-title">Top 8 Friends</div>
                            <div className="ms-box-content">
                                <div className="grid-top8">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                        <div key={i} className="friend-item">
                                            <img
                                                src={`/graphics/friends/${i}.png`}
                                                alt={`Friend ${i}`}
                                                className="w-full aspect-square object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=VYNL';
                                                }}
                                            />
                                            <span>Friend {i}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {gear.length > 0 && (
                            <div className="ms-box">
                                <div className="ms-box-title">Tech & Gear</div>
                                <div className="ms-box-content text-xs">
                                    <ul className="list-disc list-inside space-y-1">
                                        {gear.map((item: string, idx: number) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        <div className="ms-box">
                            <div className="ms-box-title">Blurbs</div>
                            <div className="ms-box-content text-sm italic py-4">
                                {profile.bio || "This user hasn't added a bio yet."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
