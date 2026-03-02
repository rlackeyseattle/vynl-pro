import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata: Metadata = { title: "Privacy Policy | VYNL.PRO" };

export default function PrivacyPage() {
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
                        <Shield size={20} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Privacy Policy</h1>
                </div>
                <p className="text-xs text-neutral-600 mb-12 ml-[52px]">Last updated: February 25, 2026</p>

                <div className="flex flex-wrap gap-2 mb-12">
                    {[{ label: "Terms of Service", href: "/legal/terms" }, { label: "Privacy Policy", href: "/legal/privacy" }, { label: "License Agreement", href: "/legal/license" }, { label: "Trademark & Copyright", href: "/legal/trademark" }].map(l => (
                        <Link key={l.href} href={l.href} className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-neutral-600 hover:border-cyan-500/40 hover:text-cyan-400 transition-all">{l.label}</Link>
                    ))}
                </div>

                {[
                    { t: "1. Information We Collect", c: "We collect information you provide directly: name, email address, profile information (handle, bio, photos, music), payment information (processed securely by Stripe), and communications with other users. We also collect usage data such as pages visited, features used, login times, and device/browser information." },
                    { t: "2. How We Use Your Information", c: "We use your information to: operate and improve the Platform; personalize your experience; send service-related communications; facilitate connections with venues, collaborators, and fans; process payments; prevent fraud and abuse; and comply with legal obligations. We do NOT sell your personal information to third parties." },
                    { t: "3. Your Music and Creative Content", c: "Your music, recordings, artwork, and creative work remain yours. We store it solely to deliver the service. We do not claim ownership, license it to third parties, or use it in AI training datasets without your explicit consent." },
                    { t: "4. Information Sharing", c: "We share information only: (a) with your consent; (b) with service providers under strict confidentiality agreements (e.g., Vercel for hosting, Neon for database, Stripe for payments); (c) when required by law; (d) in connection with a business transfer, with notice to you." },
                    { t: "5. Data Retention", c: "We retain your account information as long as your account is active. You may request deletion of your account and associated data at any time. Some information may be retained for legal compliance purposes." },
                    { t: "6. Security", c: "We implement industry-standard security measures including encrypted data transmission (TLS), secure password hashing (bcrypt), and access controls. No method of internet transmission is 100% secure, and we cannot guarantee absolute security." },
                    { t: "7. Cookies", c: "We use session cookies for authentication and preference cookies for features like theme selection. We do not use third-party advertising cookies. You can disable cookies in your browser, though some features may not function correctly." },
                    { t: "8. Your Rights", c: "You have the right to: access your personal data; correct inaccurate data; request deletion of your data; export your data in a portable format; opt out of non-essential communications. To exercise these rights, contact us at privacy@vynl.pro." },
                    { t: "9. Children's Privacy", c: "VYNL.PRO is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with their information, please contact us." },
                    { t: "10. Changes", c: "We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on the Platform. Continued use after changes constitutes acceptance." },
                    { t: "11. Contact", c: "For privacy questions, contact us at privacy@vynl.pro or write to: VYNL.PRO, Legal Department, Seattle, WA 98101." },
                ].map(s => (
                    <div key={s.t} className="mb-8">
                        <h2 className="text-base font-bold text-white mb-3">{s.t}</h2>
                        <p className="text-neutral-400 leading-relaxed text-sm">{s.c}</p>
                    </div>
                ))}
            </div>
            <div className="border-t border-white/5 px-6 py-8 text-center">
                <p className="text-xs text-neutral-700">© {new Date().getFullYear()} VYNL.PRO. Your music, your data, your rights.</p>
            </div>
        </div>
    );
}
