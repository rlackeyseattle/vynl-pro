import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Copyright } from "lucide-react";

export const metadata: Metadata = { title: "Trademark & Copyright | VYNL.PRO" };

export default function TrademarkPage() {
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
                        <Copyright size={20} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Trademark & Copyright</h1>
                </div>
                <p className="text-xs text-neutral-600 mb-12 ml-[52px]">Last updated: February 25, 2026</p>

                <div className="flex flex-wrap gap-2 mb-12">
                    {[{ label: "Terms of Service", href: "/legal/terms" }, { label: "Privacy Policy", href: "/legal/privacy" }, { label: "License Agreement", href: "/legal/license" }, { label: "Trademark & Copyright", href: "/legal/trademark" }].map(l => (
                        <Link key={l.href} href={l.href} className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-neutral-600 hover:border-cyan-500/40 hover:text-cyan-400 transition-all">{l.label}</Link>
                    ))}
                </div>

                {/* VYNL Trademark */}
                <div className="p-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <span className="font-black text-black text-lg italic">V</span>
                        </div>
                        <div>
                            <p className="font-black text-xl tracking-tight">VYNL.PRO™</p>
                            <p className="text-xs text-neutral-500">Trademark Pending · All Rights Reserved</p>
                        </div>
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                        VYNL, VYNL.PRO, the VYNL logo, "Artist Console," "Stage Mode," "Wire," and related marks are trademarks or service marks of VYNL.PRO. You may not use these marks without prior written permission.
                    </p>
                </div>

                {[
                    { t: "Platform Copyright", c: "© 2025–2026 VYNL.PRO. All rights reserved. The VYNL.PRO platform, including its design, code, features, interface, and documentation, is protected by copyright law. Unauthorized reproduction, modification, distribution, or commercial use of any part of the Platform is strictly prohibited." },
                    { t: "Artist Content Copyright", c: "All music, lyrics, artwork, photography, videos, and other creative content uploaded by artists remains the exclusive property of the respective creators. VYNL.PRO claims no ownership over user-generated content. Artists are responsible for ensuring they have the rights to upload content to the Platform." },
                    { t: "DMCA Policy", c: "VYNL.PRO respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA). If you believe content on the Platform infringes your copyright, please submit a DMCA notice to: dmca@vynl.pro. Include: your contact information, identification of the infringing material, a statement of good faith belief, and your signature." },
                    { t: "Third-Party Trademarks", c: "Guitar brand names referenced in our theme system (Fender®, Gibson®, PRS®, Rickenbacker®, etc.) are trademarks of their respective owners. VYNL.PRO is not affiliated with or endorsed by these companies. These names are used descriptively in our UI for inspirational color palette references only." },
                    { t: "Permitted Use of VYNL Marks", c: "You may: reference VYNL.PRO by name in editorial/media contexts; use 'Powered by VYNL.PRO' with prior permission. You may NOT: use our marks in ways that imply endorsement; create confusingly similar marks; use our logo in merchandise; register domain names incorporating our marks." },
                    { t: "Reporting Infringement", c: "To report copyright or trademark infringement, contact us at: legal@vynl.pro. We respond to valid notices within 5 business days." },
                ].map(s => (
                    <div key={s.t} className="mb-8">
                        <h2 className="text-base font-bold text-white mb-3">{s.t}</h2>
                        <p className="text-neutral-400 leading-relaxed text-sm">{s.c}</p>
                    </div>
                ))}
            </div>
            <div className="border-t border-white/5 px-6 py-8 text-center">
                <p className="text-xs text-neutral-700">© {new Date().getFullYear()} VYNL.PRO™. All Rights Reserved.</p>
            </div>
        </div>
    );
}
