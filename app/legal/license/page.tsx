import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export const metadata: Metadata = { title: "License Agreement | VYNL.PRO" };

export default function LicensePage() {
    return (
        <div className="min-h-screen bg-[#07070e] text-white">
            <div className="border-b border-white/5 px-6 py-4 flex items-center gap-3">
                <Link href="/" className="flex items-center gap-2 mr-auto">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center">
                        <span className="font-black text-black text-sm italic">V</span>
                    </div>
                    <span className="font-black text-sm tracking-tight">VYNL.PRO</span>
                </Link>
                <Link href="/" className="flex items-center gap-1 text-xs text-neutral-500 hover:text-white transition-colors">
                    <ArrowLeft size={12} /> Home
                </Link>
            </div>
            <div className="max-w-3xl mx-auto px-6 py-16">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-600/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Lock size={20} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">License Agreement</h1>
                </div>
                <p className="text-xs text-neutral-600 mb-12 ml-[52px]">Last updated: February 25, 2026</p>

                <div className="flex flex-wrap gap-2 mb-12">
                    {[{ label: "Terms of Service", href: "/legal/terms" }, { label: "Privacy Policy", href: "/legal/privacy" }, { label: "License Agreement", href: "/legal/license" }, { label: "Trademark & Copyright", href: "/legal/trademark" }].map(l => (
                        <Link key={l.href} href={l.href} className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-neutral-600 hover:border-cyan-500/40 hover:text-cyan-400 transition-all">{l.label}</Link>
                    ))}
                </div>

                {[
                    { t: "1. Grant of License", c: "VYNL.PRO grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Platform for your personal and professional music career management purposes, in accordance with these Terms." },
                    { t: "2. Platform Access License", c: "This license permits you to: create and manage your artist profile; upload and manage your music, setlists, and creative content; use Booking, EPK, Gear Manager, and other tools; communicate with other users; access the PNW music ecosystem directory. This license does not permit resale, sublicensing, or commercial redistribution of the Platform." },
                    { t: "3. Content License to VYNL.PRO", c: "By uploading content to VYNL.PRO, you grant us a limited, non-exclusive, royalty-free license to: display your content to you and users you authorize; cache and process content to deliver the service; create thumbnails or previews for display purposes; aggregate anonymized metadata for service improvement. This license terminates when you delete the content or close your account." },
                    { t: "4. What We Will NEVER Do", c: "We will NEVER: sell your music, recordings, or creative content; license your music to streaming services, sync placements, or third parties without explicit written consent; use your music in AI training without consent; transfer your content to any entity not covered by these Terms." },
                    { t: "5. Artist Performance Contract Templates", c: "Contract templates provided by VYNL.PRO are for informational purposes only and do not constitute legal advice. You should consult a qualified attorney before executing binding agreements. VYNL.PRO is not liable for disputes arising from contracts generated through the Platform." },
                    { t: "6. Open Source Components", c: "VYNL.PRO uses open-source software under MIT, Apache 2.0, and other permissive licenses. These include Next.js, Prisma, and other components. Their respective license terms remain in effect." },
                    { t: "7. License Term and Termination", c: "This license is effective until terminated. Your rights immediately terminate if you violate any provision of these Terms. VYNL.PRO may terminate your license at any time with reasonable notice. Upon termination, you must cease all use of the Platform and may request an export of your data within 30 days." },
                    { t: "8. API and Developer Access", c: "If VYNL.PRO provides API access, its use is subject to a separate API License Agreement. Unauthorized scraping of the Platform or its data — including venue listings, artist profiles, and directory data — is strictly prohibited without written permission." },
                ].map(s => (
                    <div key={s.t} className="mb-8">
                        <h2 className="text-base font-bold text-white mb-3">{s.t}</h2>
                        <p className="text-neutral-400 leading-relaxed text-sm">{s.c}</p>
                    </div>
                ))}
            </div>
            <div className="border-t border-white/5 px-6 py-8 text-center">
                <p className="text-xs text-neutral-700">© {new Date().getFullYear()} VYNL.PRO. License questions: legal@vynl.pro</p>
            </div>
        </div>
    );
}
