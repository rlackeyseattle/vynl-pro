"use client";

import React, { useState } from "react";
import { User, Mail, AtSign, AlignLeft, Check, Loader2, Save, Globe, Instagram, Twitter, Youtube } from "lucide-react";

export default function ProfileSettings({ profile, onComplete }: { profile: any, onComplete?: () => void }) {
    const [handle, setHandle] = useState(profile.handle);
    const [bio, setBio] = useState(profile.bio || "");
    const [musicianType, setMusicianType] = useState(profile.musicianType || "");
    const [socialLinks, setSocialLinks] = useState(profile.socialLinks ? JSON.parse(profile.socialLinks) : {
        website: "",
        instagram: "",
        twitter: "",
        youtube: ""
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    handle,
                    bio,
                    musicianType,
                    socialLinks: JSON.stringify(socialLinks)
                }),
            });

            if (!res.ok) throw new Error("Update failed");

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                if (onComplete) onComplete();
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-neutral-900/50 border border-white/5 rounded-[2.5rem] p-10">
            <h2 className="text-sm font-black tracking-[0.3em] uppercase mb-8 flex items-center gap-3">
                <User size={14} className="text-vynl-teal" /> ARTIST IDENTITY
            </h2>

            <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase tracking-widest text-neutral-600 px-2">Public Handle</label>
                            <div className="relative">
                                <AtSign className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-700" size={14} />
                                <input
                                    type="text"
                                    required
                                    value={handle}
                                    onChange={(e) => setHandle(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-vynl-teal transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase tracking-widest text-neutral-600 px-2">Musician Type</label>
                            <input
                                type="text"
                                value={musicianType}
                                onChange={(e) => setMusicianType(e.target.value)}
                                placeholder="e.g. ELECTRONIC PRODUCER, JAZZ PIANIST..."
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-vynl-teal transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase tracking-widest text-neutral-600 px-2">Narrative / Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={4}
                                placeholder="ENTER THE LORE..."
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-vynl-teal transition-all resize-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-700">Social Connections</h3>

                        <SocialInput
                            icon={<Globe size={14} />}
                            label="Website"
                            value={socialLinks.website}
                            onChange={(v: string) => setSocialLinks({ ...socialLinks, website: v })}
                        />
                        <SocialInput
                            icon={<Instagram size={14} />}
                            label="Instagram"
                            value={socialLinks.instagram}
                            onChange={(v: string) => setSocialLinks({ ...socialLinks, instagram: v })}
                        />
                        <SocialInput
                            icon={<Twitter size={14} />}
                            label="Twitter / X"
                            value={socialLinks.twitter}
                            onChange={(v: string) => setSocialLinks({ ...socialLinks, twitter: v })}
                        />
                        <SocialInput
                            icon={<Youtube size={14} />}
                            label="YouTube"
                            value={socialLinks.youtube}
                            onChange={(v: string) => setSocialLinks({ ...socialLinks, youtube: v })}
                        />
                    </div>
                </div>

                {error && <p className="text-red-500 text-[8px] font-black uppercase tracking-widest">Error: {error}</p>}

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-5 rounded-3xl bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-vynl-teal transition-all flex items-center justify-center gap-3"
                >
                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    {success ? "IDENTITY SYNCED" : "COMMIT CHANGES"}
                </button>
            </form>
        </div>
    );
}

function SocialInput({ icon, label, value, onChange }: { icon: React.ReactNode, label: string, value: string, onChange: (v: string) => void }) {
    return (
        <div className="relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-700">
                {icon}
            </div>
            <input
                type="text"
                placeholder={label.toUpperCase()}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-vynl-teal transition-all"
            />
        </div>
    );
}
